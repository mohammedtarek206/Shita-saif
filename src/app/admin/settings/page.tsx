"use client";

import React, { useState, useEffect } from "react";
import { 
  FiSettings, FiGlobe, FiBell, FiShield, FiSave, FiUpload, 
  FiAlertTriangle, FiGift, FiTruck, FiLayers, FiPlus, FiTrash2, FiLink, FiCheck 
} from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { useSession } from "next-auth/react";

export default function SettingsAdmin() {
  const { language } = useLanguage();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Store Config state
  const [config, setConfig] = useState<any>({
    maintenanceMode: false,
    seasonalTheme: "none",
    flashSale: { active: false, expiresAt: "", discountPercent: 0, titleAr: "", titleEn: "" },
    shippingRules: { freeShippingThreshold: 5000, defaultShippingCost: 100 },
    banners: []
  });

  const isSuperAdmin = (session?.user as any)?.role === "superadmin";

  const t = {
    title: language === "ar" ? "إعدادات المتجر" : "Store Settings",
    subtitle: language === "ar" ? "تعديل بنية المتجر، وضع الصيانة، العروض الخاطفة، أسعار الشحن والبنرات الرئيسية" : "Configure store framework, maintenance mode, flash sales, shipping rules and hero banners",
    tabGeneral: language === "ar" ? "الإعدادات العامة والمواسم" : "General & Seasons",
    tabFlashSale: language === "ar" ? "العروض الخاطفة" : "Flash Sales Campaign",
    tabShipping: language === "ar" ? "قواعد الشحن والأسعار" : "Shipping & Delivery",
    tabBanners: language === "ar" ? "البنرات والواجهة" : "Banners & Homepage",
    saveBtn: language === "ar" ? "حفظ التغييرات" : "Save Changes",
    successMsg: language === "ar" ? "تم حفظ الإعدادات بنجاح!" : "Store configuration updated successfully!",
    maintenanceMode: language === "ar" ? "وضع الصيانة (تجميد المتجر)" : "Maintenance Mode (Freeze Store)",
    maintenanceSub: language === "ar" ? "تفعيل وضع الصيانة يمنع جميع العملاء من تصفح المتجر أو الشراء ويعرض صفحة انتظار فاخرة." : "Freezes the store completely, disabling orders and displaying a beautiful maintenance page.",
    seasonalTheme: language === "ar" ? "ثيم وتأثير الموسم" : "Seasonal Theme & Animation",
    themeNone: language === "ar" ? "بدون تأثيرات مواسم" : "No active seasonal effect",
    themeWinter: language === "ar" ? "ثيم الشتاء مع تساقط الثلوج ❄️" : "Winter theme with snowfall animation ❄️",
    themeSummer: language === "ar" ? "ثيم الصيف الدافئ ☀️" : "Summer warm suntheme ☀️",
    superAdminRestriction: language === "ar" ? "صلاحيات تفعيل وضع الصيانة وتأثير الموسم مخصصة للـ Super Admin فقط." : "Only Super Admin accounts can toggle maintenance mode and global seasons.",
    
    // Flash sales
    flashActive: language === "ar" ? "تفعيل حملة الخصم الخاطف" : "Enable Flash Sale Campaign",
    flashTitleAr: language === "ar" ? "عنوان الحملة (بالعربية)" : "Campaign Title (Arabic)",
    flashTitleEn: language === "ar" ? "عنوان الحملة (بالإنجليزية)" : "Campaign Title (English)",
    flashExpiry: language === "ar" ? "تاريخ ووقت انتهاء العرض" : "Campaign Expiration Date",
    flashDiscount: language === "ar" ? "نسبة الخصم الإضافي (%)" : "Extra Discount Percent (%)",

    // Shipping rules
    freeThreshold: language === "ar" ? "الحد الأدنى للشحن المجاني (ج.م)" : "Free Shipping Threshold (EGP)",
    defaultCost: language === "ar" ? "تكلفة الشحن الافتراضية للمحافظات (ج.م)" : "Default Delivery Shipping Cost (EGP)",

    // Banners manager
    bannersTitle: language === "ar" ? "إدارة بنرات العرض الرئيسية" : "Hero Banners Slider Manager",
    addBanner: language === "ar" ? "إضافة بنر إعلاني جديد" : "Add New Hero Slide",
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/config");
      if (res.ok) {
        const data = await res.json();
        // Standardize date for datetime-local inputs
        if (data.flashSale?.expiresAt) {
          data.flashSale.expiresAt = new Date(data.flashSale.expiresAt).toISOString().slice(0, 16);
        }
        setConfig(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchConfig();
      } else {
        alert("Failed to save configuration settings");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBanner = () => {
    const newBanners = [
      ...config.banners,
      {
        id: Date.now().toString(),
        image: "",
        titleAr: "",
        titleEn: "",
        subtitleAr: "",
        subtitleEn: "",
        link: "/products"
      }
    ];
    setConfig({ ...config, banners: newBanners });
  };

  const handleRemoveBanner = (id: string) => {
    const filtered = config.banners.filter((b: any) => b.id !== id);
    setConfig({ ...config, banners: filtered });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <FiSettings className="text-primary" /> {t.title}
          </h1>
          <p className="text-gray-500 font-bold text-sm">{t.subtitle}</p>
        </div>
        {saveSuccess && (
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 animate-bounce">
            <FiCheck /> {t.successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-3">
          {[
            { id: "general", name: t.tabGeneral, icon: <FiGlobe /> },
            { id: "flash", name: t.tabFlashSale, icon: <FiGift /> },
            { id: "shipping", name: t.tabShipping, icon: <FiTruck /> },
            { id: "banners", name: t.tabBanners, icon: <FiLayers /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 w-full px-6 py-4 rounded-2xl font-black text-sm transition-all duration-300 ${
                activeTab === tab.id 
                  ? "gradient-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                  : "bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-8">
            
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <FiGlobe className="text-primary" /> {t.tabGeneral}
                </h3>

                {/* Maintenance Mode */}
                <div className="bg-gray-50 dark:bg-white/[0.01] p-6 rounded-2xl border border-gray-100 dark:border-white/5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <FiAlertTriangle className="text-amber-500 text-lg" /> {t.maintenanceMode}
                      </p>
                      <p className="text-xs text-gray-500 font-bold leading-relaxed mt-1">{t.maintenanceSub}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        disabled={!isSuperAdmin}
                        checked={config.maintenanceMode}
                        onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary disabled:opacity-50" />
                    </label>
                  </div>
                  {!isSuperAdmin && (
                    <div className="text-[10px] font-bold text-rose-500 bg-rose-500/10 p-2.5 rounded-lg">
                      {t.superAdminRestriction}
                    </div>
                  )}
                </div>

                {/* Seasonal Themes */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">{t.seasonalTheme}</label>
                  <select
                    disabled={!isSuperAdmin}
                    value={config.seasonalTheme}
                    onChange={(e) => setConfig({ ...config, seasonalTheme: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm text-gray-700 dark:text-gray-200 appearance-none cursor-pointer"
                  >
                    <option value="none">{t.themeNone}</option>
                    <option value="winter">{t.themeWinter}</option>
                    <option value="summer">{t.themeSummer}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Flash Sales Tab */}
            {activeTab === "flash" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <FiGift className="text-primary" /> {t.tabFlashSale}
                </h3>

                <div className="bg-gray-50 dark:bg-white/[0.01] p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-black text-sm">{t.flashActive}</p>
                    <p className="text-xs text-gray-500 font-bold">Show dynamic flash sale countdown banner across store pages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={config.flashSale?.active}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        flashSale: { ...config.flashSale, active: e.target.checked } 
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">{t.flashTitleAr}</label>
                    <input 
                      type="text" 
                      value={config.flashSale?.titleAr} 
                      onChange={(e) => setConfig({
                        ...config,
                        flashSale: { ...config.flashSale, titleAr: e.target.value }
                      })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">{t.flashTitleEn}</label>
                    <input 
                      type="text" 
                      value={config.flashSale?.titleEn} 
                      onChange={(e) => setConfig({
                        ...config,
                        flashSale: { ...config.flashSale, titleEn: e.target.value }
                      })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">{t.flashExpiry}</label>
                    <input 
                      type="datetime-local" 
                      value={config.flashSale?.expiresAt || ""} 
                      onChange={(e) => setConfig({
                        ...config,
                        flashSale: { ...config.flashSale, expiresAt: e.target.value }
                      })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">{t.flashDiscount}</label>
                    <input 
                      type="number" 
                      value={config.flashSale?.discountPercent} 
                      onChange={(e) => setConfig({
                        ...config,
                        flashSale: { ...config.flashSale, discountPercent: Number(e.target.value) }
                      })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Rules Tab */}
            {activeTab === "shipping" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <FiTruck className="text-primary" /> {t.tabShipping}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">{t.freeThreshold}</label>
                    <input 
                      type="number" 
                      value={config.shippingRules?.freeShippingThreshold} 
                      onChange={(e) => setConfig({
                        ...config,
                        shippingRules: { ...config.shippingRules, freeShippingThreshold: Number(e.target.value) }
                      })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">{t.defaultCost}</label>
                    <input 
                      type="number" 
                      value={config.shippingRules?.defaultShippingCost} 
                      onChange={(e) => setConfig({
                        ...config,
                        shippingRules: { ...config.shippingRules, defaultShippingCost: Number(e.target.value) }
                      })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Banners Slider Manager */}
            {activeTab === "banners" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <FiLayers className="text-primary" /> {t.bannersTitle}
                  </h3>
                  <button
                    onClick={handleAddBanner}
                    className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <FiPlus /> {t.addBanner}
                  </button>
                </div>

                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {config.banners?.map((banner: any, index: number) => (
                    <div key={banner.id} className="relative bg-gray-50 dark:bg-white/[0.01] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 space-y-4">
                      <div className="absolute top-4 right-4">
                        <button 
                          onClick={() => handleRemoveBanner(banner.id)}
                          className="w-8 h-8 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg flex items-center justify-center transition-all"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Banner Image Link</label>
                          <div className="relative">
                            <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              value={banner.image}
                              onChange={(e) => {
                                const copy = [...config.banners];
                                copy[index].image = e.target.value;
                                setConfig({ ...config, banners: copy });
                              }}
                              placeholder="Paste banner URL..."
                              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none font-bold text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Button Action Redirect Link</label>
                          <div className="relative">
                            <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              value={banner.link}
                              onChange={(e) => {
                                const copy = [...config.banners];
                                copy[index].link = e.target.value;
                                setConfig({ ...config, banners: copy });
                              }}
                              placeholder="e.g. /products"
                              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none font-bold text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Main Title (Arabic)</label>
                          <input 
                            type="text" 
                            value={banner.titleAr}
                            onChange={(e) => {
                              const copy = [...config.banners];
                              copy[index].titleAr = e.target.value;
                              setConfig({ ...config, banners: copy });
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none font-bold text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Main Title (English)</label>
                          <input 
                            type="text" 
                            value={banner.titleEn}
                            onChange={(e) => {
                              const copy = [...config.banners];
                              copy[index].titleEn = e.target.value;
                              setConfig({ ...config, banners: copy });
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none font-bold text-xs"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Subtitle Description (Arabic)</label>
                          <input 
                            type="text" 
                            value={banner.subtitleAr}
                            onChange={(e) => {
                              const copy = [...config.banners];
                              copy[index].subtitleAr = e.target.value;
                              setConfig({ ...config, banners: copy });
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none font-bold text-xs"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Subtitle Description (English)</label>
                          <input 
                            type="text" 
                            value={banner.subtitleEn}
                            onChange={(e) => {
                              const copy = [...config.banners];
                              copy[index].subtitleEn = e.target.value;
                              setConfig({ ...config, banners: copy });
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none font-bold text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="gradient-primary text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-primary/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave className="text-xl" /> {t.saveBtn}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
