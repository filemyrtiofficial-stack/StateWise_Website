/**
 * Frontend Connection Test Script
 * Tests frontend-backend connection from frontend perspective
 */

// Determine API URLs based on environment
const getApiBaseUrl = () => {
  if (process.env.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL;
  }
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction
    ? 'https://rtionlinedelhi.filemyrti.com/api/v1'
    : 'http://localhost:5000/api/v1';
};

const getBaseUrl = () => {
  if (process.env.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  }
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction
    ? 'https://rtionlinedelhi.filemyrti.com'
    : 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();
const HEALTH_URL = `${getBaseUrl()}/health`;

async function testConnection(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: response.ok,
      status: response.status,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🧪 Frontend-Backend Connection Test\n');
  console.log('='.repeat(50));
  console.log('');

  const results = {
    backend: false,
    health: false,
    services: false,
    states: false,
    cors: false,
    submission: false
  };

  // Test 1: Backend Health Check
  console.log('1️⃣ Testing Backend Health Endpoint...');
  const healthTest = await testConnection(HEALTH_URL);
  if (healthTest.success) {
    console.log('   ✅ Backend is reachable');
    console.log(`   Response: ${healthTest.data.message || 'OK'}`);
    results.backend = true;
    results.health = true;
  } else {
    console.log('   ❌ Backend is NOT reachable');
    console.log(`   Error: ${healthTest.error || `Status ${healthTest.status}`}`);
    console.log('   💡 Make sure backend is running: cd Backend && npm run dev');
    return results;
  }
  console.log('');

  // Test 2: CORS Configuration
  console.log('2️⃣ Testing CORS Configuration...');
  if (healthTest.headers['access-control-allow-origin']) {
    console.log('   ✅ CORS is configured');
    console.log(`   Allowed Origin: ${healthTest.headers['access-control-allow-origin']}`);
    results.cors = true;
  } else {
    console.log('   ⚠️  CORS headers not found (might still work)');
  }
  console.log('');

  // Test 3: Services API
  console.log('3️⃣ Testing Services API...');
  const servicesTest = await testConnection(`${API_BASE_URL}/services`);
  if (servicesTest.success) {
    console.log('   ✅ Services API working');
    console.log(`   Found ${servicesTest.data?.data?.length || 0} services`);
    results.services = true;
  } else {
    console.log(`   ⚠️  Services API: ${servicesTest.status} ${servicesTest.error || ''}`);
    if (servicesTest.data?.message) {
      console.log(`   Error: ${servicesTest.data.message}`);
    }
  }
  console.log('');

  // Test 4: States API
  console.log('4️⃣ Testing States API...');
  const statesTest = await testConnection(`${API_BASE_URL}/states`);
  if (statesTest.success) {
    console.log('   ✅ States API working');
    console.log(`   Found ${statesTest.data?.data?.length || 0} states`);
    results.states = true;
  } else {
    console.log(`   ⚠️  States API: ${statesTest.status} ${statesTest.error || ''}`);
  }
  console.log('');

  // Test 5: RTI Application Submission
  console.log('5️⃣ Testing RTI Application Submission...');
  const testSubmission = {
    service_id: 1,
    state_id: 1,
    full_name: 'Frontend Test User',
    mobile: '9876543210',
    email: 'frontend-test@example.com',
    rti_query: 'This is a test submission from frontend connection test.',
    address: '123 Test Street, Test City, Test State',
    pincode: '123456'
  };

  const submissionTest = await testConnection(
    `${API_BASE_URL}/rti-applications/public`,
    {
      method: 'POST',
      body: JSON.stringify(testSubmission)
    }
  );

  if (submissionTest.success) {
    console.log('   ✅ Form submission working!');
    console.log(`   Application ID: ${submissionTest.data?.data?.id || 'N/A'}`);
    results.submission = true;
  } else {
    console.log(`   ❌ Submission failed: ${submissionTest.status || 'Error'}`);
    if (submissionTest.data?.message) {
      console.log(`   Error: ${submissionTest.data.message}`);
    }
    if (submissionTest.error) {
      console.log(`   Error: ${submissionTest.error}`);
    }
  }
  console.log('');

  // Summary
  console.log('='.repeat(50));
  console.log('📊 Test Summary:');
  console.log('');
  console.log(`   Backend Reachable:  ${results.backend ? '✅' : '❌'}`);
  console.log(`   Health Endpoint:    ${results.health ? '✅' : '❌'}`);
  console.log(`   CORS Configured:    ${results.cors ? '✅' : '❌'}`);
  console.log(`   Services API:       ${results.services ? '✅' : '❌'}`);
  console.log(`   States API:         ${results.states ? '✅' : '❌'}`);
  console.log(`   Form Submission:   ${results.submission ? '✅' : '❌'}`);
  console.log('');

  const allPassed = Object.values(results).every(r => r === true);

  if (allPassed) {
    console.log('🎉 All tests passed! Frontend can connect to backend!');
    console.log('');
    console.log('✅ API endpoints are accessible');
    console.log('✅ CORS is properly configured');
    console.log('✅ Form submissions will work');
    console.log('');
    console.log('💡 You can now use the frontend application!');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }

  return results;
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or install node-fetch');
  console.error('💡 Alternatively, test in browser console');
  process.exit(1);
}

runTests().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

