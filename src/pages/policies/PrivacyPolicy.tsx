import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  
  const content = language === 'ua' ? (
    <>
      <h1 className="text-3xl font-bold mb-6">Політика конфіденційності</h1>
      <p className="mb-4">Останнє оновлення: 21 травня 2025 р.</p>
      
      <h2 className="text-2xl font-semibold my-4">1. Вступ</h2>
      <p className="mb-4">
        Ласкаво просимо до TheatreTix. Ми поважаємо вашу конфіденційність і зобов'язуємося захищати ваші особисті дані. Ця Політика конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо вашу інформацію під час використання нашого сайту.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">2. Яку інформацію ми збираємо</h2>
      <p className="mb-4">
        Ми збираємо такі типи особистої інформації:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Контактна інформація (ім'я, електронна пошта, телефон)</li>
        <li>Облікові дані (логін, історія покупок)</li>
        <li>Технічна інформація (IP-адреса, тип пристрою)</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">3. Як ми використовуємо вашу інформацію</h2>
      <p className="mb-4">
        Ми використовуємо вашу інформацію для:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Обробки та виконання замовлень квитків</li>
        <li>Надсилання підтверджень бронювання</li>
        <li>Покращення нашого сайту та обслуговування</li>
        <li>Відправки маркетингових повідомлень (якщо ви погодились)</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">4. Обмін інформацією</h2>
      <p className="mb-4">
        Ми не продаємо вашу інформацію третім сторонам. Ми можемо ділитися інформацією з:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Платіжними процесорами для обробки платежів</li>
        <li>Театрами для підтвердження бронювань</li>
        <li>Постачальниками послуг, які допомагають з функціонуванням нашого сайту</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">5. Безпека даних</h2>
      <p className="mb-4">
        Ми впровадили відповідні технічні заходи для захисту вашої особистої інформації від випадкової втрати, несанкціонованого доступу або розкриття.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">6. Ваші права</h2>
      <p className="mb-4">
        В залежності від вашого місцезнаходження, ви можете мати такі права:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Доступ до особистої інформації</li>
        <li>Виправлення неточної інформації</li>
        <li>Видалення вашої інформації</li>
        <li>Заперечення проти обробки</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">7. Контактна інформація</h2>
      <p className="mb-4">
        Якщо у вас є запитання щодо цієї Політики конфіденційності, будь ласка, зв'яжіться з нами:
      </p>
      <p className="mb-4">
        Email: info@theatretix.com<br />
        Телефон: +380 44 123 4567<br />
        Адреса: вул. Володимирська 50, 01030, м. Київ
      </p>
    </>
  ) : (
    <>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: May 21, 2025</p>
      
      <h2 className="text-2xl font-semibold my-4">1. Introduction</h2>
      <p className="mb-4">
        Welcome to TheatreTix. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">2. Information We Collect</h2>
      <p className="mb-4">
        We collect the following types of personal information:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Contact information (name, email, phone)</li>
        <li>Account data (login, purchase history)</li>
        <li>Technical information (IP address, device type)</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">3. How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Process and fulfill ticket orders</li>
        <li>Send booking confirmations</li>
        <li>Improve our website and service</li>
        <li>Send marketing communications (if you've opted in)</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">4. Information Sharing</h2>
      <p className="mb-4">
        We do not sell your information to third parties. We may share information with:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Payment processors to handle payments</li>
        <li>Theaters to confirm bookings</li>
        <li>Service providers who help operate our website</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">5. Data Security</h2>
      <p className="mb-4">
        We have implemented appropriate technical measures to protect your personal information from accidental loss, unauthorized access, or disclosure.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">6. Your Rights</h2>
      <p className="mb-4">
        Depending on your location, you may have the following rights:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Access to personal information</li>
        <li>Correction of inaccurate information</li>
        <li>Deletion of your information</li>
        <li>Object to processing</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">7. Contact Information</h2>
      <p className="mb-4">
        If you have questions about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;