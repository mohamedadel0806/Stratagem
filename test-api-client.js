#!/usr/bin/env node

// Test script for configurable API client (Kong vs Proxy)

// Simulate environment variables
const USE_KONG = process.env.USE_KONG === 'true';
const API_BASE_URL = USE_KONG
  ? 'http://localhost:8001'  // Kong proxy
  : 'http://localhost:3000/api/proxy'; // Frontend proxy

console.log('🔧 API Client Configuration Test');
console.log('================================');
console.log(`USE_KONG: ${USE_KONG}`);
console.log(`API_BASE_URL: ${API_BASE_URL}`);
console.log();

// Test endpoints
const endpoints = [
  '/health/ready',
  '/dashboard/overview',
  '/notifications/unread-count'
];

async function testEndpoint(endpoint) {
  const url = USE_KONG
    ? `${API_BASE_URL}/api${endpoint}`  // Kong: /api/health/ready
    : `${API_BASE_URL}${endpoint}`;     // Proxy: /api/proxy/health/ready

  console.log(`Testing: ${endpoint}`);
  console.log(`URL: ${url}`);

  try {
    const response = await fetch(url);
    const status = response.status;
    const text = await response.text();

    console.log(`Status: ${status}`);
    console.log(`Response: ${text.substring(0, 100)}...`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
  console.log('---');
}

async function runTests() {
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
}

runTests().catch(console.error);