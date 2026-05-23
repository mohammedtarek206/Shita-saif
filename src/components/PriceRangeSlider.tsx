"use client";

import React, { useCallback, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  PRICE_FILTER_MIN,
  PRICE_FILTER_MAX,
  PRICE_FILTER_STEP,
} from "@/constants/pricing";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onChange: (range: { min: number; max: number }) => void;
}

const formatPrice = (value: number, language: string) =>
  value.toLocaleString(language === "ar" ? "ar-EG" : "en-US");

const PriceRangeSlider = ({ min, max, onChange }: PriceRangeSliderProps) => {
  const { language } = useLanguage();
  const currency = language === "ar" ? "ج.م" : "EGP";

  const minPercent = useMemo(
    () => ((min - PRICE_FILTER_MIN) / (PRICE_FILTER_MAX - PRICE_FILTER_MIN)) * 100,
    [min]
  );
  const maxPercent = useMemo(
    () => ((max - PRICE_FILTER_MIN) / (PRICE_FILTER_MAX - PRICE_FILTER_MIN)) * 100,
    [max]
  );

  const handleMinChange = useCallback(
    (value: number) => {
      const nextMin = Math.min(value, max - PRICE_FILTER_STEP);
      onChange({ min: Math.max(PRICE_FILTER_MIN, nextMin), max });
    },
    [max, onChange]
  );

  const handleMaxChange = useCallback(
    (value: number) => {
      const nextMax = Math.max(value, min + PRICE_FILTER_STEP);
      onChange({ min, max: Math.min(PRICE_FILTER_MAX, nextMax) });
    },
    [min, onChange]
  );

  return (
    <div className="space-y-5">
      <div className="relative h-2.5 rounded-full bg-gray-100 dark:bg-white/10">
        <div
          className="absolute inset-y-0 rounded-full bg-gradient-to-r from-secondary to-primary transition-[left,right] duration-150"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={PRICE_FILTER_MIN}
          max={PRICE_FILTER_MAX}
          step={PRICE_FILTER_STEP}
          value={min}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="price-range-thumb price-range-thumb--min absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
          aria-label={language === "ar" ? "الحد الأدنى للسعر" : "Minimum price"}
        />
        <input
          type="range"
          min={PRICE_FILTER_MIN}
          max={PRICE_FILTER_MAX}
          step={PRICE_FILTER_STEP}
          value={max}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="price-range-thumb price-range-thumb--max absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
          aria-label={language === "ar" ? "الحد الأقصى للسعر" : "Maximum price"}
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-bold">
        <span className="rounded-xl bg-gray-50 dark:bg-white/5 px-3 py-2 tabular-nums">
          {formatPrice(min, language)} {currency}
        </span>
        <span className="text-gray-400">—</span>
        <span className="rounded-xl bg-primary/10 text-primary px-3 py-2 tabular-nums">
          {formatPrice(max, language)} {currency}
        </span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
