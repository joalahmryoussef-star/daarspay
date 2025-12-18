import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async handleCommand(command: string, students: any[], callbacks: { 
    onAddStudent: (data: any) => void, 
    onAddTransaction: (studentId: string, amount: number, note: string) => void 
  }) {
    const studentTool: FunctionDeclaration = {
      name: 'manage_student',
      description: 'إضافة أو تحديث طالب في قاعدة البيانات',
      parameters: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING, enum: ['add', 'update'], description: 'الإجراء المطلوب' },
          name: { type: Type.STRING, description: 'اسم الطالب' },
          group: { type: Type.STRING, description: 'اسم المجموعة' },
          grade: { type: Type.STRING, description: 'الصف الدراسي' }
        },
        required: ['action', 'name']
      }
    };

    const paymentTool: FunctionDeclaration = {
      name: 'record_finance',
      description: 'تسجيل عملية مالية لطالب موجود',
      parameters: {
        type: Type.OBJECT,
        properties: {
          student_name: { type: Type.STRING, description: 'اسم الطالب التقريبي' },
          amount: { type: Type.NUMBER, description: 'المبلغ المالي' },
          note: { type: Type.STRING, description: 'بيان المعاملة' }
        },
        required: ['student_name', 'amount']
      }
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: command,
        config: {
          tools: [{ functionDeclarations: [studentTool, paymentTool] }],
          systemInstruction: `أنت "DarsPay AI Pro"، المساعد الذكي المتقدم. 
          البيانات الحالية للطلاب: ${JSON.stringify(students.map(s => ({ 
            id: s.id, 
            name: s.name, 
            balance: s.balance, 
            grade: s.grade, 
            performance: s.performance 
          })))}.
          
          قدراتك الذكية المضافة:
          1. التحليل المالي: اكتشاف من لديهم ديون معلقة واقتراح رسائل تذكير لطيفة.
          2. التنبؤ الأكاديمي: إذا سألك المعلم عن مستوى طالب، حلل أدائه وتنبأ بمستواه المستقبلي.
          3. إدارة المهام: يمكنك معالجة طلبات إضافة الطلاب أو تسجيل المدفوعات عبر الأدوات.
          4. الرد بلغة عربية فصحى ومهنية تليق بمعلم نخبة.
          
          في حال طلب المعلم تحليل "الديون" أو "المستوى العام"، قدم تقريراً ملخصاً بالنقاط.`
        }
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          const args = call.args as any;
          if (call.name === 'manage_student') {
            callbacks.onAddStudent({ name: args.name, group: args.group || 'المجموعة A', grade: args.grade || 'غير محدد' });
            return `تم تنفيذ الأمر الذكي: إضافة الطالب "${args.name}" إلى المنصة بنجاح.`;
          }
          if (call.name === 'record_finance') {
            const student = students.find(s => s.name.toLowerCase().includes(args.student_name.toLowerCase()));
            if (student) {
              callbacks.onAddTransaction(student.id, args.amount, args.note || 'دفعة مسجلة ذكياً');
              return `تم بنجاح تحديث المركز المالي للطالب ${student.name} بمبلغ ${args.amount} ج.م.`;
            }
            return `عذراً، لم أتمكن من العثور على طالب يطابق الاسم "${args.student_name}". هل تقصد اسماً آخر؟`;
          }
        }
      }
      
      return response.text;
    } catch (err) {
      console.error("AI Service Error:", err);
      return "حدث خطأ غير متوقع في محرك الذكاء الاصطناعي. يرجى التأكد من صلاحية مفاتيح الربط.";
    }
  }
}