
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { language, t } = useLanguage();


  return (
    <footer className="bg-theatre-black text-white py-12 mt-16">
      <div className="theatre-container">
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="mb-8 lg:mb-0">
            <h3 className="text-2xl font-bold text-theatre-gold mb-4">TheatreTix</h3>
            <p className="text-gray-300 max-w-md">
            {t("footer.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-theatre-gold">{t("footer.quickLinks")}</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">{t("nav.home")}</Link>
                </li>
                <li>
                  <Link to="/schedule" className="text-gray-300 hover:text-white transition-colors">{t("nav.schedule")}</Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors">{t("nav.login")}</Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-white transition-colors">{t("nav.register")}</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-theatre-gold">{t("footer.contact")}</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">{t("footer.address")}</li>
                <li className="text-gray-300">{t("footer.email")}</li>
                <li className="text-gray-300">{t("footer.phone")}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-theatre-gold">{t("footer.hours")}</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">{t("footer.weekdays")}</li>
                <li className="text-gray-300">{t("footer.weekends")}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TheatreTix. {t("footer.allRights")}
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
               {t("footer.termsService")}
            </Link>
            <Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors">
              {t("footer.refund")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
