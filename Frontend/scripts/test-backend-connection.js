/**
 * Test Backend Connection Script
 * Run this to test if frontend can connect to backend
 * Usage: node scripts/test-backend-connection.js
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HEALTH_URL = 'http://localhost:5000/health';

async function testConnection() {
  console.log('🧪 Testing Frontend-Backend Connection...\n');
  console.log('📍 Backend URL:', 'http://localhost:5000');
  console.log('📍 API Base URL:', API_BASE_URL);
  console.log('📍 Health Check URL:', HEALTH_URL);
  console.log('');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Endpoint...');
  try {
    const healthResponse = await fetch(HEALTH_URL);
    const healthData = await healthResponse.json();

    if (healthResponse.ok) {
      console.log('   ✅ Health check successful!');
      console.log('   Response:', healthData);
    } else {
      console.log('   ❌ Health check failed with status:', healthResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Health check failed:', error.message);
    console.log('   💡 Make sure backend server is running on port 5000');
    return;
  }

  console.log('');

  // Test 2: CORS
  console.log('2️⃣ Testing CORS Configuration...');
  try {
    const corsResponse = await fetch(HEALTH_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });

    if (corsResponse.ok) {
      console.log('   ✅ CORS is properly configured!');
      console.log('   CORS Headers:', {
        'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods')
      });
    } else {
      console.log('   ⚠️ CORS test returned status:', corsResponse.status);
    }
  } catch (error) {
    console.log('   ❌ CORS test failed:', error.message);
  }

  console.log('');

  // Test 3: API Endpoint
  console.log('3️⃣ Testing API Endpoint...');
  try {
    const apiResponse = await fetch(`${API_BASE_URL}/services`);

    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log('   ✅ API endpoint accessible!');
      console.log('   Response structure:', {
        success: apiData.success,
        message: apiData.message,
        hasData: !!apiData.data
      });
    } else {
      console.log('   ⚠️ API endpoint returned status:', apiResponse.status);
      const errorData = await apiResponse.json().catch(() => ({}));
      console.log('   Error:', errorData);
    }
  } catch (error) {
    console.log('   ❌ API endpoint test failed:', error.message);
  }

  console.log('\n✅ Connection test completed!');
  console.log('\n💡 Next Steps:');
  console.log('   1. If all tests passed, frontend-backend connection is working');
  console.log('   2. If tests failed, check:');
  console.log('      - Backend server is running (npm run dev in Backend folder)');
  console.log('      - Backend is on port 5000');
  console.log('      - CORS is configured correctly in backend');
  console.log('      - No firewall blocking the connection');
}

// Run the test
testConnection().catch(console.error);

