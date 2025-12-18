import React, { useState } from 'react';
import { QrCode, User, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const AttendancePage = ({ students, attendance, onUpdateStatus }: any) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance[today] || {};

  const handleScan = () => {
    const student = students.find((s: any) => s.studentCode === scannedCode);
    if (student) {
      onUpdateStatus(today, student.id, 'present');
      setScannedCode('');
      setIsScannerOpen(false);
    }
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
      <h2 className="text-4xl font-black text-white tracking-tight">الحضور الذكي</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <button onClick={() => setIsScannerOpen(true)} className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[3rem] font-black text-2xl flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 hover:brightness-110">
           <QrCode size={40} /> ماسح الكود الذكي
         </button>
         <div className="glass-card p-10 flex flex-col items-center justify-center border-slate-800">
            <p className="text-slate-500 text-xs font-black mb-2 uppercase">نسبة الحضور اليوم</p>
            <h3 className="text-5xl font-black text-white">{students.length ? Math.round((Object.keys(todayAttendance).length / students.length) * 100) : 0}%</h3>
         </div>
      </div>
      <div className="space-y-4">
        {students.map((s: any) => (
          <div key={s.id} className="glass-card p-6 flex items-center justify-between border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center">
                 {s.photo ? <img src={s.photo} className="w-full h-full object-cover" /> : <User size={24} className="text-slate-600"/>}
               </div>
               <h5 className="font-black text-xl text-white">{s.name}</h5>
            </div>
            <div className="flex gap-2">
               <button onClick={() => onUpdateStatus(today, s.id, 'present')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all ${todayAttendance[s.id] === 'present' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'}`}>حاضر</button>
               <button onClick={() => onUpdateStatus(today, s.id, 'absent')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all ${todayAttendance[s.id] === 'absent' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-500'}`}>غائب</button>
            </div>
          </div>
        ))}
      </div>

      {isScannerOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[4rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-4"><QrCode className="text-blue-500" /> ماسح الحضور</h3>
              <button onClick={() => setIsScannerOpen(false)} className="p-2 text-slate-500 hover:text-white"><X size={28} /></button>
            </div>
            <div className="space-y-8 flex flex-col items-center">
              <div className="w-64 h-64 border-2 border-dashed border-blue-500/30 rounded-3xl flex items-center justify-center relative overflow-hidden bg-slate-800/20">
                <div className="absolute inset-x-0 h-1 bg-blue-500/50 animate-bounce"></div>
                <QrCode size={120} className="text-slate-700 opacity-20" />
              </div>
              <input autoFocus placeholder="أدخل كود الطالب" className="w-full bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-white font-black text-2xl text-center outline-none" value={scannedCode} onChange={e => setScannedCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleScan()} />
              <button onClick={handleScan} className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl active:scale-95 transition-all">تأكيد الحضور</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};