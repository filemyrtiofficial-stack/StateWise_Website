import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LazyChatbot } from '../components/common/LazyChatbot';
import { careersAPI } from '../services/api';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  description: string;
  requirements: string[];
  responsibilities: string[];
}

export const Careers: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    resume: null as File | null,
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [resumeError, setResumeError] = useState<string>('');

  const jobOpenings: JobOpening[] = [
    {
      id: '1',
      title: 'RTI Filing Specialist',
      department: 'Operations',
      location: 'Hyderabad, India',
      type: 'Full-time',
      description: 'We are looking for an experienced RTI Filing Specialist to help our clients file Right to Information applications. You will be responsible for drafting RTI applications, identifying correct authorities, and ensuring timely submissions.',
      requirements: [
        'Bachelor\'s degree in Law, Public Administration, or related field',
        '2+ years of experience in RTI filing or legal documentation',
        'Strong understanding of the Right to Information Act, 2005',
        'Excellent written and verbal communication skills',
        'Attention to detail and ability to work under deadlines'
      ],
      responsibilities: [
        'Draft professional RTI applications based on client requirements',
        'Identify the correct public authority for each RTI application',
        'Review and ensure all applications meet legal requirements',
        'Coordinate with government departments for submissions',
        'Track application status and provide updates to clients'
      ]
    },
    {
      id: '2',
      title: 'Customer Support Executive',
      department: 'Customer Service',
      location: 'Hyderabad, India',
      type: 'Full-time',
      description: 'Join our customer support team to help clients with their RTI filing needs. You will handle inquiries, provide guidance, and ensure excellent customer satisfaction.',
      requirements: [
        'Bachelor\'s degree in any field',
        '1+ years of experience in customer support',
        'Excellent communication skills in English and Hindi',
        'Patient and empathetic approach to customer service',
        'Basic knowledge of RTI process is a plus'
      ],
      responsibilities: [
        'Respond to customer inquiries via phone, email, and chat',
        'Guide customers through the RTI filing process',
        'Resolve customer issues and complaints',
        'Maintain customer records and update status',
        'Provide regular updates to customers about their applications'
      ]
    },
    {
      id: '3',
      title: 'Frontend Developer',
      department: 'Technology',
      location: 'Hyderabad, India / Remote',
      type: 'Full-time',
      description: 'We are seeking a skilled Frontend Developer to enhance our web platform and create exceptional user experiences for our RTI filing service.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '2+ years of experience in frontend development',
        'Proficiency in React, TypeScript, and modern CSS',
        'Experience with responsive design and mobile-first approach',
        'Strong problem-solving skills and attention to detail'
      ],
      responsibilities: [
        'Develop and maintain responsive web applications',
        'Implement new features and improve user experience',
        'Collaborate with backend developers and designers',
        'Write clean, maintainable, and well-documented code',
        'Optimize applications for performance and SEO'
      ]
    },
    {
      id: '4',
      title: 'Legal Research Intern',
      department: 'Legal',
      location: 'Hyderabad, India',
      type: 'Internship',
      description: 'Great opportunity for law students to gain hands-on experience in RTI filing and legal research. This internship will provide valuable insights into public information access and legal documentation.',
      requirements: [
        'Currently pursuing LLB or LLM degree',
        'Strong research and analytical skills',
        'Interest in public information and transparency',
        'Good written communication skills',
        'Available for 3-6 months'
      ],
      responsibilities: [
        'Research RTI-related legal precedents and cases',
        'Assist in drafting RTI applications',
        'Help maintain legal documentation and resources',
        'Support the legal team with various projects',
        'Learn about RTI filing processes and best practices'
      ]
    }
  ];

  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Competitive Salary',
      description: 'We offer competitive compensation packages based on experience and skills.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Learning & Development',
      description: 'Continuous learning opportunities and professional development programs.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Work-Life Balance',
      description: 'Flexible working hours and remote work options where applicable.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Growth Opportunities',
      description: 'Clear career progression paths and opportunities for advancement.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Great Culture',
      description: 'Collaborative, inclusive, and supportive work environment.'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError('');
    const fileInput = e.target;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        setResumeError('Please upload a PDF, DOC, or DOCX file.');
        fileInput.value = ''; // Clear the input
        setApplicationForm(prev => ({ ...prev, resume: null }));
        setResumeFileName('');
        return;
      }

      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setResumeError('File size must be less than 5MB.');
        fileInput.value = ''; // Clear the input
        setApplicationForm(prev => ({ ...prev, resume: null }));
        setResumeFileName('');
        return;
      }

      // File is valid
      setApplicationForm(prev => ({ ...prev, resume: file }));
      setResumeFileName(file.name);
    } else {
      setApplicationForm(prev => ({ ...prev, resume: null }));
      setResumeFileName('');
    }
  };

  const validateForm = (): boolean => {
    setValidationError('');

    if (!applicationForm.name.trim()) {
      setValidationError('Please enter your full name');
      return false;
    }
    if (!applicationForm.email.trim()) {
      setValidationError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationForm.email.trim())) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    if (!applicationForm.phone.trim()) {
      setValidationError('Please enter your phone number');
      return false;
    }
    const cleanPhone = applicationForm.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      setValidationError('Phone number must be between 10 and 13 digits');
      return false;
    }
    if (!applicationForm.position.trim()) {
      setValidationError('Please select a position');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Clean phone number (remove non-digits)
      const cleanPhone = applicationForm.phone.replace(/\D/g, '');

      // Prepare data for career API (including resume file)
      const careerData = {
        name: applicationForm.name.trim(),
        email: applicationForm.email.trim().toLowerCase(),
        phone: cleanPhone,
        position: applicationForm.position.trim(),
        coverLetter: applicationForm.coverLetter.trim() || undefined,
        resume: applicationForm.resume || null
      };

      const result = await careersAPI.createPublic(careerData);

      if (result.success) {
        setSubmitStatus('success');
        setApplicationForm({
          name: '',
          email: '',
          phone: '',
          position: '',
          resume: null,
          coverLetter: ''
        });
        setResumeFileName('');
        setResumeError('');

        // Reset file input
        const fileInput = document.getElementById('resume') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }

        // Reset success message after 8 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 8000);
      } else {
        setSubmitStatus('error');
        // Show error message for 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');

      // Show error message with details
      const errorMsg = error.message || 'Failed to submit application. Please try again.';
      console.error('Error details:', errorMsg);

      // Show error message for 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = "Careers - FileMyRTI | Join Our Team";
  const pageDescription = "Join FileMyRTI and help make RTI filing accessible to everyone. Explore career opportunities in operations, customer service, technology, and legal fields.";
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : "https://filemyrti.com/careers";
  const ogImage = "https://filemyrti.com/src/assets/icons/logo.webp";

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Careers - FileMyRTI",
    "description": pageDescription,
    "url": "https://filemyrti.com/careers"
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://filemyrti.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Careers",
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>

      <Navbar />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12 md:py-16 lg:py-20">
            <div className="container-responsive max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                Join Our Team
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto">
                Help us make RTI filing accessible to everyone. Be part of a mission-driven team that empowers citizens with transparency and information.
              </p>
            </div>
          </section>

          {/* Why Join Us Section */}
          <section className="py-12 md:py-16 lg:py-20">
            <div className="container-responsive max-w-7xl mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
                Why Join FileMyRTI?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Career Opportunities Banner - Above Open Positions */}
          <section className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white py-12 md:py-16 lg:py-20 overflow-hidden">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              {/* Grid Pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}></div>
              {/* Document Icons Pattern */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full opacity-20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 60 L160 60 L160 140 L40 140 Z" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
                  <path d="M50 70 L150 70 L150 130 L50 130 Z" stroke="white" strokeWidth="1" fill="none" opacity="0.2" />
                  <path d="M60 80 L140 80 L140 120 L60 120 Z" stroke="white" strokeWidth="1" fill="none" opacity="0.2" />
                </svg>
              </div>
            </div>

            <div className="container-responsive max-w-7xl mx-auto px-4 relative z-10">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 leading-tight">
                  Explore Exciting Career Opportunities And<br />
                  Become Part Of The FileMyRTI.Com Journey.
                </h2>
                <a
                  href="https://www.linkedin.com/company/filemyrti/jobs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 sm:px-8 sm:py-3 border-2 border-white bg-transparent text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl"
                >
                  Click here for Current Openings
                </a>
              </div>
            </div>
          </section>

          {/* Job Openings Section */}
          <section className="py-12 md:py-16 lg:py-20 bg-white">
            <div className="container-responsive max-w-7xl mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
                Open Positions
              </h2>
              <div className="space-y-6">
                {jobOpenings.map((job) => (
                  <div
                    key={job.id}
                    className="bg-gray-50 rounded-xl shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                        className="mt-4 sm:mt-0 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        {selectedJob === job.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>

                    <p className="text-gray-700 mb-4">{job.description}</p>

                    {selectedJob === job.id && (
                      <div className="mt-6 pt-6 border-t border-gray-300 space-y-6">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-3">Key Responsibilities:</h4>
                          <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {job.responsibilities.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-3">Requirements:</h4>
                          <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {job.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <button
                          onClick={() => {
                            setApplicationForm(prev => ({ ...prev, position: job.title }));
                            document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Apply for this Position
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Application Form Section */}
          <section id="application-form" className="py-12 md:py-16 lg:py-20 bg-gray-50">
            <div className="container-responsive max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
                  Apply Now
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={applicationForm.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={applicationForm.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={applicationForm.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                        Position Applied For <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="position"
                        name="position"
                        value={applicationForm.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select a position</option>
                        {jobOpenings.map((job) => (
                          <option key={job.id} value={job.title}>
                            {job.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                      Resume/CV <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                      />
                    </div>
                    {resumeFileName && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Selected: {resumeFileName}
                      </p>
                    )}
                    {resumeError && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {resumeError}
                      </p>
                    )}
                    {!resumeFileName && !resumeError && (
                      <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB). You can also send it later via email.</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={applicationForm.coverLetter}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Tell us why you're interested in this position..."
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg animate-fadeIn">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-green-800 mb-1">
                            Application Submitted Successfully!
                          </p>
                          <p className="text-sm text-green-700">
                            Thank you for your interest! We've received your application and will review it shortly. Our team will get back to you soon via email or phone.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {validationError && (
                    <div className="p-4 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm font-semibold text-yellow-800">
                          {validationError}
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg animate-fadeIn">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            Submission Failed
                          </p>
                          <p className="text-sm text-red-700">
                            Something went wrong while submitting your application. Please check your internet connection and try again, or contact us directly at <a href="mailto:admin@filemyrti.com" className="underline font-semibold">admin@filemyrti.com</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <LazyChatbot />
      </div>
    </>
  );
};

