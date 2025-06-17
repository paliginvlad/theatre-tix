import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getFuturePerformances, Performance } from "@/services/performanceService";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";

const Schedule = () => {
  const allPerformances = getFuturePerformances();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const { language, t } = useLanguage();
  
  // Get unique months from performances
  const getUniqueMonths = () => {
    const months: Record<string, string> = {};
    
    allPerformances.forEach(performance => {
      const date = new Date(performance.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Use appropriate locale based on the selected language
      const locale = language === "en" ? "en-US" : "uk-UA";
      const monthName = date.toLocaleString(locale, { month: 'long', year: 'numeric' });
      months[monthYear] = monthName;
    });
    
    return Object.entries(months).map(([value, label]) => ({ value, label }));
  };
  
  const uniqueMonths = getUniqueMonths();
  
  // Filter performances by selected month
  const filteredPerformances = selectedMonth === "all" 
    ? allPerformances 
    : allPerformances.filter(performance => {
        const date = new Date(performance.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return monthYear === selectedMonth;
      });
  
  // Group performances by date
  const groupedPerformances: Record<string, Performance[]> = {};
  filteredPerformances.forEach(performance => {
    if (!groupedPerformances[performance.date]) {
      groupedPerformances[performance.date] = [];
    }
    groupedPerformances[performance.date].push(performance);
  });
  
  // Sort dates
  const sortedDates = Object.keys(groupedPerformances).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );
  
  // Format date for display based on current language
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const date = new Date(dateString);

    // Use appropriate locale based on the selected language
    if (language === "en") {
      return date.toLocaleDateString("en-US", options);
    } else {
      // For Ukrainian, we need to convert from genitive to nominative case for weekdays
      const formattedDate = date.toLocaleDateString("uk-UA", options);
      
      return formattedDate.replace(
        /(неділю|понеділок|вівторок|середу|четвер|п'ятницю|суботу)/i, 
        (match) => {
          const weekdayMap: {[key: string]: string} = {
            'неділю': 'Неділя',
            'понеділок': 'Понеділок',
            'вівторок': 'Вівторок', 
            'середу': 'Середа',
            'четвер': 'Четвер',
            'п\'ятницю': 'П\'ятниця',
            'суботу': 'Субота'
          };
          return weekdayMap[match.toLowerCase()] || match;
        }
      );
    }
  };

  // Translate performance name based on language
  const getTranslatedPerformanceName = (name: string): string => {
    if (language !== "ua") return name;
    
    switch (name) {
      case "Hamlet":
        return "Гамлет";
      case "Romeo and Juliet":
        return "Ромео і Джульєтта";
      case "Macbeth":
        return "Макбет";
      case "The Tempest":
        return "Буря";
      case "A Midsummer Night's Dream":
        return "Сон літньої ночі";
      default:
        return name;
    }
  };

  // Translate director name based on language for consistency
  const getTranslatedDirector = (director: string): string => {
    // Since we're not provided with actual Ukrainian translations for directors,
    // this is just a placeholder. In a real application, you would have a mapping
    // or use a translation service.
    // For now, we'll keep the English names as they are likely to be proper names
    return director;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-theatre-burgundy text-white py-16">
          <div className="theatre-container">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("schedule.title")}</h1>
                <p className="text-xl opacity-90">{t("schedule.subtitle")}</p>
              </div>
              <Calendar size={64} className="hidden md:block text-theatre-gold mt-4 md:mt-0" />
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="theatre-container">
            {/* Month filter tabs */}
            <Tabs defaultValue="all" value={selectedMonth} onValueChange={setSelectedMonth} className="mb-8">
              <TabsList className="flex overflow-x-auto pb-2 scrollbar-hide">
                <TabsTrigger value="all" className="min-w-[100px]">{t("schedule.allMonths")}</TabsTrigger>
                {uniqueMonths.map((month) => (
                  <TabsTrigger key={month.value} value={month.value} className="min-w-[150px]">
                    {month.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="space-y-12">
              {sortedDates.length > 0 ? (
                sortedDates.map((date) => (
                  <div key={date}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center border-b border-gray-200 pb-2">
                      <Calendar className="mr-2" />
                      {formatDate(date)}
                    </h2>
                    
                    <div className="space-y-4">
                      {groupedPerformances[date].map((performance) => (
                        <Card key={performance.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-1/4 lg:w-1/5">
                                <img 
                                  src={performance.mainImage} 
                                  alt={getTranslatedPerformanceName(performance.name)}
                                  className="w-full h-48 sm:h-full object-cover"
                                />
                              </div>
                              
                              <div className="p-6 flex-grow flex flex-col sm:flex-row justify-between">
                                <div className="mb-4 sm:mb-0">
                                  <h3 className="text-xl font-bold text-theatre-burgundy mb-2">
                                    {getTranslatedPerformanceName(performance.name)}
                                  </h3>
                                  <p className="text-gray-500 mb-2">
                                    {t("schedule.director")}: {getTranslatedDirector(performance.director)}
                                  </p>
                                  <div className="flex items-center text-gray-700">
                                    <span className="font-medium">{performance.startTime}</span>
                                    <span className="mx-2">-</span>
                                    <span className="font-medium">{performance.endTime}</span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col sm:items-end space-y-4 mt-4 sm:mt-0">
                                  <div className="flex space-x-3">
                                    <Link to={`/performance/${performance.id}`}>
                                      <Button variant="outline" className="border-theatre-burgundy text-theatre-burgundy hover:bg-theatre-burgundy hover:text-white">
                                        {t("schedule.moreDetails")}
                                      </Button>
                                    </Link>
                                    <Link to={`/tickets/${performance.id}`}>
                                      <Button className="bg-theatre-burgundy text-white hover:bg-theatre-burgundy/90">
                                        {t("schedule.buyTickets")}
                                      </Button>
                                    </Link>
                                  </div>
                                  <div className="text-right mt-2">
                                    <p className="text-sm text-gray-500">{t("schedule.ticketsFrom")} {performance.price.thirdTier} ₴</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-xl font-medium">{t("schedule.noPerformances")}</h3>
                  <p className="mt-1 text-gray-500">{t("schedule.noPerformancesSubtitle")}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Schedule;