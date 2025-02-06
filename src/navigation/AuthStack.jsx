import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Login from "../pages/_auth/login/route";
//import Signup from "../pages/_auth/signup/route";


const AuthStack = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<div>Hello </div>} />
        <Route path="/login" element={<Login />} />
        {/*<Route path="/signup" element={<Signup />} />*/}
      </Routes>
    </>
  );
};

export default AuthStack;
