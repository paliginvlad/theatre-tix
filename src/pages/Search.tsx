
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Mock search results data - in a real application, this would come from an API
const mockData = [
  {
    id: 1,
    type: "performance",
    title: { en: "Hamlet", ua: "Гамлет" },
    description: {
      en: "A tragedy by William Shakespeare about the Prince of Denmark seeking revenge for his father's murder.",
      ua: "Трагедія Вільяма Шекспіра про принца Данії, який шукає помсти за вбивство свого батька."
    },
    url: "/performance/1",
  },
  {
    id: 2,
    type: "performance",
    title: { en: "Romeo and Juliet", ua: "Ромео і Джульєтта" },
    description: {
      en: "A tragedy by William Shakespeare about two young lovers whose deaths ultimately reconcile their feuding families.",
      ua: "Трагедія Вільяма Шекспіра про двох молодих закоханих, чиї смерті зрештою примирюють їхні ворогуючі сім'ї."
    },
    url: "/performance/2",
  },
  {
    id: 3,
    type: "actor",
    title: { en: "John Smith", ua: "Джон Сміт" },
    description: {
      en: "Leading actor with 15 years of experience in Shakespeare's plays.",
      ua: "Провідний актор з 15-річним досвідом у п'єсах Шекспіра."
    },
    url: "/team#john-smith",
  },
  {
    id: 4,
    type: "actor",
    title: { en: "Sarah Johnson", ua: "Сара Джонсон" },
    description: {
      en: "Award-winning actress specializing in contemporary theater.",
      ua: "Відзначена нагородами актриса, яка спеціалізується на сучасному театрі."
    },
    url: "/team#sarah-johnson",
  },
  {
    id: 5,
    type: "news",
    title: { en: "New Season Announcement", ua: "Анонс нового сезону" },
    description: {
      en: "Our theater is excited to announce the upcoming season featuring classic and contemporary productions.",
      ua: "Наш театр радий анонсувати майбутній сезон, що включає класичні та сучасні постановки."
    },
    url: "/news",
  },
  {
    id: 6,
    type: "event",
    title: { en: "Theater Workshop", ua: "Театральний майстер-клас" },
    description: {
      en: "Join our monthly theater workshop led by professional directors and actors.",
      ua: "Приєднуйтесь до нашого щомісячного театрального майстер-класу, який проводять професійні режисери та актори."
    },
    url: "/news#workshop",
  },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockData>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { language, t } = useLanguage();

  const handleSearch = () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredResults = mockData.filter(
      (item) =>
        item.title[language === "ua" ? "ua" : "en"].toLowerCase().includes(searchTerm) ||
        item.description[language === "ua" ? "ua" : "en"].toLowerCase().includes(searchTerm) ||
        (language === "ua" ? 
          (item.type === "performance" ? "вистава" : 
           item.type === "actor" ? "актор" : 
           item.type === "news" ? "новини" : 
           item.type === "event" ? "подія" : item.type)
          : item.type).toLowerCase().includes(searchTerm)
    );

    setResults(filteredResults);
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Helper function to get localized type names
  const getLocalizedType = (type: string) => {
    if (language === "ua") {
      switch (type) {
        case "performance": return "вистава";
        case "actor": return "актор";
        case "news": return "новини";
        case "event": return "подія";
        default: return type;
      }
    }
    return type;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50 py-10">
        <div className="theatre-container">
          <h1 className="text-3xl md:text-4xl font-bold text-theatre-burgundy mb-6">
            {t("search.title")}
          </h1>

          <div className="mb-8 max-w-2xl">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={t("search.placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch} 
                className="bg-theatre-burgundy hover:bg-theatre-burgundy/90"
              >
                <SearchIcon className="mr-2" size={18} />
                {t("search.button")}
              </Button>
            </div>
          </div>

          {hasSearched && (
            <div className="mt-8">
              {results.length > 0 ? (
                <>
                  <h2 className="text-xl font-medium mb-4">
                    {results.length === 1 
                      ? t("search.results").replace("{count}", results.length.toString())
                      : t("search.results_plural").replace("{count}", results.length.toString())}
                  </h2>
                  <div className="space-y-6">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="bg-white p-4 rounded-md shadow-sm hover:shadow transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs uppercase bg-gray-100 px-2 py-1 rounded-full">
                            {getLocalizedType(result.type)}
                          </span>
                          <h3 className="text-lg font-medium">
                            <a href={result.url} className="text-theatre-burgundy hover:underline">
                              {result.title[language === "ua" ? "ua" : "en"]}
                            </a>
                          </h3>
                        </div>
                        <p className="text-gray-600">
                          {result.description[language === "ua" ? "ua" : "en"]}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <h2 className="text-xl font-medium mb-2">
                    {t("search.noResults")}
                  </h2>
                  <p className="text-gray-600">
                    {t("search.tryAgain")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
