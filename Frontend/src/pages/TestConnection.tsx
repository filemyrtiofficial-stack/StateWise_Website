/**
 * Test Connection Page
 * Test frontend-backend connection
 */

import React from 'react';
import { ConnectionTest } from '../components/common/ConnectionTest';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { API_ENDPOINTS, API_BASE_URL_DISPLAY } from '../config/api';

export const TestConnection: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Backend Connection Test</h1>
          <ConnectionTest />

          <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <h2 className="text-lg font-semibold mb-2">How to Test:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Make sure backend server is running: <code className="bg-gray-100 px-2 py-1 rounded">cd Backend && npm run dev</code></li>
              <li>Click "Test Connection" button above</li>
              <li>If successful, you'll see a green success message</li>
              <li>If failed, check backend server status and CORS configuration</li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h2 className="text-lg font-semibold mb-2">API Endpoints:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Health Check: <code className="bg-gray-100 px-2 py-1 rounded">{API_ENDPOINTS.HEALTH}</code></li>
              <li>API Base: <code className="bg-gray-100 px-2 py-1 rounded">{API_BASE_URL_DISPLAY}</code></li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

