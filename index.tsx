import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, Users, CalendarCheck, Wallet, Brain, 
  Menu, User, LogOut, CheckCircle2, AlertCircle, GraduationCap, X, Shield
} from 'lucide-react';
import { AuthPage } from './app/auth/AuthPage';
import { AIService } from './services/ai.service';
import { DBService } from './services/db.service';
import { Dashboard } from './app/dashboard/Dashboard';
import { StudentsPage } from './app/students/StudentsPage';
import { AttendancePage } from './app/attendance/AttendancePage';
import { FinancePage } from './app/finance/FinancePage';
import { AIAssistant } from './app/ai/AIAssistant';
import { ProfilePage } from './app/profile/ProfilePage';
import { TermsContent, PrivacyContent } from './app/legal/LegalContent';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => DBService.get('auth', false));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);
  
  // Data State
  const [students, setStudents] = useState(() => DBService.get('students', []));
  const [attendance, setAttendance] = useState(() => DBService.get('attendance', {}));
  const [transactions, setTransactions] = useState(() => DBService.get('finance', []));
  const [profile, setProfile] = useState(() => DBService.get('profile', { name: 'الأستاذ أحمد علي', email: 'teacher@darspay.com', role: 'معلم أول', avatar: '' }));
  const [messages, setMessages] = useState(() => DBService.get('chat', [{ id: '1', role: 'model', text: 'أهلاً بك في DarsPay Elite. كيف أخدمك اليوم؟', timestamp: Date.now() }]));

  const aiService = new AIService();

  useEffect(() => {
    DBService.save('auth', isAuthenticated);
    DBService.save('students', students);
    DBService.save('attendance', attendance);
    DBService.save('finance', transactions);
    DBService.save('profile', profile);
    DBService.save('chat', messages);
  }, [isAuthenticated, students, attendance, transactions, profile, messages]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleAddStudent = (data: any) => {
    const newStudent = { ...data, id: Math.random().toString(36).substr(2, 9), studentCode: Math.floor(100000 + Math.random() * 900000).toString(), balance: 0, performance: 0 };
    setStudents(prev => [...prev, newStudent]);
    showToast('تم إضافة الطالب بنجاح');
  };

  const handleUpdateStudent = (data: any) => {
    setStudents(prev => prev.map(s => s.id === data.id ? data : s));
    showToast('تم تحديث بيانات الطالب');
  };

  const handleDeleteStudent = (id: string) => {
    if(confirm('هل تريد الحذف؟')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast('تم الحذف', 'error');
    }
  };

  const handleAddTransaction = (studentId: string, amount: number, note: string) => {
    const newTx = { id: Math.random().toString(36).substr(2, 9), studentId, amount, note, date: new Date().toISOString() };
    setTransactions(prev => [newTx, ...prev]);
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, balance: s.balance + amount } : s));
    showToast('تم تسجيل العملية المالية');
  };

  const handleUpdateAttendance = (date: string, studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [date]: { ...(prev[date] || {}), [studentId]: status } }));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoadingAI(true);
    const response = await aiService.handleCommand(text, students, {
      onAddStudent: handleAddStudent,
      onAddTransaction: handleAddTransaction
    });
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || 'عذراً، لم أفهم طلبك.', timestamp: Date.now() }]);
    setLoadingAI(false);
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={p => { setProfile({...profile, ...p}); setIsAuthenticated(true); }} showToast={showToast} />;
  }

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-slate-200 selection:bg-blue-500/20 font-tajawal">
      {/* Toasts */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[3000] flex flex-col gap-4 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`px-10 py-6 rounded-[2.5rem] shadow-2xl border-2 flex items-center gap-5 animate-in slide-in-from-top-10 duration-500 bg-[#0f172a] ${t.type === 'success' ? 'border-emerald-500/50 text-emerald-400' : 'border-blue-500/50 text-blue-400'}`}>
            {t.type === 'success' ? <CheckCircle2 size={28}/> : <AlertCircle size={28}/>}
            <span className="font-black text-sm">{t.message}</span>
          </div>
        ))}
      </div>

      <aside className={`fixed inset-y-0 right-0 z-50 w-80 bg-[#0f172a] border-l border-slate-800/50 transform transition-transform duration-500 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-12 border-b border-slate-800/20 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-700 to-indigo-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 rotate-6">
             <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Elite <span className="text-blue-500">Max</span></h1>
        </div>
        <nav className="p-10 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة القيادة' },
            { id: 'students', icon: Users, label: 'إدارة النخبة' },
            { id: 'attendance', icon: CalendarCheck, label: 'الحضور الذكي' },
            { id: 'finance', icon: Wallet, label: 'المركز المالي' },
            { id: 'ai', icon: Brain, label: 'المساعد الذكي' },
            { id: 'profile', icon: User, label: 'الملف الشخصي' }
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-5 px-8 py-4 rounded-2xl transition-all font-black ${activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}>
              <item.icon size={22} /><span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-800/30 space-y-4">
           <div className="flex justify-center gap-4 text-[10px] text-slate-500">
             <button onClick={() => setShowLegalModal('terms')} className="hover:text-blue-400">الشروط</button>
             <button onClick={() => setShowLegalModal('privacy')} className="hover:text-blue-400">الخصوصية</button>
           </div>
           <button onClick={() => { if(confirm('خروج؟')) setIsAuthenticated(false); }} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all font-black text-xs">
             <LogOut size={18} /> تسجيل الخروج
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden bg-[#0f172a]/80 backdrop-blur-xl px-10 py-8 flex justify-between items-center z-30 border-b border-slate-800/30">
          <h1 className="text-2xl font-black text-blue-500">Elite Max</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-4 bg-slate-800 rounded-2xl text-slate-300 shadow-xl"><Menu size={28} /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-slate-950/20">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && <Dashboard students={students} transactions={transactions} attendance={attendance} onOpenAI={() => setActiveTab('ai')} />}
            {activeTab === 'students' && <StudentsPage students={students} onDelete={handleDeleteStudent} onEdit={(d: any) => d.id ? handleUpdateStudent(d) : handleAddStudent(d)} onAddExam={() => showToast('قسم الدرجات قيد التطوير')} generateCard={() => showToast('جاري توليد PDF...')} />}
            {activeTab === 'attendance' && <AttendancePage students={students} attendance={attendance} onUpdateStatus={handleUpdateAttendance} />}
            {activeTab === 'finance' && <FinancePage students={students} transactions={transactions} onAddTransaction={handleAddTransaction} />}
            {activeTab === 'ai' && <AIAssistant messages={messages} onSendMessage={handleSendMessage} loading={loadingAI} />}
            {activeTab === 'profile' && <ProfilePage profile={profile} onUpdate={setProfile} onLogout={() => setIsAuthenticated(false)} />}
          </div>
        </main>
      </div>

      {/* Legal Modal Overlay */}
      {showLegalModal && (
        <div className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar shadow-3xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Shield className="text-blue-500" />
                {showLegalModal === 'terms' ? 'شروط الاستخدام' : 'سياسة الخصوصية'}
              </h2>
              <button onClick={() => setShowLegalModal(null)} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={28} /></button>
            </div>
            {showLegalModal === 'terms' ? <TermsContent /> : <PrivacyContent />}
          </div>
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);