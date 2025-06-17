
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";

const Team = () => {
  const { language, t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-gray-50 py-10">
        <div className="theatre-container">
          <h1 className="text-3xl md:text-4xl font-bold text-theatre-burgundy mb-6">{t("team.title")}</h1>
          
          <Tabs defaultValue="management" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="management">{t("team.tabs.management")}</TabsTrigger>
              <TabsTrigger value="actors">{t("team.tabs.actors")}</TabsTrigger>
              <TabsTrigger value="creative">{t("team.tabs.creative")}</TabsTrigger>
              <TabsTrigger value="directors">{t("team.tabs.directors")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="management" className="space-y-8">
              <h2 className="text-2xl font-semibold mb-4">{t("team.management.title")}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: language === 'ua' ? "Євген Нищук" : "Yevhen Nyshchuk",
                    role: language === 'ua' ? "Керівник театру" : "Theater Director",
                    bio: language === 'ua' ? "З 2015 року є головним художнім керівником та очільником театру" : "Since 2015, he has been the chief artistic director and head of the theater",
                    image: "/site_photos/yevhen_nyshchuk.png"
                  },
                  {
                    name: language === 'ua' ? "Маріуш Трелінський" : "Mariusz Trelinski",
                    role: language === 'ua' ? "Художній керівник" : "Artistic Director",
                    bio: language === 'ua' ? "Неочевидне, недослівне, недосказане, естетине. Так можна охарактеризувати вистави Маріуша Трелінського" : "The unobvious, the unspoken, the unsaid, the aesthetic. This is how one can characterize Mariusz Trelinski's performances",
                    image: "/site_photos/Mariusz_Trelinski.png"
                  },
                  {
                    name: language === 'ua' ? "Андрій Сітарський" : "Andriy Sitarsky",
                    role: language === 'ua' ? "Заступник директора з питань маркетингу": "Deputy Director for Marketing",
                    bio: language === 'ua' ? "Займається питаннями маркетингу, просування та формування іміджу театру" : "Deals with marketing, promotion and image building of the theater",
                    image: "/site_photos/Andrii_Sitarski.png"
                  }
                ].map((person, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <img 
                      src={person.image} 
                      alt={person.name} 
                      className="w-full h-64 object-cover object-center rounded-md mb-4" 
                    />
                    <h3 className="text-xl font-semibold">{person.name}</h3>
                    <p className="text-theatre-burgundy font-medium mb-2">{person.role}</p>
                    <p className="text-gray-600">{person.bio}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="actors" className="space-y-8">
              <h2 className="text-2xl font-semibold mb-4">{t("team.actors.title")}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: language === 'ua' ? "Баріхашвілі Дар'я" : "Daria Barikhashvili",
                    specialization: language === 'ua' ? "Театр молоді" : "Youth theater",
                    bio: language === 'ua' ? "Ця молода актриса подає великі надії. Своєю потужною грою вона вразила всіх." : "This young actress shows great promise. She impressed everyone with her powerful performance.",
                    image: "/site_photos/Daria_Barikhashvili.png"
                  },
                  {
                    name: language === 'ua' ? "Майкл Ебейд" : "Michael Ebeid",
                    specialization: language === 'ua' ? "Музичний театр" : "Musical Theater",
                    bio: language === 'ua' ? "Завдяки своєму потужному голосу та виразній акторській грі, Міхаель став фаворитом наших музичних постановок." : "With him powerful voice and expressive acting, Miachael has become a favorite in our musical productions.",
                    image: "/site_photos/Michael_Ebeid.png"
                  },
                  {
                    name: language === 'ua' ? "Леонор Баулак" : "Leonore Baulac",
                    specialization: language === 'ua' ? "Сучасна драма" : "Contemporary Drama",
                    bio: language === 'ua' ? "Емоційний діапазон та універсальність Леонори роблять її ідеальною для наших сучасних драматичних вистав" : "Leonore's emotional range and versatility make her perfect for our modern dramatic performances.",
                    image: "/site_photos/Leonore_Baulac.png"
                  },
                  {
                    name: language === 'ua' ? "Марія Агапітова" : "Maria Agapitova",
                    specialization: language === 'ua' ? "Драма" : "Drama",
                    bio: language === 'ua' ? "Марія блискуче справляється з виконанням складних ролей, коли потрібно передати крайню емоційну напругу" : "Maria brilliantly copes with performing complex roles when it comes to conveying extreme emotional tension.",
                    image: "/site_photos/Maria_Agapitova.png"
                  },
                  {
                    name: language === 'ua' ? "Антек Штаба" : "Antek Sztaba",
                    specialization: language === 'ua' ? "Характерний актор" : "Character Actor",
                    bio: language === 'ua' ? "Для нього хаос є головним джерелом натхнення. Він вважає, що в театрі, та і в житті впринципі головне це елемент несподіванки" : "For him, chaos is the main source of inspiration. He believes that in theater, and in life in general, the most important thing is the element of surprise",
                    image: "/site_photos/antek_sztaba.png"
                  },
                  {
                    name: language === 'ua' ? "Ката Бан" : "Kata Ban",
                    specialization: language === 'ua' ? "Драма і танець" : "Drama & Dance",
                    bio: language === 'ua' ? "Поєднуючи виняткову акторську майстерність з професійною танцювальною підготовкою, Ката привносить унікальну енергетику в наші постановки." : "Combining exceptional acting with professional dance training, Kata brings unique energy to our productions.",
                    image: "/site_photos/kata_ban.png"
                  }
                ].map((person, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <img 
                      src={person.image} 
                      alt={person.name} 
                      className="w-full h-64 object-cover object-center rounded-md mb-4" 
                    />
                    <h3 className="text-xl font-semibold">{person.name}</h3>
                    <p className="text-theatre-burgundy font-medium mb-2">{person.specialization}</p>
                    <p className="text-gray-600">{person.bio}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="creative" className="space-y-8">
              <h2 className="text-2xl font-semibold mb-4">{t("team.creative.title")}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: language === 'ua' ? "Джейд Маккеллар" : "Jade McKellar",
                    role: language === 'ua' ? "Головний художник по костюмах" : "Head Costume Designer",
                    bio: language === 'ua' ? "Отримавши освіту в Інституті моди, Джейд створює наші приголомшливі історичні та сучасні костюми." : "With training from the Fashion Institute, Jade creates our stunning period and contemporary costumes.",
                    image: "/site_photos/jade_mckellar.png"
                  },
                  {
                    name: language === 'ua' ? "Томаш Бласяк" : "Tomasz Blasiak",
                    role: language === 'ua' ? "Сценограф" : "Set Designer",
                    bio: language === 'ua' ? "Інноваційні та практичні декорації Томаша перетворюють нашу сцену для кожної унікальної постановки." : "Tomasz's innovative and practical set designs transform our stage for each unique production.",
                    image: "/site_photos/tomasz_blasiak.png"
                  },
                  {
                    name: language === 'ua' ? "Велика Лілія" : "Lilia Velyka",
                    role: language === 'ua' ? "Дизайнер освітлення" : "Lighting Designer",
                    bio: language === 'ua' ? "Відзначений нагородами дизайнер освітлення, який створює атмосферне та емоційне середовище за допомогою світла." : "Award-winning lighting designer who creates atmospheric and emotional environments through light.",
                    image: "/site_photos/lilia_velyka.png"
                  },
                  {
                    name: language === 'ua' ? "Катажина Ліс" : "Katarzyna Lis",
                    role: language === 'ua' ? "Звукорежисер" : "Sound Designer",
                    bio: language === 'ua' ? "Катажина створює захоплюючі звукові ландшафти, які підсилюють театральні враження від кожної вистави." : "Katarzyna crafts immersive soundscapes that enhance the theatrical experience of every production.",
                    image: "/site_photos/katarzyna_lis.png"
                  },
                  {
                    name: language === 'ua' ? "Ханна Мейсон" : "Hannah Mason",
                    role: language === 'ua' ? "Майстер реквізиту" : "Prop Master",
                    bio: language === 'ua' ? "Ханна знаходить і створює ідеальний реквізит, який допомагає втілити наші історії в життя." : "Hannah sources and creates the perfect props that help bring our stories to life.",
                    image: "/site_photos/hannah_mason.png"
                  }
                ].map((person, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <img 
                      src={person.image} 
                      alt={person.name} 
                      className="w-full h-64 object-cover object-center rounded-md mb-4" 
                    />
                    <h3 className="text-xl font-semibold">{person.name}</h3>
                    <p className="text-theatre-burgundy font-medium mb-2">{person.role}</p>
                    <p className="text-gray-600">{person.bio}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="directors" className="space-y-8">
              <h2 className="text-2xl font-semibold mb-4">{t("team.directors.title")}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: language === 'ua' ? "Валерій Регрут" : "Regrut Valery",
                    specialty: language === 'ua' ? "Класичні твори" : "Classical Productions",
                    bio: language === 'ua' ? "Інтерпретації класичних творів Валерієм балансують між традицією та свіжими перспективами для сучасної аудиторії." : "Valeriy's interpretations of classical works balance between tradition and fresh perspectives for a contemporary audience.",
                    image: "/site_photos/regrut_valerii.png"
                  },
                  {
                    name: language === 'ua' ? "Моніка Рошко" : "Monika Roszko",
                    specialty: language === 'ua' ? "Нові твори та сучасні п'єси" : "New Works & Contemporary Plays",
                    bio: language === 'ua' ? "Моніка співпрацює з драматургами, щоб привнести в наш театр нові голоси та історії." : "Monika collaborates with playwrights to bring new voices and stories to our theater.",
                    image: "/site_photos/monika_roszko.png"
                  },
                  {
                    name: language === 'ua' ? "Джеймі Мускато" : "Jamie Muscato",
                    specialty: language === 'ua' ? "Музичний напрям" : "Musical Direction",
                    bio: language === 'ua' ? "Маючи музичну та театральну освіту, Джеймі є режисером наших найамбітніших музичних постановок." : "With a background in music and theater, Jamie directs our most ambitious musical productions.",
                    image: "/site_photos/Jamie_Muscato.png"
                  }
                ].map((person, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <img 
                      src={person.image} 
                      alt={person.name} 
                      className="w-full h-64 object-cover object-center rounded-md mb-4" 
                    />
                    <h3 className="text-xl font-semibold">{person.name}</h3>
                    <p className="text-theatre-burgundy font-medium mb-2">{person.specialty}</p>
                    <p className="text-gray-600">{person.bio}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Team;
