"use client";

import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiX, FiLink } from "react-icons/fi";

const initialProducts = [
  { id: 1, nameAr: "ثلاجة سامسونج", nameEn: "Samsung Fridge", category: "Refrigerators", price: 4500, discount: 10, stock: 12 },
  { id: 2, nameAr: "غسالة إل جي", nameEn: "LG Washer", category: "Washers", price: 3200, discount: 0, stock: 5 },
  { id: 3, nameAr: "مكيف جري", nameEn: "Gree AC", category: "Air Conditioners", price: 2800, discount: 15, stock: 20 },
  { id: 4, nameAr: "فرن كهربائي", nameEn: "Electric Oven", category: "Kitchen", price: 1500, discount: 5, stock: 8 },
];

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nameAr: "", nameEn: "", category: "", price: "", discount: "", stock: "", imageUrl: "",
    specs: [{ key: "", value: "" }]
  });

  const convertDriveLink = (url: string) => {
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
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

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleAddProduct = async () => {
    const finalImageUrl = convertDriveLink(newProduct.imageUrl);
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
      const method = editingProduct ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ 
          ...newProduct, 
          imageUrl: finalImageUrl,
          title: { ar: newProduct.nameAr, en: newProduct.nameEn },
          price: Number(newProduct.price),
          discount: Number(newProduct.discount),
          stock: Number(newProduct.stock),
          images: [finalImageUrl]
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchProducts();
        setShowAddModal(false);
        setEditingProduct(null);
        setNewProduct({ nameAr: "", nameEn: "", category: "", price: "", discount: "", stock: "", imageUrl: "", specs: [{ key: "", value: "" }] });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      nameAr: product.title?.ar || "",
      nameEn: product.title?.en || "",
      category: product.category || "",
      price: product.price || "",
      discount: product.discount || "",
      stock: product.stock || "",
      imageUrl: product.images?.[0] || "",
      specs: product.specifications?.en || [{ key: "", value: "" }]
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const addSpecField = () => {
    setNewProduct({ ...newProduct, specs: [...newProduct.specs, { key: "", value: "" }] });
  };

  const updateSpecField = (index: number, field: 'key' | 'value', val: string) => {
    const updatedSpecs = [...newProduct.specs];
    updatedSpecs[index][field] = val;
    setNewProduct({ ...newProduct, specs: updatedSpecs });
  };

  const removeSpecField = (index: number) => {
    setNewProduct({ ...newProduct, specs: newProduct.specs.filter((_, i) => i !== index) });
  };

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.title?.ar?.includes(searchTerm);
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-8 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer min-w-[150px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-white dark:bg-[#1A1A1A]">
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                <th className="px-8 py-5 font-medium">Product</th>
                <th className="px-8 py-5 font-medium">Category</th>
                <th className="px-8 py-5 font-medium">Price</th>
                <th className="px-8 py-5 font-medium">Stock</th>
                <th className="px-8 py-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-gray-400 overflow-hidden">
                        {product.images?.[0] ? <img src={product.images[0]} className="w-full h-full object-cover" /> : product.title?.en?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold">{product.title?.en}</div>
                        <div className="text-xs text-gray-500">{product.title?.ar}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-primary">
                    <div className="flex flex-col">
                      {product.discount > 0 && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {product.price} EGP
                        </span>
                      )}
                      <span>
                        {product.discount > 0 ? (product.price * (1 - product.discount / 100)).toFixed(0) : product.price} EGP
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="font-medium">{product.stock} units</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(product)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl space-y-8 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tight">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                  setNewProduct({ nameAr: "", nameEn: "", category: "", price: "", discount: "", stock: "", imageUrl: "", specs: [{ key: "", value: "" }] });
                }} 
                className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2">Product Name (Arabic)</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold transition-all"
                  value={newProduct.nameAr}
                  onChange={(e) => setNewProduct({...newProduct, nameAr: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2">Product Name (English)</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold transition-all"
                  value={newProduct.nameEn}
                  onChange={(e) => setNewProduct({...newProduct, nameEn: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2">Category</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold transition-all"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2">Price (EGP)</label>
                <input 
                  type="number" 
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold transition-all"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2">Discount (%)</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold transition-all"
                  value={newProduct.discount}
                  onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2">Specifications</label>
                <div className="space-y-4">
                  {newProduct.specs.map((spec, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <input 
                        type="text" 
                        placeholder="Key (e.g. Color)"
                        className="flex-1 px-6 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 font-bold transition-all"
                        value={spec.key}
                        onChange={(e) => updateSpecField(index, 'key', e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Value (e.g. Blue)"
                        className="flex-1 px-6 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 font-bold transition-all"
                        value={spec.value}
                        onChange={(e) => updateSpecField(index, 'value', e.target.value)}
                      />
                      <button 
                        onClick={() => removeSpecField(index)}
                        className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addSpecField}
                    className="flex items-center gap-2 text-primary font-bold hover:underline py-2 px-4"
                  >
                    <FiPlus /> Add Specification
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2">Image Link (Supports Google Drive)</label>
                <div className="relative">
                  <FiLink className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input 
                    type="text" 
                    placeholder="Paste link here..."
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold transition-all"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                  />
                </div>
                <p className="text-[10px] text-gray-500 font-bold ml-2 italic">Note: Google Drive links will be automatically optimized for web display.</p>
              </div>
            </div>

            <button 
              onClick={handleAddProduct}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              {editingProduct ? "Save Changes" : "Confirm and Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

