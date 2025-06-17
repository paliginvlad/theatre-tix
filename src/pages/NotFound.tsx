
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center px-4 py-16">
          <h1 className="text-6xl font-bold text-theatre-burgundy mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-8">Oops! Page not found</p>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We couldn't find the page you were looking for. Perhaps you were looking for one of our amazing performances?
          </p>
          <Link to="/">
            <Button className="bg-theatre-burgundy hover:bg-theatre-burgundy/90 text-white">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
