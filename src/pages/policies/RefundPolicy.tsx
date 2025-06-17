import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  const { language } = useLanguage();
  
  const content = language === 'ua' ? (
    <>
      <h1 className="text-3xl font-bold mb-6">Політика повернення коштів</h1>
      <p className="mb-4">Останнє оновлення: 21 травня 2025 р.</p>
      
      <h2 className="text-2xl font-semibold my-4">1. Політика повернення квитків</h2>
      <p className="mb-4">
        У TheatreTix ми прагнемо забезпечити найкращий досвід для наших клієнтів. Ось наша політика щодо повернення коштів і обміну квитків:
      </p>
      
      <h2 className="text-2xl font-semibold my-4">2. Скасовані вистави</h2>
      <p className="mb-4">
        Якщо вистава скасована організаторами, вам буде запропоновано:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Повне відшкодування вартості квитка</li>
        <li>Обмін на іншу дату (за наявності)</li>
        <li>Подарунковий сертифікат на майбутні покупки</li>
      </ul>
      <p className="mb-4">
        Усі запити на повернення коштів за скасовані вистави повинні бути зроблені протягом 30 днів з дати скасування.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">3. Перенесені вистави</h2>
      <p className="mb-4">
        Якщо вистава перенесена, ваші квитки автоматично дійсні для нової дати. Якщо ви не можете відвідати перенесену виставу, у вас є такі варіанти:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Обмін на іншу доступну виставу</li>
        <li>Подарунковий сертифікат на майбутні покупки</li>
        <li>Повернення коштів (за запитом протягом 14 днів з моменту оголошення нової дати)</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">4. Стандартні повернення</h2>
      <p className="mb-4">
        За винятком скасованих або перенесених вистав:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Повернення коштів можливе за 7 або більше днів до вистави з комісією за обробку 10%</li>
        <li>За 3-6 днів до вистави можливий тільки обмін квитків або подарунковий сертифікат</li>
        <li>За менш ніж 3 дні до вистави повернення або обмін неможливі</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">5. Виняткові обставини</h2>
      <p className="mb-4">
        У виняткових випадках (серйозна хвороба, сімейна надзвичайна ситуація) ми можемо розглянути запити на повернення або обмін за межами нашої стандартної політики. Такі запити розглядаються в індивідуальному порядку.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">6. Як запросити повернення</h2>
      <p className="mb-4">
        Щоб запросити повернення коштів або обмін:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Увійдіть до свого облікового запису TheatreTix</li>
        <li>Знайдіть своє замовлення в історії покупок</li>
        <li>Виберіть опцію «Запит на повернення» або «Запит на обмін»</li>
        <li>Дотримуйтесь підказок для завершення запиту</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">7. Час обробки повернень</h2>
      <p className="mb-4">
        Після схвалення повернення кошти будуть зараховані на ваш первинний спосіб оплати протягом 5-10 робочих днів.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">8. Контактна інформація</h2>
      <p className="mb-4">
        Якщо у вас є запитання щодо цієї Політики повернення коштів, будь ласка, зв'яжіться з нами:
      </p>
      <p className="mb-4">
        Email: refunds@theatretix.com<br />
        Телефон: +380 44 123 4567<br />
        Адреса: вул. Володимирська 50, 01030, м. Київ
      </p>
    </>
  ) : (
    <>
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
      <p className="mb-4">Last updated: May 21, 2025</p>
      
      <h2 className="text-2xl font-semibold my-4">1. Ticket Refund Policy</h2>
      <p className="mb-4">
        At TheatreTix, we strive to provide the best experience for our customers. Here is our policy regarding ticket refunds and exchanges:
      </p>
      
      <h2 className="text-2xl font-semibold my-4">2. Canceled Performances</h2>
      <p className="mb-4">
        If a performance is canceled by the organizers, you will be offered:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>A full refund of the ticket price</li>
        <li>Exchange for another date (subject to availability)</li>
        <li>A gift certificate for future purchases</li>
      </ul>
      <p className="mb-4">
        All refund requests for canceled performances must be made within 30 days of the cancellation date.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">3. Rescheduled Performances</h2>
      <p className="mb-4">
        If a performance is rescheduled, your tickets are automatically valid for the new date. If you cannot attend the rescheduled performance, you have the following options:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Exchange for another available performance</li>
        <li>A gift certificate for future purchases</li>
        <li>A refund (if requested within 14 days of the new date announcement)</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">4. Standard Refunds</h2>
      <p className="mb-4">
        Excluding canceled or rescheduled performances:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Refunds are available 7 or more days before the performance with a 10% processing fee</li>
        <li>3-6 days before the performance, only ticket exchanges or gift certificates are available</li>
        <li>Less than 3 days before the performance, no refunds or exchanges are possible</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">5. Exceptional Circumstances</h2>
      <p className="mb-4">
        In exceptional cases (serious illness, family emergency), we may consider refund or exchange requests outside our standard policy. Such requests are reviewed on a case-by-case basis.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">6. How to Request a Refund</h2>
      <p className="mb-4">
        To request a refund or exchange:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Log in to your TheatreTix account</li>
        <li>Locate your order in the purchase history</li>
        <li>Select the "Request Refund" or "Request Exchange" option</li>
        <li>Follow the prompts to complete the request</li>
      </ul>
      
      <h2 className="text-2xl font-semibold my-4">7. Refund Processing Times</h2>
      <p className="mb-4">
        Once approved, refunds will be credited to your original payment method within 5-10 business days.
      </p>
      
      <h2 className="text-2xl font-semibold my-4">8. Contact Information</h2>
      <p className="mb-4">
        If you have questions about this Refund Policy, please contact us:
      </p>
      <p className="mb-4">
        Email: refunds@theatretix.com<br />
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

export default RefundPolicy;