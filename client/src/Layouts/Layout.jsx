import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] w-full mt-16">
        <Outlet />
      </main>
      <ScrollToTopButton />
      <Footer />
    </>
  );
}

export default Layout;