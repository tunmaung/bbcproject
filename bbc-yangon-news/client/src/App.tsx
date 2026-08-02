import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { GeolocationGate } from "./components/GeolocationGate";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GeolocationProvider } from "./contexts/GeolocationContext";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/article/:id"} component={ArticlePage} />
      <Route path={"/category/:slug"} component={CategoryPage} />
      <Route path={"/admin"} component={AdminDashboard} />
<Route path={"/login"} component={Login} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
<GeolocationProvider>
  <GeolocationGate>
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  </GeolocationGate>
</GeolocationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
