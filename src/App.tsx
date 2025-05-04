
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import LeadsPage from "./pages/LeadsPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import NewLeadPage from "./pages/NewLeadPage";
import EditLeadPage from "./pages/EditLeadPage";
import PipelinePage from "./pages/PipelinePage";
import PipelineConfigPage from "./pages/PipelineConfigPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ConversationList from "./components/conversations/ConversationList";
import ConversationDetail from "./components/conversations/ConversationDetail";
import NewConversation from "./components/conversations/NewConversation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected routes with Dashboard layout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="dashboard" element={<Index />} />
                  <Route path="leads" element={<LeadsPage />} />
                  <Route path="leads/novo" element={<NewLeadPage />} />
                  <Route path="leads/:id/editar" element={<EditLeadPage />} />
                  <Route path="leads/:id" element={<LeadDetailPage />} />
                  <Route path="pipeline" element={<PipelinePage />} />
                  <Route path="pipeline/configuracao" element={<PipelineConfigPage />} />
                  
                  {/* Conversation routes */}
                  <Route path="conversations" element={<ConversationList />} />
                  <Route path="conversations/new" element={<NewConversation />} />
                  <Route path="conversations/:id" element={<ConversationDetail />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
