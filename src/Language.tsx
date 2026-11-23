import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { hindi } from "./translations";

type Language = "en" | "hi";
const LanguageContext = createContext({
  language: "en" as Language,
  toggleLanguage: () => {},
  t: (text: string) => text,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === "hi" ? "हमारा साथ — विवाह निमंत्रण" : "Our Forever — A Wedding Celebration";
  }, [language]);
  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage: () => setLanguage((current) => (current === "en" ? "hi" : "en")),
        t: (text) => (language === "hi" ? (hindi[text] ?? text) : text),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <div className="language-widget">
      <button
        type="button"
        className="language-toggle"
        onClick={toggleLanguage}
        lang={language === "en" ? "hi" : "en"}
        aria-label={language === "en" ? "निमंत्रण हिंदी में पढ़ें" : "Read the invitation in English"}
        title={language === "en" ? "Switch to Hindi" : "अंग्रेज़ी में पढ़ें"}
      >
        <span className="language-symbol" aria-hidden="true">
          {language === "en" ? "अ" : "A"}
        </span>
        <span>{language === "en" ? "हिन्दी" : "English"}</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {language === "hi" ? "निमंत्रण अब हिंदी में है।" : "The invitation is now in English."}
      </span>
    </div>
  );
}
