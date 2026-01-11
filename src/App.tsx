import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { GuestModeProvider } from "@/contexts/GuestModeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import HomePage from "./pages/HomePage";
import MenusListPage from "./pages/MenusListPage";
import CreateMenuPage from "./pages/CreateMenuPage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthPage from "./pages/AuthPage";
import ImprovedAuthPage from "./pages/ImprovedAuthPage";
import StreamlinedAuthPage from "./pages/StreamlinedAuthPage";
import ProgressiveOnboarding from "./pages/ProgressiveOnboarding";
import PricingPage from "./pages/PricingPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentApprovalsPage from "./pages/PaymentApprovalsPage";
import UserManagementPage from "./pages/UserManagementPage";
import AdminDashboard from "./pages/AdminDashboard";
import MasterAdminDashboard from "./pages/MasterAdminDashboard";
import SettingsPage from "./pages/SettingsPage";
import FeatureTestPage from "./pages/FeatureTestPage";
import DebugUser from "./pages/DebugUser";
import NotFound from "./pages/NotFound";

import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GlobalShortcuts } from "@/components/GlobalShortcuts";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageTransition } from "@/components/PageTransition";

// PWA Components
import { InstallPrompt } from "@/components/InstallPrompt";
import { useServiceWorker } from "@/hooks/useServiceWorker";

const queryClient = new QueryClient();

const App = () => {
  // Register service worker
  useServiceWorker();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CustomCursor />
          <ParticleBackground />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <SubscriptionProvider>
                <LanguageProvider>
                  <GuestModeProvider>
                    <MenuProvider>
                      <GlobalShortcuts />

                      {/* PWA Install Prompt */}
                      <InstallPrompt />

                      <Routes>
                        {/* Multi-Menu System Routes */}
                        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                        <Route path="/menus" element={<PageTransition><MenusListPage /></PageTransition>} />
                        <Route path="/create-menu" element={<CreateMenuPage />} />

                        {/* Single Menu Routes */}
                        <Route path="/menu/:slug" element={<PageTransition><Index /></PageTransition>} />
                        <Route path="/edit-menu/:slug" element={<AdminDashboard />} />

                        {/* Auth Routes - Using Streamlined Auth Page with Social Login */}
                        <Route path="/auth" element={<StreamlinedAuthPage />} />
                        <Route path="/login" element={<StreamlinedAuthPage />} />
                        <Route path="/signup" element={<StreamlinedAuthPage />} />
                        <Route path="/onboarding" element={<ProgressiveOnboarding />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/:slug" element={<PageTransition><AdminDashboard /></PageTransition>} />
                        <Route path="/admin/payments" element={<PaymentApprovalsPage />} />
                        <Route path="/admin/users" element={<UserManagementPage />} />
                        <Route path="/platform-admin/*" element={<MasterAdminDashboard />} />
                        <Route path="/settings" element={<SettingsPage />} />

                        {/* Test Route */}
                        <Route path="/test-features" element={<FeatureTestPage />} />
                        <Route path="/debug-user" element={<DebugUser />} />

                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </MenuProvider>
                  </GuestModeProvider>
                </LanguageProvider>
              </SubscriptionProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
