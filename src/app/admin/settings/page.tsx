"use client";

import React from "react";
import { FiSettings, FiGlobe, FiBell, FiShield, FiSave, FiUpload } from "react-icons/fi";

export default function SettingsAdmin() {
  const [activeTab, setActiveTab] = React.useState('general');
  const [isLoading, setIsLoading] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">System Settings</h1>
          <p className="text-gray-500">Configure your store general settings and security</p>
        </div>
        {saveSuccess && (
          <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold animate-bounce-subtle shadow-lg shadow-green-500/20">
            Changes saved successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'general', name: 'General Settings', icon: <FiGlobe /> },
            { id: 'security', name: 'Security & Access', icon: <FiShield /> },
            { id: 'notifications', name: 'Notifications', icon: <FiBell /> },
            { id: 'advanced', name: 'Advanced', icon: <FiSettings /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 w-full px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'gradient-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                  : 'bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-black/40 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl min-h-[500px]">
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <FiGlobe className="text-primary" /> General Configuration
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Store Name</label>
                      <input type="text" defaultValue="Winter & Summer" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-gray-900 dark:text-white" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Support Email</label>
                      <input type="email" defaultValue="support@wintersummer.com" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Store Logo</label>
                    <div className="flex items-center gap-8 p-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] bg-gray-50/50 dark:bg-white/5">
                      <div className="w-24 h-24 rounded-2xl bg-white p-4 shadow-2xl flex items-center justify-center">
                        <img src="/Logo-removebg-preview.png" alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-lg mb-1">Brand Identity</p>
                        <p className="text-sm text-gray-500 mb-4">Upload a high-resolution logo for your store</p>
                        <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary/10 px-4 py-2 rounded-xl transition-all">
                          <FiUpload /> Upload New Image
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 flex justify-end">
                    <button 
                      onClick={handleSave}
                      disabled={isLoading}
                      className="gradient-primary text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-primary/20 flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <FiSave className="text-xl" /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'general' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-4xl text-gray-400">
                  <FiSettings className="animate-spin-slow" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-gray-500">Coming Soon</h3>
                <p className="text-gray-400 max-w-xs">We're working on making these settings fully functional. Stay tuned!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
