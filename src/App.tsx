
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Explore from "@/pages/Explore";
import PhotoSubmission from "@/pages/PhotoSubmission";
import ContestDetail from "@/pages/ContestDetail";
import Profile from "@/pages/Profile";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import AdminDashboard from "@/pages/AdminDashboard";
import Upgrade from "@/pages/Upgrade";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/submit" element={<PhotoSubmission />} />
              <Route path="/contests/:id" element={<ContestDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/upgrade" element={<Upgrade />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
