import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import ReactMarkdown from "react-markdown";

interface DreamAnalysis {
  id: number;
  dreamText: string;
  analysis: string;
  createdAt: string;
}

export default function History() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: dreams, isLoading: dreamsLoading } = useQuery<DreamAnalysis[]>({
    queryKey: ["/api/dreams/history"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen dream-gradient flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-400 mb-4"></i>
          <p className="text-dream-text">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen dream-gradient flex items-center justify-center p-4">
        <Card className="dream-card max-w-md">
          <CardContent className="p-8 text-center">
            <i className="fas fa-lock text-5xl text-indigo-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-dream-text mb-4">
              تسجيل الدخول مطلوب
            </h2>
            <p className="text-dream-secondary mb-6">
              يجب تسجيل الدخول لمشاهدة سجل أحلامك السابقة
            </p>
            <Button
              onClick={() => setLocation("/auth")}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <i className="fas fa-sign-in-alt ml-2"></i>
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen dream-gradient">
      {/* AdSense Ad Space - Top Banner */}
      <div className="w-full bg-gray-800/20 py-4 mb-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <p className="text-sm text-dream-secondary">مساحة إعلانية - Top Banner (728x90)</p>
            <div className="h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded flex items-center justify-center">
              <span className="text-xs text-white/50">AdSense Banner Space</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-8">
          <i className="fas fa-history text-5xl text-indigo-400 mb-4"></i>
          <h1 className="text-4xl font-bold text-dream-text mb-2">
            سجل أحلامك السابقة
          </h1>
          <p className="text-dream-secondary">
            مرحباً {user?.name}، هنا يمكنك مراجعة جميع تحليلات أحلامك السابقة
          </p>
        </div>

        {/* AdSense Ad Space - Medium Rectangle */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <p className="text-sm text-dream-secondary text-center mb-2">مساحة إعلانية - Medium Rectangle (300x250)</p>
            <div className="w-72 h-48 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded flex items-center justify-center">
              <span className="text-xs text-white/50">AdSense Medium Rectangle</span>
            </div>
          </div>
        </div>

        {dreamsLoading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-3xl text-indigo-400 mb-4"></i>
            <p className="text-dream-text">جارٍ تحميل سجل الأحلام...</p>
          </div>
        ) : dreams && dreams.length > 0 ? (
          <div className="space-y-6">
            {dreams.map((dream, index) => (
              <Card key={dream.id} className="dream-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-moon text-indigo-400 ml-3"></i>
                      <span className="text-lg font-semibold text-dream-text">
                        حلم رقم {dreams.length - index}
                      </span>
                    </div>
                    <span className="text-sm text-dream-secondary">
                      {new Date(dream.createdAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-dream-text mb-2 flex items-center">
                      <i className="fas fa-bed text-purple-400 ml-2"></i>
                      نص الحلم:
                    </h3>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <p className="text-dream-text leading-relaxed">
                        {dream.dreamText}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-dream-text mb-2 flex items-center">
                      <i className="fas fa-brain text-pink-400 ml-2"></i>
                      التحليل:
                    </h3>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="text-dream-text leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown>{dream.analysis}</ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {/* AdSense Ad Space - Small Rectangle after every 2 dreams */}
                  {(index + 1) % 2 === 0 && (
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-dream-secondary text-center mb-2">مساحة إعلانية - Small Rectangle (250x250)</p>
                        <div className="w-60 h-48 mx-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded flex items-center justify-center">
                          <span className="text-xs text-white/50">AdSense Small Rectangle</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="dream-card">
            <CardContent className="p-8 text-center">
              <i className="fas fa-moon text-6xl text-indigo-400 mb-6 opacity-50"></i>
              <h3 className="text-2xl font-semibold text-dream-text mb-4">
                لا توجد أحلام محللة بعد
              </h3>
              <p className="text-dream-secondary mb-6">
                لم تقم بتحليل أي أحلام حتى الآن. ابدأ الآن بتحليل حلمك الأول!
              </p>
              <Button
                onClick={() => setLocation("/")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <i className="fas fa-plus ml-2"></i>
                ابدأ تحليل حلم جديد
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AdSense Ad Space - Bottom Banner */}
        <div className="mt-8 pt-8">
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