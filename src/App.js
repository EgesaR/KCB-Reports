import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PortfolioStack from "./navigation/PortfolioStack";
import AppStack from "./navigation/AppStack";
import AuthStack from "./navigation/AuthStack";
import WatchBoard from "./pages/blockers/WatchBoard";
// React Query Client
const queryClient = new QueryClient({
 defaultOptions: {
  queries: {
   suspense: true
  }
 }
});

const App = () => {
 return (
  <QueryClientProvider client={queryClient}>
   <Router>
    <Routes>
     {/* Portfolio Routes */}
     <Route path="/*" element={<PortfolioStack />} />

     {/* App Routes */}
     <Route path="/app/*" element={<AppStack />} />

     {/* Auth Routes */}
     <Route path="/auth/*" element={<AuthStack />} />

     <Route path="/blockers/watch" element={<WatchBoard />} />
    </Routes>
   </Router>
  </QueryClientProvider>
 );
};

export default App;
