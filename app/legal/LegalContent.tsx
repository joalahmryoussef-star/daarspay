import React from 'react';
import { ShieldCheck, FileText, Scale, Brain, AlertTriangle } from 'lucide-react';

export const TermsContent = () => (
  <div className="space-y-8 text-right" dir="rtl">
    <section>
      <h3 className="text-xl font-black text-blue-400 mb-4 flex items-center gap-2">
        <FileText size={24} /> 1. التعريفات
      </h3>
      <ul className="list-disc list-inside space-y-2 text-slate-300 mr-4">
        <li><strong>المنصة:</strong> تطبيق DarsPay بجميع نسخه (ويب – موبايل – SaaS).</li>
        <li><strong>المستخدم:</strong> أي معلم أو شخص يقوم بإنشاء حساب على المنصة.</li>
        <li><strong>الخدمة:</strong> أدوات إدارة الطلاب، الحضور، المعاملات، والتحليلات.</li>
      </ul>
    </section>

    <section>
      <h3 className="text-xl font-black text-blue-400 mb-4 flex items-center gap-2">
        <Scale size={24} /> 2. نطاق الخدمة
      </h3>
      <p className="text-slate-300 leading-relaxed">
        توفر منصة DarsPay أدوات تنظيمية وإدارية للمعلمين، ولا تُعد بديلاً عن المؤسسات التعليمية الرسمية أو الجهات الحكومية أو الأنظمة المالية المعتمدة. المنصة لا تقدم اعتمادًا تعليميًا أو شهادات رسمية.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-black text-blue-400 mb-4 flex items-center gap-2">
        <ShieldCheck size={24} /> 3. إنشاء الحساب والمسؤولية
      </h3>
      <p className="text-slate-300 leading-relaxed">
        المستخدم مسؤول مسؤولية كاملة عن صحة البيانات المُدخلة والحفاظ على سرية بيانات الدخول. يمنع مشاركة الحساب مع أطراف أخرى، وأي نشاط يتم عبر الحساب يُنسب لصاحب الحساب قانونيًا.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-black text-rose-400 mb-4 flex items-center gap-2">
        <AlertTriangle size={24} /> 4. إخلاء المسؤولية والقانون
      </h3>
      <p className="text-slate-300 leading-relaxed">
        المنصة تُقدّم "كما هي" دون ضمانات. تخضع هذه الشروط وتُفسَّر وفقًا لقوانين جمهورية مصر العربية، ويكون الاختصاص القضائي لمحاكمها.
      </p>
    </section>

    <section className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/20">
      <h3 className="text-lg font-black text-blue-400 mb-2 flex items-center gap-2">
        <Brain size={22} /> بند الذكاء الاصطناعي
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">
        التحليلات الذكية مبنية على بيانات يُدخلها المستخدم. النتائج استرشادية وليست توصيات ملزمة. لا تتحمل المنصة أي مسؤولية عن قرارات تُبنى حصريًا على مخرجات الذكاء الاصطناعي.
      </p>
    </section>
  </div>
);

export const PrivacyContent = () => (
  <div className="space-y-8 text-right" dir="rtl">
    <section>
      <h3 className="text-xl font-black text-indigo-400 mb-4 flex items-center gap-2">
        <ShieldCheck size={24} /> 1. البيانات التي نجمعها
      </h3>
      <p className="text-slate-300 leading-relaxed">
        نجمع بيانات الحساب (الاسم – البريد الإلكتروني)، بيانات الطلاب التي يُدخلها المستخدم، وبيانات استخدام المنصة لتحسين الخدمة.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-black text-indigo-400 mb-4 flex items-center gap-2">
        <FileText size={24} /> 2. حماية بيانات الطلاب
      </h3>
      <p className="text-slate-300 leading-relaxed">
        المستخدم (المعلم) هو المسؤول الوحيد عن إدخال بيانات الطلاب. DarsPay لا تتحقق من صحة هذه البيانات ولا تتحمل مسؤولية قانونية عنها، ونحن نستخدم إجراءات تقنية متقدمة لحمايتها.
      </p>
    </section>
  </div>
);