import { Suspense, lazy } from "react";
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

import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GlobalShortcuts } from "@/components/GlobalShortcuts";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageTransition } from "@/components/PageTransition";

// PWA Components
import { InstallPrompt } from "@/components/InstallPrompt";
import { useServiceWorker } from "@/hooks/useServiceWorker";

// Loading Skeleton for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm animate-pulse">Loading...</p>
    </div>
  </div>
);

// ============================================
// LAZY LOADED PAGES - Code Splitting
// ============================================

// Core pages (loaded immediately or with high priority)
const HomePage = lazy(() => import("./pages/HomePage"));
const Index = lazy(() => import("./pages/Index"));

// Auth pages (loaded on demand)
const StreamlinedAuthPage = lazy(() => import("./pages/StreamlinedAuthPage"));
const ProgressiveOnboarding = lazy(() => import("./pages/ProgressiveOnboarding"));

// Menu management pages
const MenusListPage = lazy(() => import("./pages/MenusListPage"));
const CreateMenuPage = lazy(() => import("./pages/CreateMenuPage"));

// Admin pages (heavy, load on demand)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const MasterAdminDashboard = lazy(() => import("./pages/MasterAdminDashboard"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PaymentApprovalsPage = lazy(() => import("./pages/PaymentApprovalsPage"));
const UserManagementPage = lazy(() => import("./pages/UserManagementPage"));

// Commerce pages
const PricingPage = lazy(() => import("./pages/PricingPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

// Debug/Test pages (rarely used)
const FeatureTestPage = lazy(() => import("./pages/FeatureTestPage"));
const DebugUser = lazy(() => import("./pages/DebugUser"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Query client with optimized cache settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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

                      {/* Suspense wrapper for lazy-loaded routes */}
                      <Suspense fallback={<PageLoader />}>
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
                      </Suspense>
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
