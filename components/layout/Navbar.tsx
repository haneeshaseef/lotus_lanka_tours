"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Leaf } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/public/LanguageSwitcher";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "/", label: t("home") },
    { href: "/tours", label: t("tours") },
    { href: "/blog", label: t("blog") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        solid
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span
                className={cn(
                  "text-lg font-playfair font-bold leading-tight",
                  solid ? "text-primary-700" : "text-white"
                )}
              >
                Lotus Lanka
              </span>
              <span
                className={cn(
                  "block text-xs tracking-widest uppercase",
                  solid ? "text-secondary-600" : "text-secondary-300"
                )}
              >
                Tours
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href as "/"}
                className={cn(
                  "relative text-sm font-medium transition-colors group",
                  isActive(link.href)
                    ? solid
                      ? "text-primary-700"
                      : "text-white"
                    : solid
                    ? "text-gray-700 hover:text-primary-700"
                    : "text-white/90 hover:text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300",
                    isActive(link.href)
                      ? "w-full bg-secondary-400"
                      : solid
                      ? "w-0 group-hover:w-full bg-primary-400"
                      : "w-0 group-hover:w-full bg-secondary-400"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher scrolled={solid} />
            <Link
              href="/build-your-tour"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-linear-to-r from-secondary-600 to-secondary text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              {t("buildTour")}
            </Link>
            {/* Mobile toggle */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                solid
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out",
            mobileOpen ? "max-h-screen py-4" : "max-h-0"
          )}
        >
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href as "/"}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-700 border-l-2 border-primary-700 pl-3.5"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-3">
              <Link
                href="/build-your-tour"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-full text-sm font-semibold bg-linear-to-r from-secondary-600 to-secondary text-white hover:opacity-90 transition-opacity shadow-sm"
              >
                {t("buildTour")}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
