"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, Shield, User as UserIcon, Ban, CheckCircle2, Mail, Loader2, ChefHat, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface User { id: string; name: string | null; email: string | null; image: string | null; role: string; status: string; updatedAt: string; }
interface RecipeActivity { id: string; title: string; category: string; createdAt: string; }

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userRecipes, setUserRecipes] = useState<RecipeActivity[]>([]);
    const [isLoadingActivity, setIsLoadingActivity] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const { data, error } = await supabase.from("User").select("id, name, email, image, role, status, updatedAt").order("updatedAt", { ascending: false });
            if (error) toast.error("Gagal mengambil data pengguna");
            else setUsers(data as User[]);
            setIsLoading(false);
        })();
    }, []);

    const filteredUsers = useMemo(() =>
        users.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase())),
        [users, searchQuery]
    );

    const toggleRole = async (user: User) => {
        if (!confirm(`Ubah peran ${user.name} menjadi ${user.role === 'ADMIN' ? 'USER' : 'ADMIN'}?`)) return;
        setIsActionLoading(user.id);
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
        const { error } = await supabase.from("User").update({ role: newRole }).eq("id", user.id);
        if (error) toast.error("Gagal mengubah peran");
        else { setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u)); toast.success(`Peran diubah ke ${newRole}`); }
        setIsActionLoading(null);
    };

    const toggleStatus = async (user: User) => {
        const action = user.status === 'BANNED' ? 'aktifkan' : 'tangguhkan';
        if (!confirm(`Yakin ingin ${action} akun ${user.name}?`)) return;
        setIsActionLoading(user.id);
        const newStatus = user.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
        const { error } = await supabase.from("User").update({ status: newStatus }).eq("id", user.id);
        if (error) toast.error("Gagal mengubah status");
        else { setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u)); toast.success(`Akun ${action}`); }
        setIsActionLoading(null);
    };

    const viewActivity = async (user: User) => {
        setSelectedUser(user);
        setIsLoadingActivity(true);
        const { data } = await supabase.from("Recipe").select("id, title, category, createdAt").eq("authorId", user.id).order("createdAt", { ascending: false });
        setUserRecipes(data || []);
        setIsLoadingActivity(false);
    };

    return (
        <div className="space-y-6 font-body">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-text">Manajemen Pengguna</h1>
                    <p className="text-text-muted text-sm mt-1">Kelola peran dan akses anggota komunitas.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                    <input type="text" placeholder="Cari nama atau email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10 py-2 text-sm w-full md:w-64" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Table */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-primary-50 overflow-hidden" style={{ boxShadow: 'var(--shadow-xs)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-muted border-b border-primary-50">
                                    <th className="p-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Pengguna</th>
                                    <th className="p-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Peran</th>
                                    <th className="p-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-50/80">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="p-12 text-center"><Loader2 className="w-7 h-7 text-primary-500 animate-spin mx-auto" /></td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan={4} className="p-12 text-center text-text-muted text-sm">Tidak ada pengguna ditemukan.</td></tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className={`hover:bg-surface-muted/50 transition-colors cursor-pointer ${selectedUser?.id === user.id ? 'bg-primary-50/30' : ''}`}
                                            onClick={() => viewActivity(user)}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-sm overflow-hidden border border-primary-100">
                                                            {user.image ? <Image src={user.image} alt={user.name || ""} width={36} height={36} className="w-full h-full object-cover" /> : (user.name || "U")[0]}
                                                        </div>
                                                        {user.status === 'BANNED' && (
                                                            <div className="absolute -bottom-1 -right-1 bg-red-100 text-red-600 rounded-full p-0.5 border-2 border-white"><Ban size={8} /></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-text text-sm leading-tight">{user.name || "User"}</p>
                                                        <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1"><Mail size={9} />{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                                                    <Shield size={9} />{user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-xs font-medium ${user.status === 'BANNED' ? "text-red-600" : "text-primary-600"}`}>
                                                    {user.status === 'BANNED' ? "Ditangguhkan" : "Aktif"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => toggleRole(user)} disabled={isActionLoading === user.id}
                                                        className="p-1.5 text-text-muted hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all" title="Tukar Peran"><Shield size={14} /></button>
                                                    <button onClick={() => toggleStatus(user)} disabled={isActionLoading === user.id}
                                                        className={`p-1.5 transition-all rounded-lg ${user.status === 'BANNED' ? "text-text-muted hover:text-primary-600 hover:bg-primary-50" : "text-text-muted hover:text-red-600 hover:bg-red-50"}`}
                                                        title={user.status === 'BANNED' ? "Aktifkan" : "Tangguhkan"}>
                                                        {user.status === 'BANNED' ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="bg-white rounded-2xl border border-primary-50 p-5 h-fit sticky top-24" style={{ boxShadow: 'var(--shadow-xs)' }}>
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div key={selectedUser.id} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-xl bg-primary-50 mx-auto flex items-center justify-center text-primary-700 text-xl font-bold border border-primary-100 mb-3 overflow-hidden">
                                        {selectedUser.image ? <Image src={selectedUser.image} alt={selectedUser.name || ""} width={64} height={64} className="w-full h-full object-cover" /> : (selectedUser.name || "U")[0]}
                                    </div>
                                    <h2 className="text-lg font-bold text-text">{selectedUser.name}</h2>
                                    <p className="text-xs text-text-muted">{selectedUser.email}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-surface-muted p-3 rounded-xl text-center">
                                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-0.5">Status</p>
                                        <p className={`text-xs font-bold ${selectedUser.status === 'BANNED' ? 'text-red-600' : 'text-primary-600'}`}>{selectedUser.status}</p>
                                    </div>
                                    <div className="bg-surface-muted p-3 rounded-xl text-center">
                                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-0.5">Peran</p>
                                        <p className="text-xs font-bold text-text">{selectedUser.role}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-text flex items-center gap-1.5"><ChefHat size={14} className="text-primary-500" />Resep ({userRecipes.length})</h3>
                                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                        {isLoadingActivity ? (
                                            <div className="py-6 flex justify-center"><Loader2 className="animate-spin text-text-muted" size={20} /></div>
                                        ) : userRecipes.length === 0 ? (
                                            <div className="text-center py-6 bg-surface-muted rounded-xl border border-dashed border-primary-100">
                                                <p className="text-[11px] text-text-muted">Belum ada resep.</p>
                                            </div>
                                        ) : (
                                            userRecipes.map(recipe => (
                                                <div key={recipe.id} className="group p-2.5 border border-primary-50 rounded-lg hover:bg-surface-muted transition-all flex items-center justify-between">
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-semibold text-text truncate">{recipe.title}</p>
                                                        <p className="text-[10px] text-text-muted">{recipe.category} · {new Date(recipe.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <Link href={`/resep/${recipe.id}`} target="_blank" className="p-1 text-text-muted hover:text-primary-500 rounded transition-all">
                                                        <ArrowRight size={13} />
                                                    </Link>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-80 flex flex-col items-center justify-center text-center space-y-3">
                                <div className="p-3 bg-surface-muted rounded-xl"><UserIcon size={32} className="text-text-muted/30" /></div>
                                <div>
                                    <h3 className="text-sm font-bold text-text">Pilih Pengguna</h3>
                                    <p className="text-[11px] text-text-muted max-w-[180px] mt-1">Klik pada baris untuk melihat detail.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}