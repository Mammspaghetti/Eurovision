import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter,  Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";

import AdminResults from "./pages/AdminResults";
import LoginPage from "./pages/LoginPage";
import VotePage from "./pages/VotePage";
import NotFound from "./pages/NotFound";
import ResultsPage from "./pages/ResultsPage";
import Register from "./pages/CreateAcountPage";

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
            <Route path="/register" element={<Register />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
