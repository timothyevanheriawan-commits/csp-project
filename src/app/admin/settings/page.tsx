"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Globe, ShieldAlert, History, Save, Info, CheckCircle, Loader2, Lock, Mail, FileText } from "lucide-react";
import { toast } from "sonner";

interface SiteConfig { id: string; name: string; description: string; contactEmail: string; maintenanceMode: boolean; updatedAt: string; }
interface AuditLog { id: string; action: string; adminName: string; details: string; createdAt: string; }

export default function SystemSettings() {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const { data: settingsData, error: settingsError } = await supabase.from("SystemSettings").select("*").single();
            if (settingsError) {
                setConfig({ id: '1', name: 'RecipeShare', description: 'Berbagi resep makanan terbaik nusantara.', contactEmail: 'admin@recipeshare.com', maintenanceMode: false, updatedAt: new Date().toISOString() });
            } else { setConfig(settingsData as SiteConfig); }
            const { data: logData, error: logError } = await supabase.from("AuditLog").select("*").order("createdAt", { ascending: false }).limit(10);
            if (!logError) setLogs(logData as AuditLog[]);
            setIsLoading(false);
        })();
    }, []);

    const handleSave = async () => {
        if (!config) return;
        setIsSaving(true);
        const { error } = await supabase.from("SystemSettings").upsert({ id: config.id, name: config.name, description: config.description, contactEmail: config.contactEmail, maintenanceMode: config.maintenanceMode, updatedAt: new Date().toISOString() });
        if (error) toast.error("Gagal menyimpan");
        else { toast.success("Pengaturan disimpan"); }
        setIsSaving(false);
    };

    if (isLoading) return <div className="flex h-80 items-center justify-center"><Loader2 className="w-7 h-7 text-primary-500 animate-spin" /></div>;

    return (
        <div className="space-y-6 pb-12 font-body">
            <div>
                <h1 className="text-2xl font-heading font-bold text-text">Pengaturan Sistem</h1>
                <p className="text-text-muted text-sm mt-1">Konfigurasi identitas situs dan pemeliharaan teknis.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-primary-50 overflow-hidden" style={{ boxShadow: 'var(--shadow-xs)' }}>
                        <div className="p-5 border-b border-primary-50 bg-surface-muted flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-white rounded-xl border border-primary-50 text-primary-600"><Globe size={18} /></div>
                                <h2 className="font-bold text-text text-sm">Identitas Situs</h2>
                            </div>
                            <button onClick={handleSave} disabled={isSaving}
                                className="btn btn-primary px-4 py-2 rounded-xl text-sm disabled:opacity-50">
                                {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                                Simpan
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-xs font-bold text-text mb-1.5 flex items-center gap-1.5">
                                        <FileText size={12} className="text-text-muted" />Nama Situs
                                    </label>
                                    <input type="text" value={config?.name || ""} onChange={(e) => setConfig(prev => prev ? { ...prev, name: e.target.value } : null)} className="input-field py-2.5" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text mb-1.5 flex items-center gap-1.5">
                                        <Mail size={12} className="text-text-muted" />Email Kontak
                                    </label>
                                    <input type="email" value={config?.contactEmail || ""} onChange={(e) => setConfig(prev => prev ? { ...prev, contactEmail: e.target.value } : null)} className="input-field py-2.5" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-text mb-1.5 flex items-center gap-1.5">
                                    <Info size={12} className="text-text-muted" />Deskripsi
                                </label>
                                <textarea rows={3} value={config?.description || ""} onChange={(e) => setConfig(prev => prev ? { ...prev, description: e.target.value } : null)} className="input-field resize-none py-2.5" />
                            </div>

                            <div className="pt-5 border-t border-primary-50">
                                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <div className="flex gap-3">
                                        <div className="p-2.5 bg-white rounded-xl text-amber-600 border border-amber-100"><ShieldAlert size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-amber-900 text-sm">Mode Perawatan</h4>
                                            <p className="text-[11px] text-amber-700 mt-0.5">Nonaktifkan fitur tambah resep untuk pengguna umum.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={config?.maintenanceMode || false}
                                            onChange={(e) => setConfig(prev => prev ? { ...prev, maintenanceMode: e.target.checked } : null)} />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Logs */}
                <div className="bg-white rounded-2xl border border-primary-50 overflow-hidden flex flex-col" style={{ boxShadow: 'var(--shadow-xs)' }}>
                    <div className="p-5 border-b border-primary-50 flex items-center gap-2.5">
                        <History className="text-primary-600" size={18} />
                        <h2 className="font-bold text-text text-sm">Audit Logs</h2>
                    </div>

                    <div className="p-4 flex-1">
                        {logs.length === 0 ? (
                            <div className="h-52 flex flex-col items-center justify-center text-center p-4 bg-surface-muted rounded-xl border border-dashed border-primary-100">
                                <Lock size={28} className="text-text-muted/20 mb-2" />
                                <p className="text-[11px] text-text-muted">Belum ada riwayat.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {logs.map((log) => (
                                    <div key={log.id} className="relative pl-5 pb-3 border-l-2 border-primary-100 last:border-0 last:pb-0">
                                        <div className="absolute left-[-7px] top-0.5 w-3 h-3 rounded-full bg-white border-2 border-primary-400" />
                                        <div>
                                            <p className="text-xs font-bold text-text leading-tight">{log.action}</p>
                                            <p className="text-[10px] text-text-muted mt-0.5">{new Date(log.createdAt).toLocaleString("id-ID")}</p>
                                            <div className="mt-1.5 p-2 bg-surface-muted rounded-lg border border-primary-50">
                                                <p className="text-[10px] text-text-secondary italic">&quot;{log.details}&quot;</p>
                                                <p className="text-[9px] text-text-muted mt-1 font-bold">— {log.adminName}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-surface-muted border-t border-primary-50">
                        <div className="flex items-center gap-1.5 text-primary-600">
                            <CheckCircle size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Sistem Normal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}