import React, { useState } from 'react';
import { Search, Plus, GraduationCap, Users, Edit3, Trash2, User, UserPlus, Award, Download, MessageCircle, X, Save, Camera, Sparkles } from 'lucide-react';

export const StudentsPage = ({ students, onDelete, onEdit, onAddExam, generateCard }: any) => {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  
  const filtered = students.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.studentCode.includes(search)
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">إدارة النخبة</h2>
          <p className="text-slate-500 text-sm mt-1">تتبع طلابك وإصدار بطاقات الهوية الخاصة بهم</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-80 group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث بالاسم أو الكود..." className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-white font-medium text-sm" />
           </div>
           <button onClick={() => { setEditingStudent(null); setIsFormOpen(true); }} className="p-3.5 bg-blue-600 rounded-2xl text-white shadow-xl hover:bg-blue-500 active:scale-95 transition-all">
              <Plus size={22} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filtered.map((s: any) => (
           <div key={s.id} className="glass-card overflow-hidden group hover:scale-[1.01] transition-all duration-300 border border-white/5 flex flex-col shadow-xl">
              <div className="h-28 bg-gradient-to-br from-blue-900/40 to-indigo-900/20 p-5 relative">
                 <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[9px] font-black text-blue-400 border border-white/10 uppercase tracking-widest">ID: {s.studentCode}</span>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => { setEditingStudent(s); setIsFormOpen(true); }} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"><Edit3 size={14}/></button>
                       <button onClick={() => onDelete(s.id)} className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all"><Trash2 size={14}/></button>
                    </div>
                 </div>
                 <div className="absolute -bottom-8 left-6">
                    <div className="w-20 h-20 rounded-2xl border-4 border-[#020617] bg-slate-800 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-3">
                       {s.photo ? <img src={s.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-700"><User size={32}/></div>}
                    </div>
                 </div>
              </div>
              <div className="p-6 pt-10 space-y-5 flex-1 flex flex-col">
                 <div>
                    <h4 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors truncate">{s.name}</h4>
                    <div className="flex gap-3 mt-1.5">
                       <span className="text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1"><GraduationCap size={12}/> {s.grade}</span>
                       <span className="text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1"><Users size={12}/> {s.group}</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
                       <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">الرصيد</p>
                       <p className={`text-lg font-black ${s.balance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{s.balance} <span className="text-[10px]">ج.م</span></p>
                    </div>
                    <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
                       <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">الأداء</p>
                       <p className="text-lg font-black text-indigo-400">{s.performance || 0}%</p>
                    </div>
                 </div>
                 <div className="mt-auto flex gap-2">
                    <button onClick={() => generateCard(s)} className="flex-1 py-3 bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-[11px] font-black transition-all border border-white/5 flex items-center justify-center gap-2"><Download size={16}/> تحميل الكارنيه</button>
                    <a href={`https://wa.me/${s.phone}`} target="_blank" className="p-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl border border-emerald-500/10 transition-all active:scale-90"><MessageCircle size={18}/></a>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {isFormOpen && (
        <StudentFormModal student={editingStudent} onClose={() => setIsFormOpen(false)} onSave={onEdit} />
      )}
    </div>
  );
};

const StudentFormModal = ({ student, onClose, onSave }: any) => {
  const [data, setData] = useState(student || { name: '', phone: '', group: 'المجموعة A', grade: 'الثالث الثانوي', photo: '' });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setData({...data, photo: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-white/10 p-8 rounded-[2rem] w-full max-w-lg shadow-3xl animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-white flex items-center gap-3">
            {student ? <Edit3 className="text-blue-500" /> : <UserPlus className="text-blue-500" />} 
            {student ? 'تعديل البيانات' : 'عضو نخبة جديد'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
        </div>
        <form className="space-y-5" onSubmit={e => { e.preventDefault(); onSave(data); onClose(); }}>
          <div className="flex justify-center mb-6">
             <div className="relative group cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/10 bg-slate-900 overflow-hidden flex items-center justify-center shadow-xl group-hover:border-blue-500/50 transition-all">
                  {data.photo ? <img src={data.photo} className="w-full h-full object-cover" /> : <Camera className="text-slate-700" size={32} />}
                </div>
                <div className="absolute inset-0 bg-blue-600/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Sparkles size={20} className="text-white" /></div>
             </div>
             <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhoto} />
          </div>
          <div className="space-y-4">
            <input required placeholder="الاسم الكامل" className="w-full bg-slate-950/50 p-4 rounded-xl border border-white/5 outline-none text-white font-bold text-sm focus:ring-2 focus:ring-blue-500/20" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
            <input required placeholder="رقم واتساب" className="w-full bg-slate-950/50 p-4 rounded-xl border border-white/5 outline-none text-white font-mono text-sm focus:ring-2 focus:ring-blue-500/20" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} />
            <div className="grid grid-cols-2 gap-3">
              <select className="bg-slate-950/50 p-4 rounded-xl border border-white/5 text-white font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500/20" value={data.grade} onChange={e => setData({...data, grade: e.target.value})}>
                <option>الأول الثانوي</option><option>الثاني الثانوي</option><option>الثالث الثانوي</option>
              </select>
              <select className="bg-slate-950/50 p-4 rounded-xl border border-white/5 text-white font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500/20" value={data.group} onChange={e => setData({...data, group: e.target.value})}>
                <option>المجموعة A</option><option>المجموعة B</option><option>المجموعة C</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"><Save size={20} /> حفظ العضو</button>
        </form>
      </div>
    </div>
  );
};