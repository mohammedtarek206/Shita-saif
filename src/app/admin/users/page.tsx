"use client";

import React, { useState, useEffect } from "react";
import { 
  FiUsers, FiMail, FiShield, FiPlus, FiX, FiCheck, 
  FiLock, FiChevronDown, FiTrash2, FiDownload, FiActivity, FiUserX, FiUserCheck 
} from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { useSession } from "next-auth/react";

export default function UsersAdmin() {
  const { language } = useLanguage();
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user", password: "" });

  const currentAdminRole = (session?.user as any)?.role;
  const isSuperAdmin = currentAdminRole === "superadmin";

  const t = {
    title: language === "ar" ? "إدارة المستخدمين" : "User Management",
    subtitle: language === "ar" ? "إدارة حسابات المشرفين والعملاء وتحديث الصلاحيات وحالة الحساب" : "Manage your system users, roles, and active status",
    addBtn: language === "ar" ? "إضافة مستخدم جديد" : "Add New User",
    exportBtn: language === "ar" ? "تصدير البيانات CSV" : "Export CSV Data",
    tableUser: language === "ar" ? "المستخدم" : "User",
    tableRole: language === "ar" ? "الدور" : "Role",
    tableStatus: language === "ar" ? "الحالة" : "Status",
    tableDate: language === "ar" ? "تاريخ الانضمام" : "Joined Date",
    tableActions: language === "ar" ? "الإجراءات" : "Actions",
    active: language === "ar" ? "نشط" : "Active",
    suspended: language === "ar" ? "معلق" : "Suspended",
    userRole: language === "ar" ? "عميل" : "User / Customer",
    adminRole: language === "ar" ? "مشرف" : "Admin",
    superAdminRole: language === "ar" ? "مشرف خارق" : "Super Admin",
    fullName: language === "ar" ? "الاسم الكامل" : "Full Name",
    emailAddr: language === "ar" ? "البريد الإلكتروني" : "Email Address",
    password: language === "ar" ? "كلمة المرور" : "Password",
    saveBtn: language === "ar" ? "إنشاء حساب" : "Create Account",
    confirmDelete: language === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا المستخدم نهائياً؟" : "Are you sure you want to permanently delete this user?",
    unauthorizedMsg: language === "ar" ? "عذراً، هذه اللوحة وإدارة المستخدمين مخصصة للمشرف الخارق (Super Admin) فقط." : "Sorry, only Super Admins can manage system roles and user accounts.",
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchUsers();
        setShowModal(false);
        setNewUser({ name: "", email: "", role: "user", password: "" });
        alert(language === "ar" ? "تم إنشاء الحساب بنجاح!" : "User account created successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Suspended" ? "Active" : "Suspended";
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Excel/CSV Export Tool
  const exportUsersToCSV = () => {
    const headers = ["Name,Email,Role,Status,JoinedDate\n"];
    const rows = users.map(user => {
      const joined = new Date(user.createdAt).toLocaleDateString();
      return `"${user.name}","${user.email}","${user.role}","${user.status || 'Active'}","${joined}"\n`;
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.concat(rows).join("");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isSuperAdmin) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-center px-6">
        <div className="max-w-md bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
          <FiShield className="text-5xl text-rose-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-black mb-4">{language === "ar" ? "غير مصرح" : "Unauthorized Access"}</h2>
          <p className="text-gray-500 font-bold text-sm leading-relaxed">{t.unauthorizedMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <FiUsers className="text-primary" /> {t.title}
          </h1>
          <p className="text-gray-500 font-bold text-sm">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportUsersToCSV}
            className="px-6 py-3 border border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            <FiDownload /> {t.exportBtn}
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <FiPlus /> {t.addBtn}
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-5 px-6 text-start">{t.tableUser}</th>
                <th className="py-5 px-6 text-start">{t.tableRole}</th>
                <th className="py-5 px-6 text-start">{t.tableStatus}</th>
                <th className="py-5 px-6 text-start">{t.tableDate}</th>
                <th className="py-5 px-6 text-end">{t.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={`item-${i}`} className="animate-pulse">
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-48" /></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24" /></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-16" /></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32" /></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20 float-right" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-bold">
                    {language === "ar" ? "لا يوجد مستخدمون لعرضهم" : "No users found"}
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelf = session?.user?.email === user.email;
                  return (
                    <tr key={(user as any)?._id || (user as any)?.id || (user as any)?.slug || (user as any)?.name || (user as any)?.title?.en || (user as any)?.title?.ar || JSON.stringify(user).substring(0, 20)} className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors">
                      {/* Name & Email */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-black text-sm shrink-0">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-sm text-gray-900 dark:text-white leading-none mb-1">
                              {user.name} {isSelf && <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-1">({language === "ar" ? "أنت" : "You"})</span>}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold leading-none">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Dynamic Role Dropdown */}
                      <td className="py-5 px-6">
                        {isSelf ? (
                          <div className="flex items-center gap-1.5 text-xs font-black text-primary capitalize">
                            <FiShield /> {user.role === "superadmin" ? t.superAdminRole : user.role === "admin" ? t.adminRole : t.userRole}
                          </div>
                        ) : (
                          <div className="relative inline-block shrink-0">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="appearance-none pr-8 pl-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-xl font-bold text-xs capitalize outline-none cursor-pointer text-gray-700 dark:text-gray-300"
                            >
                              <option value="user">{t.userRole}</option>
                              <option value="admin">{t.adminRole}</option>
                              <option value="superadmin">{t.superAdminRole}</option>
                            </select>
                            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-xs" />
                          </div>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="py-5 px-6">
                        <button
                          disabled={isSelf}
                          onClick={() => handleStatusToggle(user._id, user.status)}
                          className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all ${
                            user.status === "Suspended"
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {user.status === "Suspended" ? t.suspended : t.active}
                        </button>
                      </td>

                      {/* Joined Date */}
                      <td className="py-5 px-6 text-xs font-bold text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                      </td>

                      {/* Actions (Suspend toggle and permanent Delete) */}
                      <td className="py-5 px-6 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={isSelf}
                            onClick={() => handleStatusToggle(user._id, user.status)}
                            title={user.status === "Suspended" ? t.active : t.suspended}
                            className={`p-2 rounded-xl transition-all ${
                              user.status === "Suspended"
                                ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                : "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white"
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                          >
                            {user.status === "Suspended" ? <FiUserCheck /> : <FiUserX />}
                          </button>
                          <button 
                            disabled={isSelf}
                            onClick={() => handleDelete(user._id)}
                            className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-[#111] w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">{t.addBtn}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-50">{t.fullName}</label>
                <div className="relative">
                  <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold text-sm"
                    placeholder="Full Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-50">{t.emailAddr}</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold text-sm"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-50">{t.tableRole}</label>
                <div className="relative">
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold text-sm appearance-none cursor-pointer text-gray-900 dark:text-white"
                  >
                    <option value="user">{t.userRole}</option>
                    <option value="admin">{t.adminRole}</option>
                    <option value="superadmin">{t.superAdminRole}</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <FiChevronDown />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-50">{t.password}</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="password" 
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-5 gradient-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                <FiCheck /> {t.saveBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
