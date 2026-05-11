"use client";
import React, { useState } from "react";
import { FiLayers, FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiX, FiCheck } from "react-icons/fi";

const initialPartners = [
  { id: 1, name: "Samsung", category: "Electronics", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", status: "Active" },
  { id: 2, name: "LG", category: "Appliances", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg", status: "Active" },
  { id: 3, name: "Gree", category: "Air Conditioning", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Gree_Electric_logo.svg", status: "Active" },
];

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: "", category: "", logo: "" });

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
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        body: JSON.stringify(newPartner),
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Our Partners</h1>
          <p className="text-gray-500">Manage brand partnerships and logos</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-all"
        >
          <FiPlus /> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {partners.map((partner) => (
          <div key={partner._id} className="bg-white dark:bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl group">
            <div className="flex items-start justify-between mb-8">
              <div className="w-20 h-20 rounded-3xl bg-white p-4 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                  <FiEdit2 />
                </button>
                <button 
                  onClick={() => handleDelete(partner._id)}
                  className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-black mb-1">{partner.name}</h3>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <FiLayers className="text-primary" /> {partner.category}
            </p>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <span className="px-4 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase">
                {partner.status}
              </span>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <FiExternalLink />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-[#111] w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">Add New Partner</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-6">
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest opacity-50">Partner Name</label>
                <input 
                  required
                  type="text" 
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold"
                  placeholder="e.g. Samsung"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest opacity-50">Category</label>
                <input 
                  required
                  type="text" 
                  value={newPartner.category}
                  onChange={(e) => setNewPartner({...newPartner, category: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold"
                  placeholder="e.g. Electronics"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest opacity-50">Logo URL</label>
                <input 
                  required
                  type="url" 
                  value={newPartner.logo}
                  onChange={(e) => setNewPartner({...newPartner, logo: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold"
                  placeholder="https://..."
                />
              </div>

              <button type="submit" className="w-full py-5 gradient-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                <FiCheck /> Save Partner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
