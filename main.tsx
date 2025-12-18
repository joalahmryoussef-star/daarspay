import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, Users, CalendarCheck, Wallet, Brain, 
  Menu, User, LogOut, CheckCircle2, AlertCircle, GraduationCap, X, Shield, Sparkles, Loader2
} from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthPage } from './app/auth/AuthPage';
import { AIService } from './services/ai.service';
import { DBService } from './services/db.service';
import { AuthService } from './services/auth.service';
import { PDFService } from './services/pdf.service';
import { Dashboard } from './app/dashboard/Dashboard';
import { StudentsPage } from './app/students/StudentsPage';
import { AttendancePage } from './app/attendance/AttendancePage';
import { FinancePage } from './app/finance/FinancePage';
import { AIAssistant } from './app/ai/AIAssistant';
import { ProfilePage } from './app/profile/ProfilePage';
import { TermsContent, PrivacyContent } from './app/legal/LegalContent';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }

const App = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);
  
  // Data State
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>({});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({ name: '', email: '', role: 'معلم', avatar: '' });
  const [messages, setMessages] = useState<any[]>([]);

  const aiService = new AIService();

  // 1. Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch initial data from Firestore
        await loadUserData(user.uid);
      }
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const studentData = await DBService.getCollection(`users/${uid}/students`);
      const financeData = await DBService.getCollection(`users/${uid}/finance`);
      const profileData = await DBService.getDocument(`users/${uid}/profile`, 'data');
      const attendanceData = await DBService.getCollection(`users/${uid}/attendance`);
      
      setStudents(studentData);
      setTransactions(financeData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      if (profileData) setProfile(profileData);
      
      // Map attendance collection to object structure
      const attObj: any = {};
      attendanceData.forEach((doc: any) => {
        attObj[doc.id] = doc.records;
      });
      setAttendance(attObj);
      
      setMessages([{ id: '1', role: 'model', text: `أهلاً بك يا ${profileData?.name || 'استاذ'}. كيف يمكنني مساعدتك اليوم؟`, timestamp: Date.now() }]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleAddStudent = async (data: any) => {
    if (!currentUser) return;
    const id = Math.random().toString(36).substr(2, 9);
    const newStudent = { ...data, id, studentCode: Math.floor(100000 + Math.random() * 900000).toString(), balance: 0, performance: 0 };
    await DBService.setDocument(`users/${currentUser.uid}/students`, id, newStudent);
    setStudents(prev => [...prev, newStudent]);
    showToast(`تمت إضافة ${data.name} بنجاح`);
  };

  const handleUpdateStudent = async (data: any) => {
    if (!currentUser) return;
    await DBService.setDocument(`users/${currentUser.uid}/students`, data.id, data);
    setStudents(prev => prev.map(s => s.id === data.id ? data : s));
    showToast('تم تحديث البيانات');
  };

  const handleDeleteStudent = async (id: string) => {
    if (!currentUser) return;
    if(confirm('هل أنت متأكد من حذف بيانات هذا الطالب نهائياً؟')) {
      await DBService.removeDocument(`users/${currentUser.uid}/students`, id);
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast('تم الحذف بنجاح', 'error');
    }
  };

  const handleAddTransaction = async (studentId: string, amount: number, note: string) => {
    if (!currentUser) return;
    const id = Math.random().toString(36).substr(2, 9);
    const newTx = { id, studentId, amount, note, date: new Date().toISOString() };
    
    await DBService.setDocument(`users/${currentUser.uid}/finance`, id, newTx);
    
    const student = students.find(s => s.id === studentId);
    if (student) {
      const updatedStudent = { ...student, balance: (student.balance || 0) + amount };
      await handleUpdateStudent(updatedStudent);
    }
    
    setTransactions(prev => [newTx, ...prev]);
    showToast('تم تسجيل المعاملة المالية');
  };

  const handleUpdateAttendance = async (date: string, studentId: string, status: string) => {
    if (!currentUser) return;
    const newRecords = { ...(attendance[date] || {}), [studentId]: status };
    await DBService.setDocument(`users/${currentUser.uid}/attendance`, date, { records: newRecords });
    setAttendance(prev => ({ ...prev, [date]: newRecords }));
  };

  const handleUpdateProfile = async (newData: any) => {
    if (!currentUser) return;
    await DBService.setDocument(`users/${currentUser.uid}/profile`, 'data', newData);
    setProfile(newData);
    showToast('تم تحديث ملفك الشخصي');
  };

  const handleSendMessage = async (text: string) => {
    const userMsg = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoadingAI(true);
    const response = await aiService.handleCommand(text, students, {
      onAddStudent: handleAddStudent,
      onAddTransaction: handleAddTransaction
    });
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response || 'عذراً، واجهت صعوبة في معالجة طلبك.', timestamp: Date.now() }]);
    setLoadingAI(false);
  };

  const handleLogout = async () => {
    if (confirm('هل تريد تسجيل الخروج؟')) {
      await AuthService.logout();
      showToast('تم تسجيل الخروج');
    }
  };

  if (initializing) {
    return (
      <div className="h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthPage 
        onAuthSuccess={(u) => { 
          // Re-fetch handled by onAuthStateChanged 
        }} 
        showToast={showToast} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-slate-200 selection:bg-blue-500/20 font-tajawal">
      {/* Toasts */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[3000] flex flex-col gap-4 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`px-10 py-5 rounded-2xl shadow-2xl border flex items-center gap-5 animate-in slide-in-from-top-10 duration-500 bg-[#0f172a] ${t.type === 'success' ? 'border-emerald-500/30 text-emerald-400' : 'border-blue-500/30 text-blue-400'}`}>
            {t.type === 'success' ? <CheckCircle2 size={24}/> : <AlertCircle size={24}/>}
            <span className="font-bold text-sm">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#0f172a] border-l border-white/5 transform transition-transform duration-500 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10 border-b border-white/5 flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 animate-float">
             <GraduationCap className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">Elite <span className="text-blue-500">Max</span></h1>
        </div>
        <nav className="p-6 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة القيادة' },
            { id: 'students', icon: Users, label: 'إدارة النخبة' },
            { id: 'attendance', icon: CalendarCheck, label: 'الحضور الذكي' },
            { id: 'finance', icon: Wallet, label: 'المركز المالي' },
            { id: 'ai', icon: Brain, label: 'المساعد الذكي' },
            { id: 'profile', icon: User, label: 'الملف الشخصي' }
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all font-bold ${activeTab === item.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
              <item.icon size={20} /><span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/5 space-y-4">
           <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-500">
             <button onClick={() => setShowLegalModal('terms')} className="hover:text-blue-400">الشروط</button>
             <button onClick={() => setShowLegalModal('privacy')} className="hover:text-blue-400">الخصوصية</button>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold text-xs">
             <LogOut size={16} /> خروج آمن
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden bg-[#0f172a]/80 backdrop-blur-xl px-8 py-6 flex justify-between items-center z-30 border-b border-white/5">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-blue-500" size={24} />
            <h1 className="text-xl font-black text-white">Elite Max</h1>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-3 bg-slate-800 rounded-xl text-slate-300"><Menu size={24} /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-slate-950/20 relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-20"></div>
          <div className="max-w-7xl mx-auto h-full pb-20">
            {activeTab === 'dashboard' && <Dashboard students={students} transactions={transactions} attendance={attendance} onOpenAI={() => setActiveTab('ai')} />}
            {activeTab === 'students' && <StudentsPage students={students} onDelete={handleDeleteStudent} onEdit={(d: any) => d.id ? handleUpdateStudent(d) : handleAddStudent(d)} onAddExam={() => showToast('نظام الاختبارات سيتم تفعيله قريباً')} generateCard={PDFService.generateStudentCard} />}
            {activeTab === 'attendance' && <AttendancePage students={students} attendance={attendance} onUpdateStatus={handleUpdateAttendance} />}
            {activeTab === 'finance' && <FinancePage students={students} transactions={transactions} onAddTransaction={handleAddTransaction} />}
            {activeTab === 'ai' && <AIAssistant messages={messages} onSendMessage={handleSendMessage} loading={loadingAI} />}
            {activeTab === 'profile' && <ProfilePage profile={profile} onUpdate={handleUpdateProfile} onLogout={handleLogout} />}
          </div>
        </main>
      </div>

      {/* Legal Modal Overlay */}
      {showLegalModal && (
        <div className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 p-8 md:p-12 rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-3xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
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