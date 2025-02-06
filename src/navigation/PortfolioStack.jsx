import { Routes, Route } from "react-router-dom";
import PortfolioLayout from "../layouts/PortfolioLayout";

// Pages
import Home from "../pages/_index";
import About from "../pages/portfolio/About";
import Pricing from "../pages/portfolio/Pricing";
import Blogs from "../pages/portfolio/blogs/Blogs";
import BlogDetails from "../pages/portfolio/blogs/BlogDetails";
import CreateBlog from "../pages/portfolio/blogs/CreateBlog";

const PortfolioStack = () => {
 return (
  <PortfolioLayout>
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/blogs" element={<Blogs />} />
    <Route path="/blogs/:id" element={<BlogDetails />} />
    <Route path="/blogs/create" element={<CreateBlog />} />
   </Routes>
  </PortfolioLayout>
 );
};

export default PortfolioStack;
