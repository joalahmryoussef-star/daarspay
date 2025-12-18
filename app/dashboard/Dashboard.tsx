import React from 'react';
import { Users, Wallet, CalendarCheck, TrendingDown, Activity, Brain, ShieldCheck, ArrowRightCircle } from 'lucide-react';

export const Dashboard = ({ students, transactions, attendance, onOpenAI }: any) => {
  const totalRev = transactions.reduce((a: any, b: any) => a + b.amount, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayCount = attendance[today] ? Object.values(attendance[today]).filter(v => v === 'present').length : 0;
  
  const debtors = students.filter((s: any) => s.balance < 0);
  const topPerformer = students.length ? [...students].sort((a,b) => (b.performance||0) - (a.performance||0))[0] : null;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">الرؤية العامة</h2>
          <p className="text-slate-500 font-medium italic">تحليلات النخبة المحدثة عبر السحابة</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
          <ShieldCheck className="text-emerald-500" size={22} />
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">مؤمن ببروتوكول Firebase</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي النخبة', val: students.length, icon: Users, color: 'blue' },
          { label: 'صافي التحصيل', val: `${totalRev} ج.م`, icon: Wallet, color: 'emerald' },
          { label: 'حضور اليوم', val: todayCount, icon: CalendarCheck, color: 'purple' },
          { label: 'ديون معلقة', val: debtors.length, icon: TrendingDown, color: 'rose' }
        ].map((s, i) => (
          <div key={i} className="glass-card p-8 group relative overflow-hidden border border-white/5 shadow-2xl hover:border-white/10 transition-all">
            <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${s.color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
            <s.icon className={`text-${s.color}-500 mb-6`} size={32} />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
            <h3 className="text-3xl font-black mt-2 text-white">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 glass-card p-10 border-white/5 bg-slate-900/40">
            <div className="flex justify-between items-center mb-10">
               <h4 className="text-xl font-black text-white flex items-center gap-3"><Activity className="text-blue-500" /> كفاءة المجموعات</h4>
               <span className="text-[10px] text-slate-500 font-bold">توزيع الطلاب حسب الجدول</span>
            </div>
            <div className="space-y-8">
              {['المجموعة A', 'المجموعة B', 'المجموعة C'].map(g => {
                 const count = students.filter((s: any) => s.group === g).length;
                 const perc = students.length ? Math.round((count / students.length) * 100) : 0;
                 return (
                   <div key={g} className="space-y-3">
                      <div className="flex justify-between text-sm font-bold">
                         <span className="text-slate-300">{g}</span>
                         <span className="text-blue-400 font-black">{count} طالباً ({perc}%)</span>
                      </div>
                      <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                         <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.3)]" style={{width: `${perc}%`}}></div>
                      </div>
                   </div>
                 );
              })}
            </div>
         </div>
         
         <div className="flex flex-col gap-6">
            <div className="glass-card p-8 bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border-indigo-500/20 flex flex-col items-center text-center justify-between min-h-[300px]">
               <div className="w-16 h-16 bg-indigo-500/10 rounded-[1.5rem] flex items-center justify-center mb-6 border border-indigo-500/20 animate-pulse">
                 <Brain className="text-indigo-400" size={32} />
               </div>
               <h4 className="text-lg font-black text-white">الملخص الذكي</h4>
               <p className="text-xs text-slate-400 leading-relaxed mt-2 px-4">
                 {topPerformer ? `أفضل أداء حالياً للطالب "${topPerformer.name}" بنسبة ${topPerformer.performance}%.` : 'ابدأ بإضافة الطلاب لتحليل الأداء.'}
                 {debtors.length > 0 && ` هناك ${debtors.length} طالباً لديهم مستحقات مالية.`}
               </p>
               <button onClick={onOpenAI} className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-xs text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                 استشارة المساعد الذكي <ArrowRightCircle size={16} />
               </button>
            </div>
            
            <div className="glass-card p-6 border-white/5 flex items-center gap-4 bg-slate-900/20">
               <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><ShieldCheck size={20}/></div>
               <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase">حالة المزامنة</p>
                  <p className="text-xs font-bold text-slate-200">متصل بالسحابة (Real-time)</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};