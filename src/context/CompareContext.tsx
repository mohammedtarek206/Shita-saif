"use client";

import React, { createContext, useContext, useState } from "react";

interface CompareProduct {
  _id: string;
  title: { ar: string; en: string };
  price: number;
  discount?: number;
  images: string[];
  category: string;
  specifications?: any;
  warranty?: string;
}

interface CompareContextType {
  compareList: CompareProduct[];
  addToCompare: (product: CompareProduct) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [compareList, setCompareList] = useState<CompareProduct[]>([]);

  const addToCompare = (product: CompareProduct) => {
    if (compareList.length >= 3) return; // max 3
    if (compareList.find(p => p._id === product._id)) return;
    setCompareList(prev => [...prev, product]);
  };

  const removeFromCompare = (id: string) =>
    setCompareList(prev => prev.filter(p => p._id !== id));

  const clearCompare = () => setCompareList([]);

  const isInCompare = (id: string) => compareList.some(p => p._id === id);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};
