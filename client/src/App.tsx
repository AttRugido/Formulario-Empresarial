import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Element } from "@/pages/Element";
import { DarkForm } from "@/pages/DarkForm";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import ThankYou from "@/pages/ThankYou";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={Element} />
      <Route path="/form-v2" component={DarkForm} />
      <Route path="/obrigado" component={ThankYou} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
