"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiLink, FiFolder, FiList } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [newCategory, setNewCategory] = useState({
    nameAr: "",
    nameEn: "",
    slug: "",
    image: "",
    icon: "",
    descAr: "",
    descEn: "",
    subCategories: [{ nameAr: "", nameEn: "", slug: "" }]
  });

  const convertDriveLink = (url: string) => {
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    }
    return url;
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      setError("");
      setSuccess("");
      
      if (!newCategory.nameAr || !newCategory.nameEn || !newCategory.slug || !newCategory.image || !newCategory.icon) {
        setError("Please fill all required fields (Names, Slug, Image, Icon)");
        return;
      }

      const url = editingCategory ? `/api/admin/categories/${editingCategory._id}` : "/api/admin/categories";
      const method = editingCategory ? "PATCH" : "POST";
      
      const payload = {
        name: { ar: newCategory.nameAr, en: newCategory.nameEn },
        slug: newCategory.slug,
        image: convertDriveLink(newCategory.image),
        icon: convertDriveLink(newCategory.icon),
        description: { ar: newCategory.descAr, en: newCategory.descEn },
        subCategories: newCategory.subCategories.filter(s => s.nameAr || s.nameEn).map(s => ({
          name: { ar: s.nameAr, en: s.nameEn },
          slug: s.slug || (s.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""))
        }))
      };

      const res = await fetch(url, {
        method,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        setSuccess(editingCategory ? "Category updated successfully!" : "Category created successfully!");
        fetchCategories();
        setTimeout(() => closeModal(), 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save category");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setError("");
    setSuccess("");
    setNewCategory({
      nameAr: "", nameEn: "", slug: "", image: "", icon: "", descAr: "", descEn: "",
      subCategories: [{ nameAr: "", nameEn: "", slug: "" }]
    });
  };

  const startEdit = (cat: any) => {
    setEditingCategory(cat);
    setNewCategory({
      nameAr: cat.name?.ar || "",
      nameEn: cat.name?.en || "",
      slug: cat.slug || "",
      image: cat.image || "",
      icon: cat.icon || "",
      descAr: cat.description?.ar || "",
      descEn: cat.description?.en || "",
      subCategories: cat.subCategories?.length ? cat.subCategories.map((s: any) => ({
        nameAr: s.name?.ar || "",
        nameEn: s.name?.en || "",
        slug: s.slug || ""
      })) : [{ nameAr: "", nameEn: "", slug: "" }]
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.name?.ar?.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-[2rem] border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl shadow-lg">
            <FiFolder />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Categories</p>
            <p className="text-2xl font-black">{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Table View */}
      <div className="bg-white dark:bg-white/2 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        <table className="w-full text-left rtl:text-right">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-white/5">
              <th className="px-8 py-6">Category Info</th>
              <th className="px-8 py-6">Slug</th>
              <th className="px-8 py-6">Sub-Categories</th>
              <th className="px-8 py-6 text-right rtl:text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredCategories.map((category) => (
              <tr key={category?._id || category?.id || category?.slug || category?.name || category?.title?.en || category?.title?.ar || JSON.stringify(category).substring(0, 20)} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-2 flex items-center justify-center overflow-hidden">
                      <img src={category.image || "/placeholder.png"} className="w-full h-full object-contain" alt="" />
                    </div>
                    <div>
                      <div className="font-black text-sm">{category.name?.en}</div>
                      <div className="text-[10px] font-bold text-gray-500">{category.name?.ar}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-4 py-1.5 bg-blue-500/10 text-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {category.slug}
                  </span>
                </td>
                <td className="px-8 py-5 font-black">
                  <div className="flex flex-wrap gap-2">
                    {category.subCategories?.map((s: any, i: number) => (
                      <span key={`item-${i}`} className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-300">
                        {s.name?.en}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-5 text-right rtl:text-left">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button onClick={() => startEdit(category)} className="w-10 h-10 flex items-center justify-center bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(category._id)} className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              className="relative bg-white dark:bg-[#0F0F0F] w-full max-w-3xl rounded-[3rem] p-6 md:p-10 shadow-2xl space-y-8 border border-gray-100 dark:border-white/10 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-[#0F0F0F] pb-4 z-10">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic">
                  {editingCategory ? "Edit Category" : "New Category"}
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
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Name (Arabic)</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white"
                    value={newCategory.nameAr} onChange={(e) => setNewCategory({...newCategory, nameAr: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Name (English)</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white"
                    value={newCategory.nameEn} onChange={(e) => setNewCategory({...newCategory, nameEn: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Slug</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white"
                    value={newCategory.slug} onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Image URL</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white"
                    value={newCategory.image} onChange={(e) => setNewCategory({...newCategory, image: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Icon URL</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all text-gray-900 dark:text-white"
                    value={newCategory.icon} onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})} />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Sub Categories</label>
                    <button 
                      type="button"
                      onClick={() => setNewCategory({...newCategory, subCategories: [...newCategory.subCategories, { nameAr: "", nameEn: "", slug: "" }]})}
                      className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:text-primary/80 transition-colors"
                    >
                      <FiPlus /> Add SubCategory
                    </button>
                  </div>
                  {newCategory.subCategories.map((sub, index) => (
                    <div key={`item-${index}`} className="flex flex-col md:flex-row gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-3xl relative group">
                      <input type="text" placeholder="Arabic Name" className="flex-1 px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-transparent focus:border-primary rounded-xl outline-none font-bold text-sm text-gray-900 dark:text-white"
                        value={sub.nameAr} onChange={(e) => {
                          const subs = [...newCategory.subCategories];
                          subs[index].nameAr = e.target.value;
                          setNewCategory({...newCategory, subCategories: subs});
                        }} />
                      <input type="text" placeholder="English Name" className="flex-1 px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-transparent focus:border-primary rounded-xl outline-none font-bold text-sm text-gray-900 dark:text-white"
                        value={sub.nameEn} onChange={(e) => {
                          const subs = [...newCategory.subCategories];
                          subs[index].nameEn = e.target.value;
                          setNewCategory({...newCategory, subCategories: subs});
                        }} />
                      <input type="text" placeholder="Slug" className="flex-1 px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-transparent focus:border-primary rounded-xl outline-none font-bold text-sm text-gray-900 dark:text-white"
                        value={sub.slug} onChange={(e) => {
                          const subs = [...newCategory.subCategories];
                          subs[index].slug = e.target.value;
                          setNewCategory({...newCategory, subCategories: subs});
                        }} />
                      <button 
                        type="button"
                        onClick={() => {
                          const subs = [...newCategory.subCategories];
                          subs.splice(index, 1);
                          setNewCategory({...newCategory, subCategories: subs});
                        }}
                        className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shrink-0 md:mt-1"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleAddCategory} className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-lg uppercase tracking-widest italic">
                {editingCategory ? "Save Changes" : "Create Category"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
