
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const Contacts = () => {
  const { language, t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-gray-50 py-10">
        <div className="theatre-container">
          <h1 className="text-3xl md:text-4xl font-bold text-theatre-burgundy mb-6">{t("contacts.title")}</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">{t("contacts.location.title")}</h2>
                <p className="mb-2">{t("contacts.location.street")}</p>
                <p className="mb-2">{t("contacts.location.city")}</p>
                <p className="mb-6">{t("contacts.location.country")}</p>
                
                <div className="rounded-lg overflow-hidden h-64">
                  {<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.699024009229!2d30.5097945764371!3d50.44670657159155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce583e2351b3%3A0x5a6590ac85301c76!2z0J3QsNGG0LjQvtC90LDQu9GM0L3QsNGPINC-0L_QtdGA0LAg0KPQutGA0LDQuNC90Ysg0LjQvC4g0KIuINCTLiDQqNC10LLRh9C10L3QutC-!5e0!3m2!1sru!2spl!4v1746811076235!5m2!1sru!2spl" width="600" height="450" style={{ border: "0" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-600">Interactive Map</p>
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">{t("contacts.hours.title")}</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{t("contacts.hours.boxOffice")}</span>
                    <span>{t("contacts.hours.boxOfficeHours")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{t("contacts.hours.admin")}</span>
                    <span>{t("contacts.hours.adminHours")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{t("contacts.hours.performance")}</span>
                    <span>{t("contacts.hours.performanceOpen")}</span>
                  </div>
                </div>
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">{t("contacts.social.title")}</h2>
                  <div className="flex space-x-4">
                    <a href="https://www.facebook.com/profile.php?id=100014684235442" className="text-theatre-burgundy hover:text-theatre-burgundy/80">Facebook</a>
                    <a href="https://x.com/paliginvlad" className="text-theatre-burgundy hover:text-theatre-burgundy/80">Twitter</a>
                    <a href="https://www.instagram.com/paliginvlad/" className="text-theatre-burgundy hover:text-theatre-burgundy/80">Instagram</a>
                    <a href="https://www.youtube.com/@paliginvlad" className="text-theatre-burgundy hover:text-theatre-burgundy/80">YouTube</a>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">{t("contacts.departments.title")}</h2>
                
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-medium mb-2 text-theatre-burgundy">{t("contacts.boxOffice.title")}</h3>
                    <p className="mb-1"><strong>{t("contacts.boxOffice.phoneTitle")}</strong> {t("contacts.boxOffice.phone")}</p>
                    <p className="mb-1"><strong>{t("contacts.boxOffice.emailTitle")}</strong> {t("contacts.boxOffice.email")}</p>
                    <p className="text-sm text-gray-600 mt-2">{t("contacts.boxOffice.description")}</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-medium mb-2 text-theatre-burgundy">{t("contacts.info.title")}</h3>
                    <p className="mb-1"><strong>{t("contacts.info.phoneTitle")}</strong> {t("contacts.info.phone")}</p>
                    <p className="mb-1"><strong>{t("contacts.info.emailTitle")}</strong> {t("contacts.info.email")}</p>
                    <p className="text-sm text-gray-600 mt-2">{t("contacts.info.description")}</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-medium mb-2 text-theatre-burgundy">{t("contacts.admin.title")}</h3>
                    <p className="mb-1"><strong>{t("contacts.admin.phoneTitle")}</strong> {t("contacts.admin.phone")}</p>
                    <p className="mb-1"><strong>{t("contacts.admin.emailTitle")}</strong> {t("contacts.admin.email")}</p>
                    <p className="text-sm text-gray-600 mt-2">{t("contacts.admin.description")}</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-medium mb-2 text-theatre-burgundy">{t("contacts.accounting.title")}</h3>
                    <p className="mb-1"><strong>{t("contacts.accounting.phoneTitle")}</strong> {t("contacts.accounting.phone")}</p>
                    <p className="mb-1"><strong>{t("contacts.accounting.emailTitle")}</strong> {t("contacts.accounting.email")}</p>
                    <p className="text-sm text-gray-600 mt-2">{t("contacts.accounting.description")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contacts;
