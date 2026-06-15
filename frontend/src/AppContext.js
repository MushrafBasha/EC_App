import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AppContext = createContext();

const translations = {
  en: {
    hello: "Hello",
    cart: "Cart",
    support: "Support",
    search: "Search for premium products...",
    admin: "Admin",
    signOut: "Sign Out",
    welcome: "Welcome",
    shopNow: "Shop Now",
    location: "Deliver to"
  },
  ta: {
    hello: "வணக்கம்",
    cart: "வண்டி",
    support: "ஆதரவு",
    search: "தேடுக...",
    admin: "நிர்வாகி",
    signOut: "வெளியேறு",
    welcome: "வரவேற்கிறோம்",
    shopNow: "இப்போதே வாங்குங்கள்",
    location: "வழங்குமிடம்"
  },
  ml: {
    hello: "നമസ്കാരം",
    cart: "കാർട്ട്",
    support: "പിന്തുണ",
    search: "തിരയുക...",
    admin: "അഡ്മിൻ",
    signOut: "പുറത്തുകടക്കുക",
    welcome: "സ്വാഗതം",
    shopNow: "ഇപ്പോൾ വാങ്ങുക",
    location: "വിതരണം"
  },
  hi: {
    hello: "नमस्ते",
    cart: "कार्ट",
    support: "सहायता",
    search: "खोजें...",
    admin: "एडमिन",
    signOut: "लॉग आउट",
    welcome: "स्वागत है",
    shopNow: "अभी खरीदें",
    location: "डिलीवरी"
  },
  te: {
    hello: "నమస్కారం",
    cart: "కార్ట్",
    support: "మద్దతు",
    search: "శోధించండి...",
    admin: "అడ్మిన్",
    signOut: "లాగ్అవుట్",
    welcome: "స్వాగతం",
    shopNow: "ఇప్పుడే కొనండి",
    location: "డెలివరీ"
  }
};

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [loct, setLoct] = useState(localStorage.getItem('location') || 'Detecting...');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    // Save location to avoid repeated requests if needed
  }, [loct]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const fallbackIPDetect = useCallback(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city && data.country_name) {
          setLoct(`${data.city}, ${data.country_name}`);
          localStorage.setItem('location', `${data.city}, ${data.country_name}`);
        } else {
          setLoct("India");
        }
      })
      .catch(() => setLoct("Global / World"));
  }, [setLoct]);

  const requestLocation = useCallback(() => {
    // Try High Precision Geolocation first
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap reverse geocoding (free, no key needed)
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              const city = data.address.city || data.address.town || data.address.village || "Unknown";
              const country = data.address.country || "India";
              setLoct(`${city}, ${country}`);
              localStorage.setItem('location', `${city}, ${country}`);
            })
            .catch(() => fallbackIPDetect());
        },
        () => fallbackIPDetect()
      );
    } else {
      fallbackIPDetect();
    }
  }, [setLoct, fallbackIPDetect]);

  return (
    <AppContext.Provider value={{ lang, setLang, loct, setLoct, t, requestLocation }}>
      {children}
    </AppContext.Provider>
  );
};
