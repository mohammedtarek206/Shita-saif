"use client";
import React, { useState } from "react";
import { FiLayers, FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiX, FiCheck, FiImage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: "", category: "", logo: "" });

  const convertDriveLink = (url: string) => {
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    return url;
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/admin/partners");
      const data = await res.json();
      setPartners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPartners();
  }, []);

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalLogo = convertDriveLink(newPartner.logo);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        body: JSON.stringify({ ...newPartner, logo: finalLogo }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchPartners();
        setShowModal(false);
        setNewPartner({ name: "", category: "", logo: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    try {
      await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
      fetchPartners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic">Partners Portfolio</h1>
          <p className="text-gray-500 font-bold mt-1">Manage global brands and corporate identities</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          <FiPlus size={20} /> New Partner
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        <AnimatePresence mode="popLayout">
          {partners.map((partner, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              key={partner._id} 
              className="bg-white dark:bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-white p-4 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-lg">
                    <FiEdit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(partner._id)}
                    className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{partner.name}</h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <FiLayers className="text-primary" /> {partner.category}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between relative z-10">
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-[0.1em]">
                  Active Partnership
                </span>
                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors hover:scale-125">
                  <FiExternalLink />
                </button>
              </div>

              {/* Decorative background number */}
              <div className="absolute -bottom-4 -right-2 text-8xl font-black text-black opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:opacity-10 transition-opacity">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#0F0F0F] w-full max-w-md p-8 md:p-10 rounded-[3rem] shadow-2xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black uppercase tracking-tight italic">New Brand Partner</h2>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleAddPartner} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Brand Identity</label>
                  <input required type="text" value={newPartner.name} onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold" placeholder="e.g. Samsung" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Industry Category</label>
                  <input required type="text" value={newPartner.category} onChange={(e) => setNewPartner({...newPartner, category: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold" placeholder="e.g. Smart Appliances" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Logo Resource (URL)</label>
                  <div className="relative group">
                    <FiImage className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input required type="url" value={newPartner.logo} onChange={(e) => setNewPartner({...newPartner, logo: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold" placeholder="https://..." />
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-6 uppercase italic tracking-widest">
                  <FiCheck size={20} /> Register Brand
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
