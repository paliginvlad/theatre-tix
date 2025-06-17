
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const About = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Redirect to history page by default
  useEffect(() => {
    navigate("/about/history");
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50 py-10">
        <div className="theatre-container text-center">
          <p>{t("about.redirecting")}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
