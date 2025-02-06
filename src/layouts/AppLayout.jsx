import { useState } from "react";
import { useLocation } from "react-router-dom"
import BottomNavigationBar from "../components/app/BottomNavigationBar";

const AppLayout = ({ children }) => {
  const location = useLocation()
 const [active, setActive] = useState(location.pathname);
 
 return (
  <div className="overflow-hidden h-screen w-full relative">
   {/*}<SettingScreen />*/}
   {children}
   <BottomNavigationBar active={active} setActive={setActive} />
  </div>
 );
};

export default AppLayout;
