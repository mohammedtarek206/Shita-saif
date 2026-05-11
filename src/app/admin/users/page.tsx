"use client";
import React, { useState } from "react";
import { FiUsers, FiMail, FiShield, FiMoreVertical, FiPlus, FiX, FiCheck, FiLock, FiChevronDown, FiTrash2 } from "react-icons/fi";

const initialUsers = [
  { id: 1, name: "Super Admin", email: "admin@wintersummer.com", role: "superadmin", status: "Active", joined: "2026-05-01" },
  { id: 2, name: "John Doe", email: "john@example.com", role: "user", status: "Active", joined: "2026-05-05" },
  { id: 3, name: "Jane Smith", email: "jane@example.com", role: "admin", status: "Active", joined: "2026-05-06" },
  { id: 4, name: "Ahmed Ali", email: "ahmed@example.com", role: "user", status: "Suspended", joined: "2026-05-07" },
];

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user", password: "" });

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

  React.useEffect(() => {
    fetchUsers();
  }, []);

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
        alert("User created successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Management</h1>
          <p className="text-gray-500">Manage your system users and their roles</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-all"
        >
          <FiPlus /> Add New User
        </button>
      </div>

      <div className="bg-white dark:bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/5 text-xs font-black uppercase tracking-widest">
                <th className="pb-6 pl-4">User</th>
                <th className="pb-6">Role</th>
                <th className="pb-6">Status</th>
                <th className="pb-6">Joined Date</th>
                <th className="pb-6 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <td className="py-6 pl-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-black text-lg">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black group-hover:text-primary transition-colors">{user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <FiMail /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <FiShield className={user.role === 'superadmin' ? 'text-primary' : user.role === 'admin' ? 'text-secondary' : 'text-gray-400'} />
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter ${
                      user.status === 'Suspended' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-6 font-bold text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-6 pr-4 text-right">
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
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
              <h2 className="text-2xl font-black">Add New User</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest opacity-50">Full Name</label>
                <div className="relative">
                  <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest opacity-50">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest opacity-50">Role</label>
                <div className="relative">
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold appearance-none cursor-pointer text-gray-900 dark:text-white"
                  >
                    <option value="user" className="bg-white dark:bg-black text-black dark:text-white">User / Customer</option>
                    <option value="admin" className="bg-white dark:bg-black text-black dark:text-white">Admin</option>
                    <option value="superadmin" className="bg-white dark:bg-black text-black dark:text-white">Super Admin</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <FiChevronDown />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest opacity-50">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="password" 
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all font-bold"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-5 gradient-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                <FiCheck /> Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
