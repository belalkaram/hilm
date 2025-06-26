import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const dreamSchema = z.object({
  dreamText: z.string().min(10, "يرجى كتابة حلمك بتفصيل أكثر (على الأقل 10 كلمات)"),
});

interface DreamAnalysis {
  id: number;
  dreamText: string;
  analysis: string;
  createdAt: string;
}

interface AnalysisResponse {
  analysis: DreamAnalysis;
  remainingUsage: number;
}

interface UsageData {
  currentUsage: number;
  maxUsage: number;
  remainingUsage: number;
  isLoggedIn: boolean;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [analysisResult, setAnalysisResult] = useState<DreamAnalysis | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof dreamSchema>>({
    resolver: zodResolver(dreamSchema),
    defaultValues: {
      dreamText: "",
    },
  });

  const { data: usageData, refetch: refetchUsage } = useQuery<UsageData>({
    queryKey: ["/api/dreams/usage"],
    retry: false,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: { dreamText: string }) => {
      const response = await apiRequest("POST", "/api/dreams/analyze", data);
      return response.json() as Promise<AnalysisResponse>;
    },
    onSuccess: (data) => {
      setAnalysisResult(data.analysis);
      refetchUsage();
      form.reset();
      toast({
        title: "تم تحليل حلمك بنجاح!",
        description: "تم تفسير حلمك بواسطة الذكاء الاصطناعي",
      });
      
      // Scroll to result
      setTimeout(() => {
        document.getElementById("analysis-result")?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }, 100);
    },
    onError: (error: Error) => {
      const message = error.message;
      if (message.includes("يرجى التسجيل")) {
        toast({
          title: "تسجيل الدخول مطلوب",
          description: "يرجى التسجيل أو تسجيل الدخول لتحليل المزيد من الأحلام",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/auth");
        }, 1500);
      } else {
        toast({
          title: "خطأ في التحليل",
          description: message,
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof dreamSchema>) => {
    analyzeMutation.mutate(data);
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const dreamText = form.watch("dreamText");
  const wordCount = getWordCount(dreamText);

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

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-dream-text">
          اكتب حلمك وسنقوم بتحليله
          <span className="block text-indigo-400">بالذكاء الاصطناعي</span>
        </h1>
        <p className="text-lg text-dream-secondary max-w-2xl mx-auto">
          استخدم تقنيات الذكاء الاصطناعي المتقدمة لتفسير أحلامك واكتشاف معانيها الخفية
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

      {/* Dream Input Form */}
      <Card className="dream-card mb-8">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="dreamText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-dream-text flex items-center">
                      <i className="fas fa-feather ml-2 text-indigo-400"></i>
                      اكتب حلمك هنا
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="مثال: رأيت أني أطير في السماء الزرقاء، وكانت هناك طيور بيضاء تحلق معي..."
                        className="min-h-[150px] bg-white/20 border-white/30 focus:border-indigo-400 text-dream-text placeholder:text-dream-secondary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center text-sm text-dream-secondary">
                      <span>الحد الأدنى: 10 كلمات</span>
                      <span>{wordCount} كلمة</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={analyzeMutation.isPending}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner loading-spinner ml-2"></i>
                    جارٍ التحليل...
                  </>
                ) : (
                  <>
                    <i className="fas fa-brain ml-2"></i>
                    حلل حلمي
                  </>
                )}
              </Button>
            </form>
          </Form>
          
          {/* Usage Counter */}
          <div className="mt-4 text-center">
            <span className="text-sm text-dream-secondary">
              المتبقي: <span className="font-semibold">{usageData?.remainingUsage || 0}</span> تحليل
            </span>
          </div>
        </CardContent>
      </Card>

      {/* AdSense Ad Space - Before Analysis */}
      <div className="mb-8 flex justify-center">
        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
          <p className="text-sm text-dream-secondary text-center mb-2">مساحة إعلانية - Square (250x250)</p>
          <div className="w-60 h-60 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded flex items-center justify-center">
            <span className="text-xs text-white/50">AdSense Square</span>
          </div>
        </div>
      </div>

      {/* Analysis Result */}
      {analysisResult && (
        <Card id="analysis-result" className="dream-card fade-in">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-dream-text">
              <i className="fas fa-magic text-indigo-400 ml-2"></i>
              تفسير الحلم
            </h3>
            <div className="text-lg leading-relaxed text-dream-text prose prose-invert prose-lg max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 className="text-2xl font-bold text-indigo-400 mb-4 mt-6">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-bold text-indigo-300 mb-3 mt-5">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-bold text-dream-text mb-2 mt-4">{children}</h3>,
                  strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                  p: ({children}) => <p className="mb-4 text-dream-text leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2 text-dream-text">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-dream-text">{children}</ol>,
                  li: ({children}) => <li className="text-dream-text">{children}</li>,
                }}
              >
                {analysisResult.analysis}
              </ReactMarkdown>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-sm text-dream-secondary text-center">
                <i className="fas fa-info-circle ml-1"></i>
                هذا التفسير مبني على الذكاء الاصطناعي وهو للتسلية فقط
              </p>
            </div>
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
  );
}
