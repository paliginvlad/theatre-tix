import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  const { language } = useLanguage();
  
  const content = language === 'ua' ? (
    <>
      <h1 className="text-3xl font-bold mb-6">Умови надання послуг</h1>
      <p className="mb-4">Останнє оновлення: 21 травня 2025 р.</p>
      
      <h2 className="text-2xl font-semibold my-4">1. Прийняття умов</h2>
      <p className="mb-4">
        Використовуючи TheatreTix, ви погоджуєтеся дотримуватися цих Умов надання послуг. Якщо ви не згодні з будь-якою частиною цих умов, будь ласка, не використовуйте наш сайт.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">2. Право на зміну</h2>
      <p className="mb-4">
        Ми залишаємо за собою право змінювати ці умови в будь-який час. Зміни набувають чинності одразу після публікації на сайті. Продовжуючи використовувати TheatreTix, ви погоджуєтеся з цими змінами.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">3. Створення рахунку</h2>
      <p className="mb-4">
        Щоб купувати квитки, вам потрібно створити обліковий запис. Ви відповідаєте за збереження конфіденційності своїх облікових даних та за всі дії, що відбуваються у вашому обліковому записі.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">4. Купівля квитків</h2>
      <p className="mb-4">
        Усі продажі квитків є остаточними, за винятком випадків скасування вистави. Квитки не підлягають перепродажу без нашого прямого дозволу.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">5. Поведінка користувача</h2>
      <p className="mb-4">
        Ви погоджуєтеся не:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Використовувати сайт у незаконних або шахрайських цілях</li>
        <li>Порушувати безпеку сайту</li>
        <li>Збирати дані інших користувачів</li>
        <li>Розміщувати образливий або шкідливий контент</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">6. Інтелектуальна власність</h2>
      <p className="mb-4">
        Весь контент на TheatreTix, включаючи логотипи, тексти та графіку, є власністю TheatreTix або наших ліцензіарів і захищений законами про авторське право.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">7. Обмеження відповідальності</h2>
      <p className="mb-4">
        TheatreTix не несе відповідальності за будь-які непрямі, випадкові або штрафні збитки, що виникають внаслідок використання або неможливості використання нашого сайту.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">8. Застосовне право</h2>
      <p className="mb-4">
        Ці умови регулюються та тлумачаться відповідно до законів України, без урахування колізійних норм.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">9. Контактна інформація</h2>
      <p className="mb-4">
        Якщо у вас є запитання щодо цих Умов, будь ласка, зв'яжіться з нами:
      </p>
      <p className="mb-4">
        Email: info@theatretix.com<br />
        Телефон: +380 44 123 4567<br />
        Адреса: вул. Володимирська 50, 01030, м. Київ
      </p>
    </>
  ) : (
    <>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: May 21, 2025</p>
      
      <h2 className="text-2xl font-semibold my-4">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By using TheatreTix, you agree to abide by these Terms of Service. If you disagree with any part of these terms, please do not use our website.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">2. Right to Modify</h2>
      <p className="mb-4">
        We reserve the right to modify these terms at any time. Changes take effect immediately upon posting to the website. By continuing to use TheatreTix, you agree to the modifications.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">3. Account Creation</h2>
      <p className="mb-4">
        To purchase tickets, you need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">4. Ticket Purchases</h2>
      <p className="mb-4">
        All ticket sales are final, except in cases of performance cancellation. Tickets may not be resold without our express permission.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">5. User Conduct</h2>
      <p className="mb-4">
        You agree not to:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Use the site for illegal or fraudulent purposes</li>
        <li>Breach the security of the site</li>
        <li>Harvest data of other users</li>
        <li>Post offensive or harmful content</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">6. Intellectual Property</h2>
      <p className="mb-4">
        All content on TheatreTix, including logos, text, and graphics, is the property of TheatreTix or our licensors and is protected by copyright laws.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">7. Limitation of Liability</h2>
      <p className="mb-4">
        TheatreTix shall not be liable for any indirect, incidental, or punitive damages arising from your use or inability to use our website.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">8. Governing Law</h2>
      <p className="mb-4">
        These terms shall be governed by and construed in accordance with the laws of Ukraine, without regard to its conflict of law provisions.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">9. Contact Information</h2>
      <p className="mb-4">
        If you have questions about these Terms, please contact us:
      </p>
      <p className="mb-4">
        Email: info@theatretix.com<br />
        Phone: +380 44 123 4567<br />
        Address: 50 Volodymyrska St. 01030, Kyiv
      </p>
    </>
  );

  return (
    <>
      <Header />
      <div className="theatre-container py-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            {content}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;