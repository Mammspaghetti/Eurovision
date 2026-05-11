import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";

import ResetPasswordLinkPage from "./pages/ResetPassword/ResetPasswordLinkPage";
import LoginPage from "./pages/LoginPage";
import VotePage from "./pages/VotePage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <AppProvider> {/* 👈 OBLIGATOIRE */}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/vote" element={<VotePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/mot-de-passe-oublie" element={<ResetPasswordLinkPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
