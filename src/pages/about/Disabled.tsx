
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Disabled = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-gray-50 py-10">
        <div className="theatre-container">
          <h1 className="text-3xl md:text-4xl font-bold text-theatre-burgundy mb-6">Accessibility Information for Disabled Visitors</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl mb-6">
                TheatreTix is committed to making our performances and facilities accessible to all visitors. We offer a range of services to ensure everyone can enjoy our theater.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Wheelchair Accessibility</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>The main entrance and all public areas of the theater are wheelchair accessible.</li>
                <li>Dedicated wheelchair spaces are available in all seating areas (orchestra, mezzanine, and balcony levels via elevator).</li>
                <li>Companion seats are located adjacent to all wheelchair spaces.</li>
                <li>Accessible restrooms are available on all levels.</li>
                <li>Accessible parking spaces are located in our adjacent parking garage.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Hearing Support</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>Assistive listening devices are available free of charge for all performances.</li>
                <li>Sign language interpreted performances are scheduled for selected dates throughout our season.</li>
                <li>Open captioning is available for designated performances.</li>
                <li>Scripts can be provided in advance for many productions by request.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Visual Impairment Services</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>Audio-described performances are scheduled throughout the season.</li>
                <li>Touch tours can be arranged prior to select performances.</li>
                <li>Large print and Braille programs are available upon request.</li>
                <li>Guide dogs and service animals are welcome in all areas of the theater.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Cognitive and Sensory Needs</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>We offer relaxed/sensory-friendly performances with modified sound and lighting.</li>
                <li>Quiet spaces are available for those who may need a break from the performance.</li>
                <li>Visual story guides are available to help prepare for your visit.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Booking Accessible Tickets</h2>
              <p>
                To book accessible seating or to inquire about accessibility services:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Call our dedicated accessibility line: (123) 456-7890</li>
                <li>Email: access@theatretix.com</li>
                <li>Visit the box office in person (staff are trained in accessibility needs)</li>
              </ul>
              <p>
                When booking, please inform us of your specific requirements so we can best accommodate your needs. Companion/carer tickets at discounted rates are available for those who require assistance.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Additional Support</h2>
              <p>
                Our front-of-house staff are trained to assist patrons with disabilities. If you require any additional support not listed above, please contact us at least one week before your visit, and we will do our best to accommodate your needs.
              </p>
              
              <p className="mt-8 italic">
                We welcome feedback on our accessibility services and are continually working to improve our facilities and offerings. Please share your experiences or suggestions with our accessibility coordinator.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Disabled;
