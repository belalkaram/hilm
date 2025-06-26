import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.AI_API_KEY || ""
});

export async function analyzeDream(dreamText: string): Promise<string> {
  try {
    const prompt = `
أنت خبير في تفسير الأحلام باللغة العربية. قم بتحليل الحلم التالي وقدم تفسيراً شاملاً ومفصلاً.

الحلم: ${dreamText}

يرجى تقديم تفسير يتضمن:
1. التفسير العام للحلم
2. الرموز المهمة وما تعنيه
3. الدلالات النفسية والروحية
4. نصائح وتوصيات للحالم

اكتب الإجابة باللغة العربية بأسلوب واضح ومفهوم.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const analysis = response.text;
    if (!analysis) {
      throw new Error("لم يتم الحصول على تفسير من الذكاء الاصطناعي");
    }

    return analysis;
  } catch (error) {
    console.error("خطأ في تحليل الحلم:", error);
    throw new Error("حدث خطأ أثناء تحليل الحلم. يرجى المحاولة مرة أخرى.");
  }
}
