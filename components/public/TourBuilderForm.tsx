"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const DESTINATIONS = [
  { name: "Colombo", icon: "🏙️" },
  { name: "Kandy", icon: "🏛️" },
  { name: "Galle", icon: "🏰" },
  { name: "Ella", icon: "🌿" },
  { name: "Sigiriya", icon: "🪨" },
  { name: "Yala", icon: "🐆" },
  { name: "Mirissa", icon: "🐋" },
  { name: "Nuwara Eliya", icon: "🍵" },
  { name: "Trincomalee", icon: "⛱️" },
  { name: "Jaffna", icon: "🌺" },
];

const INTERESTS = [
  { name: "Culture", icon: "🏛️" },
  { name: "Wildlife", icon: "🦚" },
  { name: "Beach", icon: "🏖️" },
  { name: "Food", icon: "🍛" },
  { name: "Adventure", icon: "🧗" },
  { name: "Photography", icon: "📸" },
  { name: "Wellness", icon: "🧘" },
  { name: "Honeymoon", icon: "💑" },
];

const BUDGET_TIERS = [
  { value: "budget", label: "Budget", desc: "Comfortable & affordable", icon: "💰" },
  { value: "mid-range", label: "Mid-Range", desc: "Quality & comfort", icon: "✨" },
  { value: "luxury", label: "Luxury", desc: "Premium experiences", icon: "👑" },
];

interface FormData {
  destinations: string[];
  travel_date: string;
  duration_days: number;
  guests: number;
  interests: string[];
  budget_tier: string;
  budget_lkr: string;
  name: string;
  email: string;
  phone: string;
  special_requests: string;
}

const INITIAL: FormData = {
  destinations: [],
  travel_date: "",
  duration_days: 7,
  guests: 2,
  interests: [],
  budget_tier: "",
  budget_lkr: "",
  name: "",
  email: "",
  phone: "",
  special_requests: "",
};

export default function TourBuilderForm() {
  const t = useTranslations("buildTour");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const toggle = (field: "destinations" | "interests", val: string) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(val)
        ? f[field].filter((v) => v !== val)
        : [...f[field], val],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/custom-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration_days: Number(form.duration_days),
          guests: Number(form.guests),
          budget_lkr: form.budget_lkr ? Number(form.budget_lkr) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94XXXXXXXXX";
    return (
      <div className="text-center py-16">
        <CheckCircle className="w-16 h-16 text-primary-700 mx-auto mb-6" />
        <h2 className="font-playfair text-2xl font-bold mb-4">{t("success")}</h2>
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
        >
          💬 {t("whatsappCta")}
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0">
            <div
              className="h-full bg-primary-600 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
          {[t("step1"), t("step2"), t("step3")].map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-2 z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ring-2",
                  step > i + 1
                    ? "bg-primary-700 text-white ring-primary-200"
                    : step === i + 1
                    ? "bg-secondary text-white ring-secondary-200 scale-110 shadow-md"
                    : "bg-white text-gray-400 ring-gray-200"
                )}
              >
                {step > i + 1 ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={cn("text-xs hidden sm:block font-medium", step === i + 1 ? "text-foreground" : "text-muted")}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">{t("destinations")}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => toggle("destinations", d.name)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                    form.destinations.includes(d.name)
                      ? "bg-primary-700 border-primary-700 text-white shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50"
                  )}
                >
                  <span>{d.icon}</span>
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("travelDate")}</label>
              <input
                type="date"
                value={form.travel_date}
                onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("groupSize")}</label>
              <input
                type="number"
                min={1}
                max={50}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("duration")}: <strong>{form.duration_days} days</strong></label>
            <input
              type="range"
              min={1}
              max={21}
              value={form.duration_days}
              onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) })}
              className="w-full accent-primary-700"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>1 day</span>
              <span>21 days</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">{t("interests")}</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest.name}
                  type="button"
                  onClick={() => toggle("interests", interest.name)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                    form.interests.includes(interest.name)
                      ? "bg-secondary border-secondary text-white shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-secondary-300 hover:bg-secondary-50"
                  )}
                >
                  <span>{interest.icon}</span>
                  <span>{interest.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">{t("budget")}</label>
            <div className="grid grid-cols-3 gap-3">
              {BUDGET_TIERS.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setForm({ ...form, budget_tier: tier.value })}
                  className={cn(
                    "p-4 rounded-xl border text-center transition-all duration-200",
                    form.budget_tier === tier.value
                      ? "bg-primary-700 border-primary-700 text-white shadow-md scale-105"
                      : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                  )}
                >
                  <p className="text-2xl mb-1">{tier.icon}</p>
                  <p className="font-semibold text-sm">{tier.label}</p>
                  <p className={cn("text-xs mt-0.5", form.budget_tier === tier.value ? "text-white/80" : "text-muted")}>
                    {tier.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("budgetLKR")} (optional)</label>
            <input
              type="number"
              value={form.budget_lkr}
              onChange={(e) => setForm({ ...form, budget_lkr: e.target.value })}
              placeholder="e.g. 500000"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
            />
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("name")} *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("phone")}</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("email")} *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("specialRequests")}</label>
            <textarea
              rows={4}
              value={form.special_requests}
              onChange={(e) => setForm({ ...form, special_requests: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm resize-none"
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> {t("prev")}
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && form.destinations.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
          >
            {t("next")} <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.name || !form.email}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        )}
      </div>
    </div>
  );
}
