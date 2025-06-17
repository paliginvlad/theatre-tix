
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const History = () => {
  const { language, t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-gray-50 py-10">
        <div className="theatre-container">
          <h1 className="text-3xl md:text-4xl font-bold text-theatre-burgundy mb-6">{t("history.title")}</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl mb-6">
              {t("history.intro")}
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">{t("history.section1.title")}</h2>
              <p>
              {t("history.section1.text")}
              </p>
              
              <div className="my-8">
                <img 
                  src="https://img.1kr.ua/history/fd7746b4/b69d9c92/1_669x918_123208_1b8f69dd746ecc69720ecb69caa6b773b61c1f208a44ce0498644fcbf7f6e3491629982420.jpg" 
                  alt="Historic TheatreTix building circa 1930" 
                  className="w-full rounded-lg shadow-md"
                />
                <p className="text-sm text-gray-500 mt-2 text-center"> {t("history.section1.caption")}</p>
              </div>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">{t("history.section2.title")}</h2>
              <p>
              {t("history.section2.text")}
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">{t("history.section3.title")}</h2>
              <p>
              {t("history.section3.text")}
              </p>
              
              <div className="my-8">
                <img 
                  src="https://opera.com.ua/sites/default/files/pano8205-8234sph-ed1.jpg" 
                  alt="TheatreTix main stage after 2015 renovation" 
                  className="w-full rounded-lg shadow-md"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">{t("history.section3.caption")}</p>
              </div>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">{t("history.section4.title")}</h2>
              <p>
               {t("history.section4.text")}
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>{t("history.section4.point1")}</li>
                <li>{t("history.section4.point2")}</li>
                <li>{t("history.section4.point3")}</li>
                <li>{t("history.section4.point4")}</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">{t("history.section5.title")}</h2>
              <p>
              {t("history.section5.text")}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default History;
