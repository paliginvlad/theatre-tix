

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Performance } from "@/services/performanceService";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PerformanceCardProps {
  performance: Performance;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ performance }) => {
  const { t, language } = useLanguage();

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    
    if (language === 'en') {
      return new Date(dateString).toLocaleDateString('en-US', options);
    } else {
      // For Ukrainian, format with locale
      return new Date(dateString).toLocaleDateString('uk-UA', options);
    }
  };

  // Translate performance name based on language
  const translatedName = language === 'ua' ? 
    getUkrainianPerformanceName(performance.name) : performance.name;
  
  // Translate description based on language
  const translatedDescription = language === 'ua' ? 
    getUkrainianDescription(performance.name) : performance.description;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.01]">
      <Link to={`/performance/${performance.id}`}>
        <div className="relative h-64 overflow-hidden">
          <img 
            src={performance.mainImage} 
            alt={translatedName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 text-white">
              <h3 className="font-bold text-xl">{translatedName}</h3>
              <div className="flex items-center mt-2">
                <Calendar size={16} className="mr-1" />
                <span className="text-sm">{formatDate(performance.date)}</span>
                <span className="mx-2">•</span>
                <span className="text-sm">{performance.startTime}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <p className="line-clamp-2 text-sm text-gray-600">{translatedDescription}</p>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
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
      </CardFooter>
    </Card>
  );
};

// Helper function to translate performance names to Ukrainian
function getUkrainianPerformanceName(name: string): string {
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
}

// Helper function to translate descriptions to Ukrainian
function getUkrainianDescription(name: string): string {
  switch (name) {
    case "Hamlet":
      return "Трагедія «Гамлет, принц Данський» — трагедія Вільяма Шекспіра, написана між 1599 та 1602 роками. Дія відбувається в Данії, п'єса зображує принца Гамлета та його помсту своєму дядьку Клавдію, який вбив Гамлетового батька, щоб захопити його трон і одружитися з Гамлетовою матір'ю.";
    case "Romeo and Juliet":
      return "«Ромео і Джульєтта» — трагедія, написана Вільямом Шекспіром на початку його кар'єри, про двох молодих італійських закоханих із ворожих сімей, чиї смерті зрештою примирюють їхні ворогуючі родини.";
    case "Macbeth":
      return "«Макбет» — трагедія Вільяма Шекспіра; вважається, що вона вперше була поставлена в 1606 році. Вона драматизує руйнівні фізичні та психологічні наслідки політичних амбіцій для тих, хто прагне влади заради самої влади.";
    case "The Tempest":
      return "«Буря» — п'єса Вільяма Шекспіра, ймовірно написана в 1610–1611 роках, і вважається однією з останніх п'єс, які Шекспір написав сам. Після першої сцени, яка відбувається на кораблі в морі під час бурі, решта історії відбувається на віддаленому острові, де чаклун Просперо, складний і суперечливий персонаж, живе зі своєю дочкою Мірандою та двома своїми слугами — Калібаном, диким монстром, і Аріелем, повітряним духом.";
    case "A Midsummer Night's Dream":
      return "«Сон літньої ночі» — комедія, написана Вільямом Шекспіром у 1595/96. Вона зображує події навколо одруження Тесея, герцога Афінського, з Іпполітою, колишньою царицею амазонок.";
    default:
      return "";
  }
}

export default PerformanceCard;