import React from "react";
import { useLanguage } from "./LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage } = useLanguage();
  
  const currentLang = languages.find(l => l.code === language) || languages[0];

  if (compact) {
    return (
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[140px] bg-white/40 border-0">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span className="text-xl">{currentLang.flag}</span>
              <span className="font-semibold text-sm">{currentLang.code.toUpperCase()}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="bg-white/40 rounded-xl p-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Idioma
      </p>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="bg-white border-slate-200">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span className="text-2xl">{currentLang.flag}</span>
              <span className="font-semibold">{currentLang.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}