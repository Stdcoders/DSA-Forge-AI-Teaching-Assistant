import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import CurriculumPage from "@/pages/CurriculumPage";
import TheoryPage from "@/pages/TheoryPage";
import TheoryLevelPage from "@/pages/TheoryLevelPage";
import CodeEditorPage from "@/pages/CodeEditorPage";
import PracticePage from "@/pages/PracticePage";
import ProgressPage from "@/pages/ProgressPage";
import AssessmentPage from "@/pages/AssessmentPage";
import AssessmentSessionPage from "@/pages/AssessmentSessionPage";
import SolutionPage from "@/pages/SolutionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/curriculum" element={<CurriculumPage />} />
              <Route path="/curriculum/:topicId" element={<TheoryPage />} />
              <Route path="/curriculum/:topicId/:level" element={<TheoryLevelPage />} />
              <Route path="/editor" element={<CodeEditorPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/assessment/:topicId" element={<AssessmentSessionPage />} />
              <Route path="/solution/:topicId/:problemId" element={<SolutionPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
