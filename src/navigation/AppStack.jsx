import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

// Pages
import HomeTab from "../pages/app/HomeTab";
import ReportTab from "../pages/app/ReportTab"

const AppStack = () => {
 return (
  <AppLayout>
   {/*<Dashboard />*/}
   <Routes>
    <Route path="/" element={<HomeTab />} />
    <Route path="/reports" element={<ReportTab />} />
   </Routes>
  </AppLayout>
 );
};

export default AppStack;
