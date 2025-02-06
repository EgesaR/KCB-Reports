//import { NavLink } from "react-router"
import { IoMenu } from "react-icons/io5";
import Button from "./Button";

/*const Link = ({children, to}) => {
  return(
    <NavLink to={to} style={
      ({ isActive, isPending, isTranstioning }) => {
        return{
          fontWeight: isActive ? "bold" : "",
          color: isPending ? "red" :  "black",
          viewTransitionName: isTranstioning ? "slide": ""
        }
      }
    }>
      {children}
    </NavLink>
  );
}
*/
const Navbar = ({ open, setOpen }) => {
 return (
  <nav className="h-16 w-full flex items-center px-2 fixed top-0 left-0 backdrop-blur-sm z-40 bg-white/50 dark:bg-black/50">
   <h1 className="font-medium text-2xl text-green-600/80 dark:text-green-300/90">
    KCB Reports
   </h1>
   <div className="flex ml-auto">
    {open ? null : (
     <Button
      className="rounded-full text-green-600 text-base font-semibold h-10 w-10 grid place-items-center dark:text-green-300"
      onClick={() => setOpen(true)}
     >
      <IoMenu size={26} />
     </Button>
    )}
   </div>
  </nav>
 );
};

export default Navbar;
