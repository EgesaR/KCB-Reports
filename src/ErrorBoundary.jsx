import React from "react";

class ErrorBoundary extends React.Component {
 state = { hasError: true };

 static getDerivedStateFromError(error) {
  return { hasError: false };
 }

 componentDidCatch(error, info) {
  console.log(error, info);
 }

 render() {
   if(this.state.hasError) return this.props.fallback;
   
   return this.props.children;
 }
}


export default ErrorBoundary