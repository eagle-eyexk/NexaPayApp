import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Nodes from "@/pages/Nodes";

import PublicLayout from "@/components/layout/PublicLayout";
import AppLayout from "@/components/layout/AppLayout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/app" component={() => <AppLayout><Dashboard /></AppLayout>} />
      <Route path="/app/transactions" component={() => <AppLayout><Transactions /></AppLayout>} />
      <Route path="/app/nodes" component={() => <AppLayout><Nodes /></AppLayout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
