
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

const Rules = () => {
  const { language, t } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>("rules");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-gray-50 py-10">
        <div className="theatre-container">
          <h1 className="text-3xl md:text-4xl font-bold text-theatre-burgundy mb-6">{t("rules.title")}</h1>
          
          <div className="space-y-4">
            {/* Theater Visit Rules */}
            <Collapsible 
              open={openSection === "rules"} 
              onOpenChange={() => toggleSection("rules")}
              className="border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50">
                <span className="text-xl font-semibold">{t("rules.title1")}</span>
                <ChevronRight className={cn(
                  "h-6 w-6 transition-transform", 
                  openSection === "rules" ? "rotate-90" : ""
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-white p-6 border-t">
                <div className="prose prose-lg max-w-none">
                  <p className="lead text-xl mb-6">
                    {t("rules.intro")}
                  </p>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("rules.section1.title")}</h2>
                  <ul className="list-disc pl-6 mb-6">
                    <li>{t("rules.section1.rule1")}</li>
                    <li>{t("rules.section1.rule2")}</li>
                    <li>{t("rules.section1.rule3")}</li>
                    <li>{t("rules.section1.rule4")}</li>
                    <li>{t("rules.section1.rule5")}</li>
                    <li>{t("rules.section1.rule6")}</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("rules.section2.title")}</h2>
                  <ul className="list-disc pl-6 mb-6">
                    <li>{t("rules.section2.rule1")}</li>
                    <li>{t("rules.section2.rule2")}</li>
                    <li>{t("rules.section2.rule3")}</li>
                    <li>{t("rules.section2.rule4")}</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("rules.section3.title")}</h2>
                  <p>
                    {t("rules.section3.rule")}
                  </p>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("rules.section4.title")}</h2>
                  <ul className="list-disc pl-6 mb-6">
                    <li>{t("rules.section4.rule1")}</li>
                    <li>{t("rules.section4.rule2")}</li>
                    <li>{t("rules.section4.rule3")}</li>
                    <li>{t("rules.section4.rule4")}</li>
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Disabled People */}
            <Collapsible 
              open={openSection === "disabled"} 
              onOpenChange={() => toggleSection("disabled")}
              className="border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50">
                <span className="text-xl font-semibold">{t("disabled.title")}</span>
                <ChevronRight className={cn(
                  "h-6 w-6 transition-transform", 
                  openSection === "disabled" ? "rotate-90" : ""
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-white p-6 border-t">
                <div className="prose prose-lg max-w-none">
                  <p className="lead text-xl mb-6">
                    {t("disabled.intro")}
                  </p>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("disabled.section1.title")}</h2>
                  <ul className="list-disc pl-6 mb-6">
                    <li>{t("disabled.section1.rule1")}</li>
                    <li>{t("disabled.section1.rule2")}</li>
                    <li>{t("disabled.section1.rule3")}</li>
                    <li>{t("disabled.section1.rule4")}</li>
                    <li>{t("disabled.section1.rule5")}</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("disabled.section2.title")}</h2>
                  <p>
                    {t("disabled.section2.rule")}
                  </p>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("disabled.section3.title")}</h2>
                  <p>
                    {t("disabled.section3.rule")}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Privileged Categories */}
            <Collapsible 
              open={openSection === "privileged"} 
              onOpenChange={() => toggleSection("privileged")}
              className="border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50">
                <span className="text-xl font-semibold">{t("privileged.title")}</span>
                <ChevronRight className={cn(
                  "h-6 w-6 transition-transform", 
                  openSection === "privileged" ? "rotate-90" : ""
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-white p-6 border-t">
                <div className="prose prose-lg max-w-none">
                  <p className="lead text-xl mb-6">
                    {t("privileged.intro")}
                  </p>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privileged.section1.title")}</h2>
                  <ul className="list-disc pl-6 mb-6">
                    <li>{t("privileged.section1.rule1")}</li>
                    <li>{t("privileged.section1.rule2")}</li>
                    <li>{t("privileged.section1.rule3")}</li>
                    <li>{t("privileged.section1.rule4")}</li>
                    <li>{t("privileged.section1.rule5")}</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privileged.section2.title")}</h2>
                  <ul className="list-disc pl-6 mb-6">
                    <li>{t("privileged.section2.rule1")}</li>
                    <li>{t("privileged.section2.rule2")}</li>
                    <li>{t("privileged.section2.rule3")}</li>
                    <li>{t("privileged.section2.rule4")}</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold mt-8 mb-4">{t("privileged.section3.title")}</h2>
                  <p>
                    {t("privileged.section3.rule")}
                  </p>
                  
                  <p className="mt-8 italic">
                   {t("privileged.section4.rule")}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Rules;
