"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import React from "react";

const LOCALES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "si", label: "සි", flag: "🇱🇰" },
  { code: "ta", label: "தா", flag: "🇱🇰" },
];

export default function LanguageSwitcher({ scrolled }: { scrolled?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className={cn(
      "flex items-center gap-0.5 rounded-full px-1.5 py-1 transition-all duration-200",
      scrolled ? "bg-gray-100" : "bg-white/10"
    )}>
      <Globe className={cn("w-3.5 h-3.5 mr-1", scrolled ? "text-gray-400" : "text-white/60")} />
      {LOCALES.map((l, idx) => (
        <React.Fragment key={l.code}>
          {idx > 0 && (
            <span className={cn("text-xs select-none", scrolled ? "text-gray-300" : "text-white/30")}>|</span>
          )}
          <button
            onClick={() => handleChange(l.code)}
            disabled={isPending}
            className={cn(
              "px-1.5 py-0.5 rounded-md text-xs font-medium transition-all duration-200",
              locale === l.code
                ? scrolled
                  ? "bg-white text-primary-700 font-bold shadow-sm"
                  : "bg-white/25 text-white font-bold"
                : scrolled
                ? "text-gray-500 hover:text-primary-700"
                : "text-white/70 hover:text-white"
            )}
          >
            {l.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
