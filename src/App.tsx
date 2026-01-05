import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MenuProvider } from "@/contexts/MenuContext";
import HomePage from "./pages/HomePage";
import MenusListPage from "./pages/MenusListPage";
import CreateMenuPage from "./pages/CreateMenuPage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MenuProvider>
            <Routes>
              {/* Multi-Menu System Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/menus" element={<MenusListPage />} />
              <Route path="/create-menu" element={<CreateMenuPage />} />

              {/* Single Menu Routes */}
              <Route path="/menu/:slug" element={<Index />} />
              <Route path="/edit-menu/:slug" element={<AdminDashboard />} />

              {/* Legacy/Admin Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/:slug" element={<AdminDashboard />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MenuProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
