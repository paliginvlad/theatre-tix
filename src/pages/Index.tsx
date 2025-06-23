
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PerformanceCard from "@/components/PerformanceCard";
import { getUpcomingPerformances } from "@/services/performanceService";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {

  const { language, t } = useLanguage();
  const upcomingPerformances = getUpcomingPerformances();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0 bg-theatre-black">
          <img
            src="/site_photos/theatre_stage.png"
            alt="Theatre stage"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        <div className="relative h-full theatre-container flex flex-col justify-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-3xl animate-fade-in">
          {t("home.hero.title")}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-xl">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/schedule">
              <Button className="bg-theatre-burgundy text-white hover:bg-theatre-burgundy/90 px-8 py-6 text-lg">
              {t("home.button.schedule")}
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-theatre-burgundy text-white hover:bg-theatre-burgundy/90 px-8 py-6 text-lg">
              {t("home.button.signin")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Performances */}
      <section className="py-16 bg-white">
        <div className="theatre-container">
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-theatre-black mb-2">{t("home.upcoming.title")}</h2>
              <p className="text-gray-600">{t("home.upcoming.subtitle")}</p>
            </div>
            
            <Link to="/schedule" className="mt-4 md:mt-0">
              <Button variant="outline" className="border-theatre-burgundy text-theatre-burgundy hover:bg-theatre-burgundy hover:text-white">
              {t("home.upcoming.button")}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingPerformances.slice(0, 3).map((performance) => (
              <PerformanceCard key={performance.id} performance={performance} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Theater Experience */}
      <section className="py-16 bg-gray-50">
        <div className="theatre-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-theatre-black mb-6">{t("home.whyus.title")}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mt-1 bg-theatre-burgundy text-white p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 13 4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t("home.whyus.feature1.title")}</h3>
                    <p className="text-gray-600">{t("home.whyus.feature1.text")}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-theatre-burgundy text-white p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 13 4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t("home.whyus.feature2.title")}</h3>
                    <p className="text-gray-600">{t("home.whyus.feature2.text")}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-theatre-burgundy text-white p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 13 4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t("home.whyus.feature3.title")}</h3>
                    <p className="text-gray-600">{t("home.whyus.feature3.text")}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/register">
                  <Button className="bg-theatre-burgundy text-white hover:bg-theatre-burgundy/90">
                  {t("home.whyus.button")}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:ml-auto">
              <img 
                src="/site_photos/theatre_build.png" 
                alt="Theater audience" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="theatre-container">
          <h2 className="text-3xl md:text-4xl font-bold text-theatre-black mb-12 text-center">{t("home.testimonials.title")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="text-theatre-gold mb-4">
                <span>★★★★★</span>
              </div>
              <p className="mb-4 italic">{t("home.testimonials.review1.text")}</p>
              <div>
                <p className="font-bold">{t("home.testimonials.review1.name")}</p>
                <p className="text-gray-600 text-sm">{t("home.testimonials.review1.role")}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="text-theatre-gold mb-4">
                <span>★★★★★</span>
              </div>
              <p className="mb-4 italic">{t("home.testimonials.review2.text")}</p>
              <div>
                <p className="font-bold">{t("home.testimonials.review2.name")}</p>
                <p className="text-gray-600 text-sm">{t("home.testimonials.review2.role")}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="text-theatre-gold mb-4">
                <span>★★★★☆</span>
              </div>
              <p className="mb-4 italic">{t("home.testimonials.review3.text")}</p>
              <div>
                <p className="font-bold">{t("home.testimonials.review3.name")}</p>
                <p className="text-gray-600 text-sm">{t("home.testimonials.review3.role")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
     
      {/* <section className="py-16 bg-theatre-burgundy text-white">
        <div className="theatre-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("home.newsletter.title")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
          {t("home.newsletter.text")}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-md flex-1 text-black"
            />
            <Button className="bg-theatre-gold text-theatre-black hover:bg-theatre-gold/90">
            {t("home.newsletter.button")}
            </Button>
          </div>
        </div>
      </section> */}
      
      <Footer />
    </div>
  );
};

export default Index;
