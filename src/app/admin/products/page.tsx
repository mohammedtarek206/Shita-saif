"use client";

import React, { useState } from "react";
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiX, FiLink, 
  FiPackage, FiActivity, FiTag, FiPercent, FiDownload, FiCheck 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductsAdmin() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    nameAr: "", nameEn: "", descAr: "", descEn: "", category: "", subCategory: "", SKU: "", warranty: "", shippingStatus: "In Stock", colors: [""], price: "", discount: "", stock: "", images: [""],
    specs: [{ key: "", value: "" }]
  });
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Bulk Edit States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [bulkValue, setBulkValue] = useState<number>(0);
  const [isBulkExecuting, setIsBulkExecuting] = useState(false);

  const t = {
    title: language === "ar" ? "إدارة المنتجات" : "Product Management",
    subtitle: language === "ar" ? "إدارة وتعديل المخزون، الأسعار، المواصفات والخصومات لجميع الأجهزة" : "Manage stock, prices, specifications, and discounts for all appliances",
    totalProducts: language === "ar" ? "إجمالي المنتجات" : "Total Products",
    activeItems: language === "ar" ? "المنتجات النشطة" : "Active Items",
    lowStock: language === "ar" ? "مخزون منخفض" : "Low Stock Alert",
    outOfStock: language === "ar" ? "نفذ من المخزون" : "Out of Stock",
    searchPlaceholder: language === "ar" ? "البحث عن المنتجات..." : "Search products...",
    allCategories: language === "ar" ? "جميع الأقسام" : "All Categories",
    addBtn: language === "ar" ? "إضافة منتج" : "Add Product",
    productInfo: language === "ar" ? "معلومات المنتج" : "Product Information",
    category: language === "ar" ? "القسم" : "Category",
    pricing: language === "ar" ? "السعر" : "Pricing",
    inventory: language === "ar" ? "المخزون والكمية" : "Inventory & Stock",
    actions: language === "ar" ? "الإجراءات" : "Actions",
    units: language === "ar" ? "وحدة" : "Units",
    editBtn: language === "ar" ? "تعديل" : "Edit",
    deleteBtn: language === "ar" ? "حذف" : "Delete",
    confirmDelete: language === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟" : "Are you sure you want to permanently delete this product?",
    exportBtn: language === "ar" ? "تصدير المخزون CSV" : "Export Inventory CSV",

    // Bulk action text
    selectedCount: language === "ar" ? "منتج محدد" : "selected products",
    bulkActions: language === "ar" ? "العمليات الجماعية:" : "Bulk Actions:",
    bulkDiscount: language === "ar" ? "تطبيق خصم جماعي (%)" : "Apply Bulk Discount (%)",
    bulkAddStock: language === "ar" ? "إضافة كمية للمخزون" : "Add Stock Quantity",
    bulkRemoveStock: language === "ar" ? "خصم كمية من المخزون" : "Subtract Stock",
    bulkDelete: language === "ar" ? "حذف المنتجات المحددة" : "Bulk Delete Selected",
    applyBtn: language === "ar" ? "تطبيق" : "Apply",
    clearBtn: language === "ar" ? "إلغاء التحديد" : "Deselect All",
    confirmBulkDelete: language === "ar" ? "هل أنت متأكد من رغبتك في حذف جميع المنتجات المحددة دفعة واحدة؟" : "Are you sure you want to delete all selected products in bulk?",
  };

  const convertDriveLink = (url: string) => {
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    }
    return url;
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategoriesData(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchProducts();
    fetchCategoriesData();
  }, []);

  const handleAddProduct = async () => {
    try {
      setError("");
      setSuccess("");
      
      if (!newProduct.nameAr || !newProduct.nameEn || !newProduct.category || !newProduct.subCategory || !newProduct.price) {
        setError(language === "ar" ? "الرجاء تعبئة جميع الحقول المطلوبة (الاسم، القسم، القسم الفرعي، السعر)" : "Please fill all required fields (Name, Category, Sub Category, Price)");
        return;
      }

      const finalImages = newProduct.images.map(convertDriveLink).filter(url => url.trim() !== "");
      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
      const method = editingProduct ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ 
          ...newProduct, 
          title: { ar: newProduct.nameAr, en: newProduct.nameEn },
          description: { ar: newProduct.descAr, en: newProduct.descEn },
          price: Number(newProduct.price),
          discount: Number(newProduct.discount),
          stock: Number(newProduct.stock),
          images: finalImages,
          colors: newProduct.colors.filter(c => c.trim() !== "")
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setSuccess(language === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!");
        fetchProducts();
        setTimeout(() => closeModal(), 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save product");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setError("");
    setSuccess("");
    setNewProduct({ nameAr: "", nameEn: "", descAr: "", descEn: "", category: "", subCategory: "", SKU: "", warranty: "", shippingStatus: "In Stock", colors: [""], price: "", discount: "", stock: "", images: [""], specs: [{ key: "", value: "" }] });
  };

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      nameAr: product.title?.ar || "",
      nameEn: product.title?.en || "",
      descAr: product.description?.ar || "",
      descEn: product.description?.en || "",
      category: (typeof product.category === "object" ? product.category?._id : product.category) || "",
      subCategory: product.subCategory || "",
      SKU: product.SKU || "",
      warranty: product.warranty || "",
      shippingStatus: product.shippingStatus || "In Stock",
      colors: product.colors?.length ? product.colors : [""],
      price: product.price || "",
      discount: product.discount || "",
      stock: product.stock || "",
      images: product.images?.length ? product.images : [""],
      specs: product.specifications?.en || [{ key: "", value: "" }]
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk operation execution
  const executeBulkAction = async () => {
    if (selectedIds.length === 0 || !bulkAction) return;
    if (bulkAction === "delete" && !confirm(t.confirmBulkDelete)) return;

    setIsBulkExecuting(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          action: bulkAction,
          value: Number(bulkValue)
        })
      });
      if (res.ok) {
        fetchProducts();
        setSelectedIds([]);
        setBulkAction("");
        setBulkValue(0);
      } else {
        const errData = await res.json();
        alert(errData.error || "Bulk action failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBulkExecuting(false);
    }
  };

  // CSV Export Utility
  const exportToCSV = () => {
    const headers = ["Name(AR),Name(EN),Category,SKU,Price,Discount(%),Stock,Warranty\n"];
    const rows = products.map(p => {
      const catName = typeof p.category === "object" && p.category?.name
        ? (language === "ar" ? p.category.name.ar : p.category.name.en)
        : (p.category || "");
      return `"${p.title?.ar || ''}","${p.title?.en || ''}","${catName}","${p.SKU || ''}",${p.price},${p.discount || 0},${p.stock || 0},"${p.warranty || ''}"\n`;
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.concat(rows).join("");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.title?.ar?.includes(searchTerm);
    const catId = typeof p.category === "object" ? p.category?._id : p.category;
    const matchesCategory = selectedCategory === "All" || catId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-32">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.totalProducts, value: products.length, icon: <FiPackage />, color: "from-blue-500 to-blue-600" },
          { label: t.activeItems, value: products.filter(p => p.stock > 0).length, icon: <FiActivity />, color: "from-emerald-500 to-emerald-600" },
          { label: t.lowStock, value: products.filter(p => p.stock > 0 && p.stock < 5).length, icon: <FiFilter />, color: "from-amber-500 to-amber-600" },
          { label: t.outOfStock, value: products.filter(p => p.stock === 0).length, icon: <FiX />, color: "from-rose-500 to-rose-600" },
        ].map((stat, i) => (
          <div key={`item-${i}`} className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] flex items-center gap-4 shadow-md">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-6 py-3.5 border border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            <FiDownload /> {t.exportBtn}
          </button>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3.5 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 rounded-2xl font-black outline-none focus:ring-2 focus:ring-primary cursor-pointer text-sm"
          >
            <option value="All" className="bg-white dark:bg-black font-bold">{t.allCategories}</option>
            {categoriesData.map(cat => (
              <option key={(cat as any)?._id || (cat as any)?.id || (cat as any)?.slug || (cat as any)?.name || (cat as any)?.title?.en || (cat as any)?.title?.ar || JSON.stringify(cat).substring(0, 20)} value={cat._id} className="bg-white dark:bg-black font-bold">
                {language === "ar" ? cat.name?.ar : cat.name?.en}
              </option>
            ))}
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm"
          >
            <FiPlus /> {t.addBtn}
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-white/[0.02] rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left rtl:text-right">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-white/5">
              {/* Checkbox Header */}
              <th className="py-6 px-6 w-12 text-center">
                <input 
                  type="checkbox"
                  checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(filteredProducts.map(p => p._id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  className="w-4 h-4 rounded accent-primary border-gray-300 cursor-pointer"
                />
              </th>
              <th className="px-6 py-6">{t.productInfo}</th>
              <th className="px-6 py-6">{t.category}</th>
              <th className="px-6 py-6">{t.pricing}</th>
              <th className="px-6 py-6">{t.inventory}</th>
              <th className="px-6 py-6 text-right rtl:text-left">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredProducts.map((product) => (
              <tr key={(product as any)?._id || (product as any)?.id || (product as any)?.slug || (product as any)?.name || (product as any)?.title?.en || (product as any)?.title?.ar || JSON.stringify(product).substring(0, 20)} className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors group">
                {/* Checkbox */}
                <td className="py-5 px-6 text-center">
                  <input 
                    type="checkbox"
                    checked={selectedIds.includes(product._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, product._id]);
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== product._id));
                      }
                    }}
                    className="w-4 h-4 rounded accent-primary border-gray-300 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-2 flex items-center justify-center overflow-hidden">
                      <img 
                        src={product.images?.[0] || "/placeholder.png"} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="font-black text-sm text-gray-900 dark:text-white">{product.title?.en}</div>
                      <div className="text-[10px] font-bold text-gray-500">{product.title?.ar}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-4 py-1.5 bg-blue-500/10 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {typeof product.category === "object" && product.category?.name
                      ? (language === "ar" ? product.category.name.ar : product.category.name.en)
                      : product.category}
                  </span>
                </td>
                <td className="px-6 py-5 font-black text-primary">
                  <div className="flex flex-col">
                    {product.discount > 0 && (
                      <span className="text-[10px] text-gray-400 line-through opacity-50">
                        {product.price.toLocaleString()} EGP
                      </span>
                    )}
                    <span className="text-lg">
                      {(product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price).toLocaleString()} <span className="text-[10px]">EGP</span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'} shadow-sm`} />
                      <span className="font-black text-sm">{product.stock} {t.units}</span>
                    </div>
                    <div className="w-24 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${Math.min(product.stock * 5, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right rtl:text-left">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button onClick={() => startEdit(product)} className="w-10 h-10 flex items-center justify-center bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/10">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div key={(product as any)?._id || (product as any)?.id || (product as any)?.slug || (product as any)?.name || (product as any)?.title?.en || (product as any)?.title?.ar || JSON.stringify(product).substring(0, 20)} className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] space-y-6 relative shadow-md">
            {/* Mobile Checkbox */}
            <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto">
              <input 
                type="checkbox"
                checked={selectedIds.includes(product._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds([...selectedIds, product._id]);
                  } else {
                    setSelectedIds(selectedIds.filter(id => id !== product._id));
                  }
                }}
                className="w-4 h-4 rounded accent-primary border-gray-300 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 p-2 shrink-0 border border-gray-100 dark:border-white/10 flex items-center justify-center">
                <img src={product.images?.[0] || "/placeholder.png"} className="w-full h-full object-contain" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-sm truncate">{product.title?.en}</h3>
                <p className="text-[10px] font-bold text-gray-500 truncate">{product.title?.ar}</p>
                <span className="mt-1 inline-block px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-lg text-[8px] font-black uppercase tracking-widest">
                  {typeof product.category === "object" && product.category?.name
                      ? (language === "ar" ? product.category.name.ar : product.category.name.en)
                      : (categoriesData.find(c => c._id === product.category)?.name[language === "ar" ? "ar" : "en"] || product.category)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <div>
                <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">{t.pricing}</p>
                <p className="font-black text-primary">{(product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price).toLocaleString()} EGP</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">{t.inventory}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <p className="font-black">{product.stock} {t.units}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => startEdit(product)} className="flex-1 py-3 bg-blue-500/10 text-blue-500 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2">
                <FiEdit2 size={14} /> {t.editBtn}
              </button>
              <button onClick={() => handleDelete(product._id)} className="flex-1 py-3 bg-rose-500/10 text-rose-500 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2">
                <FiTrash2 size={14} /> {t.deleteBtn}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Glass Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 bg-black/80 dark:bg-[#111]/80 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center gap-4 z-50 max-w-4xl"
          >
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs animate-bounce">
                {selectedIds.length}
              </div>
              <span className="font-black text-sm uppercase tracking-wider">{t.selectedCount}</span>
            </div>

            <div className="h-px md:h-8 w-full md:w-px bg-white/10" />

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.bulkActions}</span>
              
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs outline-none cursor-pointer"
              >
                <option value="" className="text-black">{language === "ar" ? "-- اختر عملية --" : "-- Select Action --"}</option>
                <option value="set_discount" className="text-black">{t.bulkDiscount}</option>
                <option value="add_stock" className="text-black">{t.bulkAddStock}</option>
                <option value="remove_stock" className="text-black">{t.bulkRemoveStock}</option>
                <option value="delete" className="text-black">{t.bulkDelete}</option>
              </select>

              {bulkAction && bulkAction !== "delete" && (
                <input 
                  type="number"
                  placeholder={bulkAction === "set_discount" ? "Discount %" : "Quantity"}
                  value={bulkValue}
                  onChange={(e) => setBulkValue(Number(e.target.value))}
                  className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs outline-none focus:border-primary"
                />
              )}

              <button
                disabled={isBulkExecuting || !bulkAction}
                onClick={executeBulkAction}
                className="px-4 py-2 bg-primary text-white rounded-xl font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <FiCheck /> {t.applyBtn}
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl font-bold text-xs hover:bg-white/10 transition-all"
              >
                {t.clearBtn}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#0F0F0F] w-full max-w-2xl rounded-[3rem] p-6 md:p-10 shadow-2xl space-y-8 border border-gray-100 dark:border-white/10 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-[#0F0F0F] pb-4 z-10">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic text-gray-900 dark:text-white">
                  {editingProduct ? (language === "ar" ? "تعديل المنتج" : "Edit Product") : (language === "ar" ? "منتج جديد" : "New Product")}
                </h2>
                <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                  <FiX className="text-2xl" />
                </button>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-between">
                  {error}
                  <button onClick={() => setError("")}><FiX /></button>
                </div>
              )}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-between">
                  {success}
                  <button onClick={() => setSuccess("")}><FiX /></button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "الاسم (بالعربية)" : "Name (Arabic)"}</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm"
                    value={newProduct.nameAr} onChange={(e) => setNewProduct({...newProduct, nameAr: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "الاسم (بالإنجليزية)" : "Name (English)"}</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm"
                    value={newProduct.nameEn} onChange={(e) => setNewProduct({...newProduct, nameEn: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "الوصف (بالعربية)" : "Description (Arabic)"}</label>
                  <textarea rows={3} className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm resize-none"
                    value={newProduct.descAr} onChange={(e) => setNewProduct({...newProduct, descAr: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "الوصف (بالإنجليزية)" : "Description (English)"}</label>
                  <textarea rows={3} className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm resize-none"
                    value={newProduct.descEn} onChange={(e) => setNewProduct({...newProduct, descEn: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "القسم الرئيسي" : "Category"}</label>
                  <select className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary hover:border-primary/30 rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm cursor-pointer shadow-sm"
                    value={newProduct.category} 
                    onChange={(e) => {
                      console.log("Category changed, resetting subCategory. New Category:", e.target.value);
                      setNewProduct({...newProduct, category: e.target.value, subCategory: ""});
                    }}>
                    <option value="">{language === "ar" ? "اختر القسم الرئيسي" : "Select Category"}</option>
                    {categoriesData.map(cat => (
                      <option key={(cat as any)?._id || (cat as any)?.id || (cat as any)?.slug || (cat as any)?.name || (cat as any)?.title?.en || (cat as any)?.title?.ar || JSON.stringify(cat).substring(0, 20)} value={cat._id}>{cat.name?.en} / {cat.name?.ar}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "القسم الفرعي" : "Sub Category"}</label>
                  <select className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary hover:border-primary/30 rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm cursor-pointer shadow-sm"
                    value={newProduct.subCategory} 
                    onChange={(e) => {
                      console.log("SubCategory selected:", e.target.value);
                      setNewProduct({...newProduct, subCategory: e.target.value});
                    }}>
                    <option value="">{language === "ar" ? "اختر القسم الفرعي" : "Select Sub Category"}</option>
                    {newProduct.category && categoriesData.find(c => c._id === newProduct.category)?.subCategories?.map((sub: any) => (
                      <option key={sub._id} value={sub._id}>{sub.name?.en} / {sub.name?.ar}</option>
                    ))}
                  </select>
                  {!newProduct.subCategory && newProduct.category && (
                    <p className="text-xs text-rose-500 font-bold px-2 flex items-center gap-1">
                      {language === "ar" ? "يجب اختيار القسم الفرعي" : "Sub Category is required"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">SKU</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm"
                    value={newProduct.SKU} onChange={(e) => setNewProduct({...newProduct, SKU: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "الضمان" : "Warranty"}</label>
                  <input type="text" placeholder="e.g. 2 Years" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm"
                    value={newProduct.warranty} onChange={(e) => setNewProduct({...newProduct, warranty: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "السعر الأساسي (ج.م)" : "Price (EGP)"}</label>
                  <input type="number" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm"
                    value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "نسبة الخصم (%)" : "Discount (%)"}</label>
                  <input type="number" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm"
                    value={newProduct.discount} onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "الكمية المتاحة بالمخزن" : "Stock Inventory"}</label>
                  <input type="number" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm"
                    value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{language === "ar" ? "روابط الصور (تدعم جوجل درايف)" : "Image Links (Supports Google Drive)"}</label>
                    <button 
                      type="button"
                      onClick={() => setNewProduct({...newProduct, images: [...newProduct.images, ""]})}
                      className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:text-primary/80 transition-colors"
                    >
                      <FiPlus /> Add Image
                    </button>
                  </div>
                  {newProduct.images.map((img, index) => (
                    <div key={`item-${index}`} className="relative group flex items-center gap-2">
                      <div className="relative flex-1">
                        <FiLink className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors" />
                        <input type="text" placeholder="Paste image URL here..." className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-3xl outline-none font-bold transition-all text-gray-900 dark:text-white text-sm"
                          value={img} onChange={(e) => {
                            const newImages = [...newProduct.images];
                            newImages[index] = e.target.value;
                            setNewProduct({...newProduct, images: newImages});
                          }} />
                      </div>
                      {newProduct.images.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newImages = [...newProduct.images];
                            newImages.splice(index, 1);
                            setNewProduct({...newProduct, images: newImages});
                          }}
                          className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center shrink-0 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleAddProduct} className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-lg uppercase tracking-widest italic">
                {editingProduct ? "Save Changes" : "Create Product"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
