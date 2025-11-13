/**
 * Testimonials Component
 * Displays customer testimonials
 */

import React from 'react';
import { Testimonial } from '../../types/services';

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    initials: 'RK',
    location: 'Delhi',
    rating: 5,
    comment: 'Excellent service! They filed my RTI application quickly and I received the information I needed within 30 days. Highly recommended!'
  },
  {
    id: '2',
    name: 'Priya Mehta',
    initials: 'PM',
    location: 'Mumbai',
    rating: 5,
    comment: 'Professional and efficient. The team helped me file multiple RTI applications and I got all the information I needed. Great experience!'
  },
  {
    id: '3',
    name: 'Amit Sharma',
    initials: 'AS',
    location: 'Bangalore',
    rating: 5,
    comment: 'Very satisfied with the service. They made the entire RTI filing process so simple and I received timely updates throughout.'
  },
  {
    id: '4',
    name: 'Sunita Devi',
    initials: 'SD',
    location: 'Hyderabad',
    rating: 5,
    comment: 'Outstanding support! The team was very helpful and guided me through every step. Got my information quickly and efficiently.'
  }
];

export const Testimonials: React.FC = React.memo(() => {
  return (
    <div className="rounded-lg shadow-lg border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-primary-600">{testimonial.initials}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex mb-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 italic">"{testimonial.comment}"</p>
          </div>
        ))}
      </div>

      {/* Customer Testimonial Image */}
      <div className="mt-8">
        <img
          src="/images/15minTESTI.webp"
          alt="Customer Testimonials"
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

Testimonials.displayName = 'Testimonials';

