import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";

import ResetPasswordPage from "./pages/ResetPassword/ResetPasswordPage";
import LoginPage from "./pages/LoginPage";
import VotePage from "./pages/VotePage";
import NotFound from "./pages/NotFound";
import ResultsPage from "./pages/ResultsPage";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <AppProvider> {/* 👈 OBLIGATOIRE */}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/vote" element={<VotePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/mot-de-passe-oublie" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
