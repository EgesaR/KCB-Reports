import React from "react";
import { Oval } from "react-loader-spinner";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <Oval height={50} width={50} color="#4f46e5" />
  </div>
);

export default LoadingSpinner;