import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";

// Lazy load screens
const HomeScreen = React.lazy(() => import("../pages/app/screens/HomeScreen"));
const ReportsScreen = React.lazy(() => import("../screens/ReportsScreen"));

const StackNavigator = () => {
  return (
    <Router>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/reports" element={<ReportsScreen />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </Router>
  );
};

export default StackNavigator;
