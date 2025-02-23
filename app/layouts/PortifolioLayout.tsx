import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export default function PortifolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
