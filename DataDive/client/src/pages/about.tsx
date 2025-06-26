import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* AdSense Ad Space - Top Banner */}
      <div className="w-full mb-8">
        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
          <p className="text-sm text-dream-secondary text-center mb-2">مساحة إعلانية - Top Banner (728x90)</p>
          <div className="h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded flex items-center justify-center">
            <span className="text-xs text-white/50">AdSense Banner Space</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dream-text">عن الموقع</h1>
        <p className="text-xl text-dream-secondary">تعرف على كيفية عمل موقع تحليل الأحلام</p>
      </div>

      <div className="grid gap-8 md:gap-12">
        {/* What is this */}
        <Card className="dream-card">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <i className="fas fa-lightbulb text-3xl text-indigo-400 ml-4"></i>
              <h2 className="text-2xl font-bold text-dream-text">ما هو هذا الموقع؟</h2>
            </div>
            <p className="text-lg leading-relaxed text-dream-secondary">
              موقع تحليل الأحلام هو منصة تستخدم تقنيات الذكاء الاصطناعي المتقدمة لتفسير الأحلام بناءً على النصوص التي يكتبها المستخدمون. نهدف إلى تقديم تجربة ممتعة وتفاعلية لاستكشاف عالم الأحلام.
            </p>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="dream-card">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <i className="fas fa-cogs text-3xl text-indigo-400 ml-4"></i>
              <h2 className="text-2xl font-bold text-dream-text">كيف يعمل؟</h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-dream-secondary">
              <p>1. اكتب حلمك بالتفصيل في المربع المخصص</p>
              <p>2. يقوم الذكاء الاصطناعي بتحليل النص وفهم رموز الحلم</p>
              <p>3. تحصل على تفسير شامل يتضمن المعاني المحتملة</p>
              <p>4. يمكنك حفظ ومشاركة النتائج مع الأصدقاء</p>
            </div>
          </CardContent>
        </Card>

        {/* AdSense Ad Space - Medium Rectangle */}
        <div className="flex justify-center my-8">
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <p className="text-sm text-dream-secondary text-center mb-2">مساحة إعلانية - Medium Rectangle (300x250)</p>
            <div className="w-72 h-48 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded flex items-center justify-center">
              <span className="text-xs text-white/50">AdSense Medium Rectangle</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <Card className="dream-card">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <i className="fas fa-exclamation-triangle text-3xl text-yellow-400 ml-4"></i>
              <h2 className="text-2xl font-bold text-dream-text">تنويه قانوني</h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-dream-secondary">
              <p>• تفسيرات الأحلام المقدمة هي للتسلية والترفيه فقط</p>
              <p>• لا نقدم استشارات نفسية أو طبية متخصصة</p>
              <p>• في حالة وجود مشاكل نفسية، يُرجى استشارة مختص</p>
              <p>• النتائج مبنية على الذكاء الاصطناعي وقد تختلف عن التفسيرات التقليدية</p>
            </div>
          </CardContent>
        </Card>

        {/* AdSense Ad Space - Bottom Banner */}
        <div className="mt-8">
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <p className="text-sm text-dream-secondary text-center mb-2">مساحة إعلانية - Bottom Banner (728x90)</p>
            <div className="h-16 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded flex items-center justify-center">
              <span className="text-xs text-white/50">AdSense Bottom Banner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
