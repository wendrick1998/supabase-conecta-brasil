
import { Navigate, useParams } from "react-router-dom";
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
import AutomacoesPage from "./pages/AutomacoesPage";
import AutomacaoEditorPage from "./pages/AutomacaoEditorPage";
import PulsePage from "./pages/PulsePage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ConversationList from "./components/conversations/ConversationList";
import ConversationDetail from "./components/conversations/ConversationDetail";
import NewConversation from "./components/conversations/NewConversation";
import InboxPage from "./pages/InboxPage";
import ChannelManagementPage from "./pages/ChannelManagementPage";

// Create a redirect component to handle the inbox to conversations redirect
const InboxToConversationRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/conversations/${id}`} replace />;
};

// Define the application routes
export const appRoutes = [
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/auth",
    element: <AuthPage />
  },
  
  // Protected routes with Dashboard layout
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <Index /> },
          { path: "leads", element: <LeadsPage /> },
          { path: "leads/novo", element: <NewLeadPage /> },
          { path: "leads/:id/editar", element: <EditLeadPage /> },
          { path: "leads/:id", element: <LeadDetailPage /> },
          { path: "pipeline", element: <PipelinePage /> },
          { path: "pipeline/configuracao", element: <PipelineConfigPage /> },
          { path: "automacoes", element: <AutomacoesPage /> },
          { path: "automacoes/nova", element: <AutomacaoEditorPage /> },
          { path: "automacoes/:id/editar", element: <AutomacaoEditorPage /> },
          { path: "pulse", element: <PulsePage /> },
          
          // New multicanal inbox
          { path: "inbox", element: <InboxPage /> },
          
          // Channel management
          { path: "channels", element: <ChannelManagementPage /> },
          
          // Original conversation routes
          { path: "conversations", element: <ConversationList /> },
          { path: "conversations/new", element: <NewConversation /> },
          { path: "conversations/:id", element: <ConversationDetail /> },
          
          // Redirect for backward compatibility - inbox → conversations
          { path: "inbox/:id", element: <InboxToConversationRedirect /> }
        ]
      }
    ]
  },
  
  {
    path: "*",
    element: <NotFound />
  }
];
