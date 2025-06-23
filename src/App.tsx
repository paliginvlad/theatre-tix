import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import PerformanceDetail from "./pages/PerformanceDetail";
import Tickets from "./pages/Tickets";
import NotFound from "./pages/NotFound";
import Team from "./pages/Team";
import News from "./pages/News";
import Search from "./pages/Search";
import About from "./pages/about/About";
import History from "./pages/about/History";
import Rules from "./pages/about/Rules";
import Disabled from "./pages/about/Disabled";
import Privileged from "./pages/about/Privileged";
import Contacts from "./pages/about/Contacts";
import Admin from "./pages/admin/Admin";
import AdminPerformances from "./pages/admin/Performances";
import AdminTickets from "./pages/admin/Tickets";
import AdminReports from "./pages/admin/Reports";
import AdminSalaries from "./pages/admin/Salaries";
import AdminNews from "./pages/admin/News";
import Profit from "./pages/admin/Profit";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import TermsOfService from "./pages/policies/TermsOfService";
import RefundPolicy from "./pages/policies/RefundPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/performance/:id" element={<PerformanceDetail />} />
              <Route path="/tickets/:id" element={<Tickets />} />
              <Route path="/team" element={<Team />} />
              <Route path="/news" element={<News />} />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="/about/history" element={<History />} />
              <Route path="/about/rules" element={<Rules />} />
              <Route path="/about/disabled" element={<Disabled />} />
              <Route path="/about/privileged" element={<Privileged />} />
              <Route path="/about/contacts" element={<Contacts />} />
              {/* Policy pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              {/* Admin routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/performances" element={<AdminPerformances />} />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/salaries" element={<AdminSalaries />} />
              <Route path="/admin/news" element={<AdminNews />} />
              <Route path="/admin/profit" element={<Profit />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
