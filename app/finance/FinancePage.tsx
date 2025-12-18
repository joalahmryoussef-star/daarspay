import React, { useState } from 'react';
import { Plus, History, ArrowUpRight } from 'lucide-react';

export const FinancePage = ({ students, transactions, onAddTransaction }: any) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleAdd = () => {
    if(selectedStudent && amount) {
      onAddTransaction(selectedStudent, Number(amount), note);
      setSelectedStudent(''); setAmount(''); setNote('');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-white tracking-tight">المركز المالي</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="glass-card p-10 border-slate-800 h-fit">
            <h3 className="text-xl font-black text-emerald-400 mb-8 flex items-center gap-3"><Plus size={22} /> تسجيل معاملة</h3>
            <div className="space-y-6">
               <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full bg-slate-900/50 p-5 rounded-3xl border border-slate-800 text-white font-bold outline-none">
                 <option value="">اختر الطالب...</option>
                 {students.map((s: any) => <option key={s.id} value={s.id}>{s.name} (رصيد: {s.balance})</option>)}
               </select>
               <input type="number" placeholder="المبلغ" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-900/50 p-5 rounded-3xl border border-slate-800 text-white font-mono text-3xl outline-none" />
               <input placeholder="بيان الدفع" value={note} onChange={e => setNote(e.target.value)} className="w-full bg-slate-900/50 p-5 rounded-3xl border border-slate-800 text-white outline-none" />
               <button onClick={handleAdd} className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.5rem] font-black text-xl transition-all shadow-xl active:scale-95">إكمال العملية</button>
            </div>
         </div>
         <div className="lg:col-span-2 glass-card p-10 flex flex-col border-slate-800 h-[650px]">
            <h3 className="text-xl font-black text-blue-400 mb-8 flex items-center gap-3"><History size={22} /> تاريخ العمليات</h3>
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-4">
               {transactions.map((t: any) => {
                 const s = students.find((st: any) => st.id === t.studentId);
                 return (
                   <div key={t.id} className="flex justify-between items-center p-6 bg-slate-900/40 rounded-[2rem] border border-slate-800/50 hover:bg-slate-800 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><ArrowUpRight size={20}/></div>
                         <div>
                            <p className="font-black text-white text-sm">{s?.name || 'عضو مجهول'}</p>
                            <p className="text-[10px] text-slate-500 font-bold italic">{t.note}</p>
                         </div>
                      </div>
                      <div className="text-left">
                         <p className="text-xl font-black text-emerald-400">+{t.amount} ج.م</p>
                         <p className="text-[8px] font-mono text-slate-700 uppercase mt-1">{new Date(t.date).toLocaleString('ar-EG')}</p>
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </div>
    </div>
  );
};