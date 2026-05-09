"use client";

import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormData } from "@/lib/validations";
import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  tourId?: string;
  tourName?: string;
  className?: string;
}

export default function InquiryForm({ tourId, tourName, className }: Props) {
  const t = useTranslations("inquiry");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      tour_id: tourId,
      tour_name_text: tourName,
      locale,
      guests: 1,
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(t("error"));
    }
  };

  if (submitted) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-10 text-center", className)}>
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-primary-700" />
        </div>
        <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
          {t("success")}
        </h3>
        <p className="text-sm text-muted mt-1">We&apos;ll be in touch within 24 hours.</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 text-sm transition-all duration-200 bg-white";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      <input type="hidden" {...register("tour_id")} />
      <input type="hidden" {...register("tour_name_text")} />
      <input type="hidden" {...register("locale")} />

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("name")} <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            placeholder={t("namePlaceholder")}
            className={inputClass}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("email")} <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            className={inputClass}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("phone")}
          </label>
          <input
            {...register("phone")}
            type="tel"
            placeholder={t("phonePlaceholder")}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("travelDate")}
            </label>
            <input
              {...register("travel_date")}
              type="date"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("guests")}
            </label>
            <input
              {...register("guests", { valueAsNumber: true })}
              type="number"
              min={1}
              max={50}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("message")}
          </label>
          <textarea
            {...register("message")}
            rows={3}
            placeholder={t("messagePlaceholder")}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-700 hover:bg-primary-600 disabled:opacity-70 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.01] disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {isSubmitting ? t("sending") : t("send")}
      </button>
    </form>
  );
}
