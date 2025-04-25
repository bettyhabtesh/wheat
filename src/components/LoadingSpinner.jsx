// src/components/LoadingSpinner.jsx
import React from "react";
import "./LoadingSpinner.css"; // for styling

const LoadingSpinner = () => {
  return (
    <div className="dots-loader">
    <span></span>
    <span></span>
    <span></span>
  </div>
  );
};

export default LoadingSpinner;
