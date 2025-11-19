/**
 * Connection Test Component
 * Test frontend-backend connection
 */

import React, { useState } from 'react';
import { testBackendConnection, testCORS, ConnectionTestResult } from '../../utils/apiTest';
import { API_ENDPOINTS } from '../../config/api';

export const ConnectionTest: React.FC = () => {
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testBackendConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Test failed',
        details: {
          endpoint: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCORSTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testCORS();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'CORS test failed',
        details: {
          endpoint: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Backend Connection Test</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleTest}
          disabled={isTesting}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
        <button
          onClick={handleCORSTest}
          disabled={isTesting}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isTesting ? 'Testing...' : 'Test CORS'}
        </button>
      </div>

      {testResult && (
        <div className={`p-4 rounded-lg ${testResult.success
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
          }`}>
          <div className="flex items-center gap-2 mb-2">
            {testResult.success ? (
              <span className="text-green-600 text-xl">✅</span>
            ) : (
              <span className="text-red-600 text-xl">❌</span>
            )}
            <span className={`font-semibold ${testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
              {testResult.message}
            </span>
          </div>

          {testResult.details && (
            <div className="text-sm text-gray-700 mt-2">
              <p><strong>Endpoint:</strong> {testResult.details.endpoint}</p>
              {testResult.details.status && (
                <p><strong>Status:</strong> {testResult.details.status}</p>
              )}
              {testResult.details.error && (
                <p className="text-red-600"><strong>Error:</strong> {testResult.details.error}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Note:</strong> Make sure the backend server is running</p>
        <p>Backend URL: <code className="bg-gray-100 px-2 py-1 rounded">{API_ENDPOINTS.HEALTH.replace('/health', '')}</code></p>
      </div>
    </div>
  );
};

