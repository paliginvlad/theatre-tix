import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { List, Grid2X2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getNews, NewsArticle } from "@/services/adminService";

const News = () => {
  const { language, t } = useLanguage();
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);

  useEffect(() => {
    getNews().then(setNewsList);
  }, []);

  const getTitle = (n: NewsArticle) => language === 'ua' ? n.title_ua : n.title_en;
  const getSummary = (n: NewsArticle) => language === 'ua' ? n.summary_ua : n.summary_en;
  const getContent = (n: NewsArticle) => language === 'ua' ? n.content_ua : n.content_en;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-gray-50 py-10">
        <div className="theatre-container">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-theatre-burgundy">{t("news.title")}</h1>
            
            <div className="flex items-center space-x-2 bg-white p-1 rounded-md shadow-sm">
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("list")}
                className={viewType === "list" ? "bg-theatre-burgundy text-white" : ""}
              >
                <List size={20} />
              </Button>
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewType("grid")}
                className={viewType === "grid" ? "bg-theatre-burgundy text-white" : ""}
              >
                <Grid2X2 size={20} />
              </Button>
            </div>
          </div>
          
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((news) => (
                <div key={news.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={news.image} 
                    alt={getTitle(news)} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2">{getTitle(news)}</h3>
                    <p className="text-sm text-gray-500 mb-3">{news.date}</p>
                    <p className="text-gray-600 mb-4">{getSummary(news)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {newsList.map((news) => (
                <div key={news.id} className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row">
                  <img 
                    src={news.image} 
                    alt={getTitle(news)} 
                    className="w-full md:w-1/3 h-48 md:h-auto object-cover" 
                  />
                  <div className="p-5 md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">{getTitle(news)}</h3>
                    <p className="text-sm text-gray-500 mb-3">{news.date}</p>
                    <p className="text-gray-600 mb-4">{getSummary(news)}</p>
                    <p className="text-gray-600 mb-4 line-clamp-3">{getContent(news)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default News;
