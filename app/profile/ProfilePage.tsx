import React, { useState } from 'react';
import { User, Settings, Mail, Briefcase, Camera, AlertCircle, LogOut } from 'lucide-react';

export const ProfilePage = ({ profile, onUpdate, onLogout }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(profile);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h2 className="text-4xl font-black text-white tracking-tight">الملف الشخصي</h2>
        <p className="text-slate-500 font-medium">إدارة هويتك الرقمية كمعلم نخبة</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card overflow-hidden border-slate-800">
            <div className="h-32 bg-gradient-to-br from-blue-600/80 to-indigo-900"></div>
            <div className="px-8 pb-10 text-center relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-slate-800 border-[6px] border-[#020617] mx-auto -mt-16 mb-6 overflow-hidden shadow-2xl relative group">
                {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-6 text-slate-600" />}
              </div>
              <h3 className="text-2xl font-black text-white">{profile.name}</h3>
              <p className="text-blue-500 font-bold text-sm mt-1">{profile.role}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 border-slate-800">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-xl font-black text-white flex items-center gap-3"><Settings className="text-blue-500" /> إعدادات الحساب</h4>
              <button onClick={() => { if(isEditing) onUpdate(temp); setIsEditing(!isEditing); }} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black transition-all">
                {isEditing ? 'حفظ التغييرات' : 'تعديل الملف'}
              </button>
            </div>
            <div className="space-y-6">
               <input disabled={!isEditing} className="w-full bg-slate-900/50 p-5 rounded-3xl border border-slate-800 text-white font-bold" value={temp.name} onChange={e => setTemp({...temp, name: e.target.value})} />
               <input disabled={!isEditing} className="w-full bg-slate-900/50 p-5 rounded-3xl border border-slate-800 text-white font-mono" value={temp.email} onChange={e => setTemp({...temp, email: e.target.value})} />
               <input disabled={!isEditing} className="w-full bg-slate-900/50 p-5 rounded-3xl border border-slate-800 text-white font-bold" value={temp.role} onChange={e => setTemp({...temp, role: e.target.value})} />
            </div>
          </div>
          <div className="glass-card p-10 border-rose-500/10 bg-rose-500/5">
            <h4 className="text-xl font-black text-rose-500 mb-6 flex items-center gap-3"><AlertCircle size={24} /> منطقة الخطر</h4>
            <button onClick={onLogout} className="px-8 py-5 bg-rose-600 text-white rounded-2xl font-black text-sm transition-all flex items-center gap-3"><LogOut size={20} /> تسجيل الخروج النهائي</button>
          </div>
        </div>
      </div>
    </div>
  );
};