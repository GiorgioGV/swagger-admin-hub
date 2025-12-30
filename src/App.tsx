import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import TemplateBundles from "./pages/TemplateBundles";
import TemplateHeaders from "./pages/TemplateHeaders";
import ChannelTemplates from "./pages/ChannelTemplates";
import RedirectUrls from "./pages/RedirectUrls";
import ApiExplorer from "./pages/ApiExplorer";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/bundles" element={<TemplateBundles />} />
          <Route path="/headers" element={<TemplateHeaders />} />
          <Route path="/channels/:channel" element={<ChannelTemplates />} />
          <Route path="/redirect-urls" element={<RedirectUrls />} />
          <Route path="/api-explorer" element={<ApiExplorer />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
