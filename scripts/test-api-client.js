#!/usr/bin/env node

/**
 * API Client Test Script
 * Tests both Kong and Proxy modes for API connectivity
 */

const { execSync } = require('child_process');

function testApiEndpoint(baseUrl, mode) {
  console.log(`\n🧪 Testing ${mode} mode with base URL: ${baseUrl}`);

  try {
    const command = `curl -s -w "\\nHTTP_STATUS:%{http_code}" -H "Content-Type: application/json" ${baseUrl}/health/ready`;
    const output = execSync(command, { encoding: 'utf8', timeout: 5000 });

    const lines = output.trim().split('\n');
    const responseBody = lines.slice(0, -1).join('\n');
    const statusLine = lines[lines.length - 1];
    const statusCode = statusLine.split(':')[1];

    if (statusCode === '200') {
      console.log(`✅ ${mode} mode: SUCCESS`);
      console.log(`   Status: ${statusCode}`);
      console.log(`   Response: ${responseBody}`);
      return true;
    } else {
      console.log(`❌ ${mode} mode: FAILED`);
      console.log(`   Status: ${statusCode}`);
      console.log(`   Response: ${responseBody}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${mode} mode: FAILED`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 API Client Configuration Test');
  console.log('================================');

  // Test Proxy mode (Next.js proxy route)
  const proxyUrl = 'http://localhost:3000/api/proxy';
  testApiEndpoint(proxyUrl, 'Next.js Proxy');

  // Test Kong mode
  const kongUrl = 'http://localhost:8001/api';
  testApiEndpoint(kongUrl, 'Kong Gateway');

  console.log('\n📋 Environment Variables for Frontend:');
  console.log('   USE_KONG=false (default): Uses /api/proxy (Next.js proxy route)');
  console.log('   USE_KONG=true: Uses http://localhost:8001/api (Kong Gateway)');
  console.log('   NEXT_PUBLIC_KONG_URL: Override Kong URL (optional)');
  console.log('   NEXT_PUBLIC_PROXY_URL: Override proxy URL (optional)');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testApiEndpoint };