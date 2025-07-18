import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast-provider";
import Home from "@/pages/home";
import About from "@/pages/about";
import Auth from "@/pages/auth";
import History from "@/pages/history";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="pt-20 pb-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/auth" component={Auth} />
          <Route path="/history" component={History} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <Toaster />
          <Router />
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
