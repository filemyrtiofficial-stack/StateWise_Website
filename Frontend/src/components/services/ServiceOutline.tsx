/**
 * Service Outline Component
 * Displays service details with success rate visualization
 */

import React from 'react';
import { SUCCESS_RATE } from '../../constants/services';

export const ServiceOutline: React.FC = React.memo(() => {
  const circumference = 2 * Math.PI * 55;
  const filledLength = circumference * (SUCCESS_RATE / 100);

  return (
    <div className="rounded-lg shadow-lg border border-gray-200 p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
      {/* Title with underline */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Service Outline</h2>
        <div className="h-1 bg-primary-600 w-48 rounded"></div>
      </div>

      {/* Descriptive paragraph */}
      <p className="text-gray-700 text-base mb-8 leading-relaxed">
        Our comprehensive service is designed to transform your RTI filing experience, guiding you step-by-step to gain confidence and acquire the information you need. We don't just provide filing services; we provide a strategic roadmap to help you achieve your goals.
      </p>

      {/* Ready to Ace Section with Pie Chart */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        {/* Pie Chart */}
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r="55"
              fill="none"
              stroke="#e6f2fa"
              strokeWidth="24"
            />
            {/* Filled arc */}
            <circle
              cx="70"
              cy="70"
              r="55"
              fill="none"
              stroke="#026CB6"
              strokeWidth="24"
              strokeDasharray={`${filledLength} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>
          {/* Success rate text */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <span className="text-white font-bold text-xl bg-primary-600 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
              {SUCCESS_RATE}%
            </span>
          </div>
          {/* Arrow and label */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 mt-2">
            <div className="flex flex-col items-center gap-1">
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-t-primary-600"></div>
              <span className="text-xs text-gray-600 whitespace-nowrap font-medium">Success Rate</span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-gray-900 mb-4">READY TO ACE YOUR RTI FILING</h4>
          <div className="bg-primary-600 rounded-lg px-6 py-3 inline-block">
            <span className="text-white font-semibold text-lg">HERE'S WHAT YOU GET</span>
          </div>
        </div>
      </div>

      {/* What You Get Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Card 1 - Expert Drafting */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h5 className="font-semibold text-gray-900 text-lg mb-2">Expert RTI Drafting</h5>
          <p className="text-gray-600 text-sm">
            Professional RTI applications drafted by legal experts ensuring full compliance with RTI Act 2005 guidelines and best practices.
          </p>
        </div>

        {/* Card 2 - Application Tracking */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h5 className="font-semibold text-gray-900 text-lg mb-2">Real-time Application Tracking</h5>
          <p className="text-gray-600 text-sm">
            Track your RTI application status in real-time with instant notifications and regular updates on submission and response progress.
          </p>
        </div>

        {/* Card 3 - Authority Verification */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h5 className="font-semibold text-gray-900 text-lg mb-2">Verified Authority Submission</h5>
          <p className="text-gray-600 text-sm">
            We verify and submit your RTI to the correct public authority with all required documentation, ensuring proper channel compliance.
          </p>
        </div>
      </div>

      {/* Demo Image */}
      <div className="mt-8">
        <img
          src="/images/Demo.webp"
          alt="Service Demo"
          className="w-full h-auto rounded-lg shadow-md"
          style={{ objectFit: 'contain' }}
          draggable="false"
          loading="lazy"
          width="800"
          height="600"
          decoding="async"
        />
      </div>
    </div>
  );
});

ServiceOutline.displayName = 'ServiceOutline';

