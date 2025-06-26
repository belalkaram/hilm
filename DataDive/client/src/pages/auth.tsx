import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

const registerSchema = z.object({
  name: z.string().min(1, "يرجى إدخال الاسم"),
  email: z.string().min(1, "يرجى إدخال البريد الإلكتروني").email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dreams/usage"] });
      toast({
        title: `مرحباً ${data.user.name}!`,
        description: "تم تسجيل الدخول بنجاح",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      console.log("Sending registration data:", data);
      const response = await apiRequest("POST", "/api/auth/register", data);
      const result = await response.json();
      console.log("Registration response:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dreams/usage"] });
      toast({
        title: `مرحباً ${data.user.name}!`,
        description: "تم إنشاء حسابك بنجاح",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    console.log("Form data:", data);
    console.log("Form errors:", registerForm.formState.errors);
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dream-gradient">
      {isLogin ? (
        <Card className="dream-card">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-8">
              <i className="fas fa-sign-in-alt text-5xl text-indigo-400 mb-4"></i>
              <h2 className="text-3xl font-bold text-dream-text">
                تسجيل الدخول
              </h2>
              <p className="text-dream-secondary mt-2">
                أدخل بياناتك للوصول إلى حسابك
              </p>
            </div>

            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-6"
            >
              <div>
                <label className="text-sm font-semibold text-dream-text block mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  className="bg-white/20 border-white/30 focus:border-indigo-400 text-dream-text placeholder:text-dream-secondary"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-dream-text block mb-2">
                  كلمة المرور
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/20 border-white/30 focus:border-indigo-400 text-dream-text placeholder:text-dream-secondary"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {loginMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner loading-spinner ml-2"></i>
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt ml-2"></i>
                    تسجيل الدخول
                  </>
                )}
              </Button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => setIsLogin(false)}
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                ليس لديك حساب؟ سجّل الآن
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="dream-card">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-8">
              <i className="fas fa-user-plus text-5xl text-indigo-400 mb-4"></i>
              <h2 className="text-3xl font-bold text-dream-text">
                إنشاء حساب جديد
              </h2>
              <p className="text-dream-secondary mt-2">
                انضم إلينا لتحليل أحلامك
              </p>
            </div>

            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-6"
            >
              <div>
                <label className="text-sm font-semibold text-dream-text block mb-2">
                  الاسم
                </label>
                <Input
                  type="text"
                  placeholder="الاسم الكامل"
                  className="bg-white/20 border-white/30 focus:border-indigo-400 text-dream-text placeholder:text-dream-secondary"
                  {...registerForm.register("name")}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-dream-text block mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  className="bg-white/20 border-white/30 focus:border-indigo-400 text-dream-text placeholder:text-dream-secondary"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-dream-text block mb-2">
                  كلمة المرور
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/20 border-white/30 focus:border-indigo-400 text-dream-text placeholder:text-dream-secondary"
                  {...registerForm.register("password")}
                />
                <p className="text-xs text-dream-secondary mt-1">
                  على الأقل 6 أحرف
                </p>
                {registerForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                onClick={() => {
                  console.log("Register button clicked");
                  console.log("Form valid:", registerForm.formState.isValid);
                  console.log("Form errors:", registerForm.formState.errors);
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {registerMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner loading-spinner ml-2"></i>
                    جارٍ إنشاء الحساب...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus ml-2"></i>
                    إنشاء حساب
                  </>
                )}
              </Button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => setIsLogin(true)}
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                لديك حساب بالفعل؟ سجّل الدخول
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}