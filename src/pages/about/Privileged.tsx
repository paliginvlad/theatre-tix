
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privileged = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow bg-gray-50 py-10">
        <div className="theatre-container">
          <h1 className="text-3xl md:text-4xl font-bold text-theatre-burgundy mb-6">Visiting for Privileged Categories of Citizens</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl mb-6">
                TheatreTix is committed to making theater accessible to all members of our community. We offer special programs and discounts for privileged categories of citizens.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Eligible Categories</h2>
              <p>The following categories of citizens are eligible for special privileges at TheatreTix:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Senior citizens (65 years and older)</li>
                <li>Veterans and active military personnel</li>
                <li>People with disabilities</li>
                <li>Students (with valid ID)</li>
                <li>Low-income individuals participating in social assistance programs</li>
                <li>Healthcare workers (with valid ID)</li>
                <li>Teachers and education professionals (with valid ID)</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Ticket Discounts</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>20% discount on regular ticket prices with valid documentation</li>
                <li>Additional 10% discount for matinee performances</li>
                <li>Special rates for group bookings (10 or more people)</li>
                <li>Last-minute rush tickets at 50% discount 30 minutes before performance (subject to availability)</li>
                <li>Free companion ticket for attendees who require assistance (limited availability)</li>
              </ul>
              
              <div className="bg-gray-50 p-5 rounded-lg my-8 border border-gray-200">
                <h3 className="text-xl font-medium mb-3">How to Apply for Discounted Tickets</h3>
                <ol className="list-decimal pl-6">
                  <li>Present a valid ID or documentation at the box office when purchasing tickets</li>
                  <li>For online purchases, select the appropriate discount category and bring your documentation to collect tickets</li>
                  <li>For phone bookings, mention your eligibility when speaking with our box office staff</li>
                </ol>
                <p className="mt-4 italic text-sm">Note: Valid documentation must be presented when collecting tickets.</p>
              </div>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Special Programs</h2>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Senior Matinees:</strong> Special afternoon performances with pre-show talks designed for senior audiences</li>
                <li><strong>Veterans Night:</strong> Dedicated performances with special recognition for military personnel</li>
                <li><strong>Student Rush:</strong> Heavily discounted tickets for students one hour before curtain time</li>
                <li><strong>Pay-What-You-Can Performances:</strong> Selected performances where attendees can pay according to their means</li>
                <li><strong>Community Access Program:</strong> Free tickets distributed through community organizations to those who otherwise couldn't afford to attend</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Additional Services</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>Priority seating assistance for seniors and mobility-impaired patrons</li>
                <li>Complimentary program guides in large print</li>
                <li>Designated quiet areas for those who may need a break</li>
                <li>Staff assistance for navigating the venue</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
              <p>
                For more information about our programs for privileged categories or to inquire about eligibility:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Call our community access line: (123) 456-7891</li>
                <li>Email: community@theatretix.com</li>
                <li>Visit our box office in person: Monday to Saturday, 10:00 AM - 6:00 PM</li>
              </ul>
              
              <p className="mt-8 italic">
                TheatreTix believes that theater should be accessible to all, regardless of economic or social circumstances. Our programs for privileged categories of citizens reflect our commitment to this core value.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privileged;
