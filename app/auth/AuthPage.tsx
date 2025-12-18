import React, { useState } from 'react';
import { GraduationCap, LogIn, UserPlus, AtSign, Lock, User, X, Shield, Loader2, AlertTriangle, Key } from 'lucide-react';
import { TermsContent, PrivacyContent } from '../legal/LegalContent';
import { AuthService } from '../../services/auth.service';
import { isConfigValid } from '../../firebase';

interface AuthPageProps {
  onAuthSuccess: (userProfile: any) => void;
  showToast: (msg: string, type?: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, showToast }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [accepted, setAccepted] = useState(false);
  const [showLegal, setShowLegal] = useState<'terms' | 'privacy' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfigValid) {
      showToast('النظام غير مهيأ: يرجى استبدال "xxxx" بمفاتيح Firebase الحقيقية في ملف البيئة.', 'error');
      return;
    }

    if (authMode === 'register' && !accepted) {
      showToast('يرجى الموافقة على الشروط أولاً', 'error');
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'login') {
        const result = await AuthService.login(formData.email, formData.password);
        onAuthSuccess(result.user);
        showToast('مرحباً بك مجدداً في Elite Max');
      } else {
        const result = await AuthService.register(formData.email, formData.password);
        onAuthSuccess(result.user);
        showToast('تم إنشاء حسابك بنجاح');
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      if (error.code === 'auth/invalid-api-key' || error.message?.includes('api-key')) {
        showToast('خطأ فني: مفتاح API غير صالح. تأكد من إعدادات السحابة.', 'error');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        showToast('خطأ في البريد أو كلمة المرور', 'error');
      } else {
        showToast(error.message || 'فشل الاتصال بالخادم', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-[#020617] flex items-center justify-center p-6 overflow-hidden font-tajawal">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-lg glass-card p-8 md:p-12 border-white/5 relative z-10 shadow-3xl">
        {!isConfigValid && (
          <div className="mb-8 p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex flex-col items-center text-center gap-3 animate-pulse">
            <div className="p-3 bg-rose-500/20 rounded-full text-rose-500">
              <Key size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-rose-400">تنبيه تقني هام</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                مفاتيح الربط مع Firebase غير مكتملة أو تحتوي على قيم افتراضية (xxxx). <br/>
                يرجى تحديث متغيرات البيئة ببيانات مشروعك الحقيقية لتفعيل الدخول.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 rotate-12 mb-4">
             <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Elite <span className="text-blue-500">Max</span></h1>
          <p className="text-slate-400 text-xs font-medium tracking-wide">نظام المعلم الذكي - الإصدار المتطور</p>
        </div>

        <div className="flex bg-slate-900/50 p-1.5 rounded-xl mb-8 border border-slate-800">
           <button 
             onClick={() => setAuthMode('login')} 
             className={`flex-1 py-3 rounded-lg font-black text-xs transition-all ${authMode === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             تسجيل الدخول
           </button>
           <button 
             onClick={() => setAuthMode('register')} 
             className={`flex-1 py-3 rounded-lg font-black text-xs transition-all ${authMode === 'register' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             إنشاء حساب
           </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {authMode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">اسم المعلم</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required type="text" placeholder="أدخل اسمك بالكامل" className="w-full bg-slate-800/40 p-4 pr-12 rounded-2xl border border-slate-700 focus:ring-2 focus:ring-blue-500/50 outline-none text-white text-sm font-bold transition-all placeholder:text-slate-600" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">البريد الإلكتروني</label>
            <div className="relative">
              <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input required type="email" placeholder="example@mail.com" className="w-full bg-slate-800/40 p-4 pr-12 rounded-2xl border border-slate-700 focus:ring-2 focus:ring-blue-500/50 outline-none text-white text-sm font-mono transition-all placeholder:text-slate-600" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 mr-2 uppercase tracking-widest">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input required type="password" placeholder="••••••••" className="w-full bg-slate-800/40 p-4 pr-12 rounded-2xl border border-slate-700 focus:ring-2 focus:ring-blue-500/50 outline-none text-white text-sm transition-all placeholder:text-slate-600" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          {authMode === 'register' && (
            <label className="flex items-start gap-3 cursor-pointer group px-1">
              <input 
                type="checkbox" 
                checked={accepted} 
                onChange={e => setAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 leading-relaxed select-none">
                أوافق على 
                <button type="button" onClick={() => setShowLegal('terms')} className="text-blue-500 hover:text-blue-400 transition-colors mx-1 font-bold">شروط الخدمة</button> 
                و 
                <button type="button" onClick={() => setShowLegal('privacy')} className="text-blue-500 hover:text-blue-400 transition-colors mx-1 font-bold">سياسة الخصوصية</button>
              </span>
            </label>
          )}
          
          <button 
            type="submit" 
            disabled={loading || (authMode === 'register' && !accepted) || !isConfigValid}
            className={`w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${loading || (authMode === 'register' && !accepted) || !isConfigValid ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-600/20'}`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (authMode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />)}
            {authMode === 'login' ? 'دخول لوحة التحكم' : 'إنشاء حساب جديد'}
          </button>
        </form>

        <footer className="mt-10 pt-6 border-t border-slate-800/50 flex flex-wrap justify-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
           <button onClick={() => setShowLegal('terms')} className="hover:text-blue-400 transition-colors">Terms</button>
           <span>•</span>
           <button onClick={() => setShowLegal('privacy')} className="hover:text-blue-400 transition-colors">Privacy</button>
           <span>•</span>
           <p>© {new Date().getFullYear()} DarsPay Elite</p>
        </footer>
      </div>

      {showLegal && (
        <div className="fixed inset-0 z-[6000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-3xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Shield className="text-blue-500" />
                {showLegal === 'terms' ? 'شروط الاستخدام' : 'سياسة الخصوصية'}
              </h2>
              <button onClick={() => setShowLegal(null)} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={32} /></button>
            </div>
            {showLegal === 'terms' ? <TermsContent /> : <PrivacyContent />}
          </div>
        </div>
      )}
    </div>
  );
};