#!/usr/bin/env node

/**
 * Test SOP API Methods
 * 
 * This script verifies that all 15 SOP API methods have been successfully
 * added to the governance API client.
 * 
 * Usage: node scripts/test-sop-apis.js
 */

const fs = require('fs');
const path = require('path');

const GOVERNANCE_FILE = path.join(__dirname, '../frontend/src/lib/api/governance.ts');

// All expected API methods
const EXPECTED_METHODS = [
  // Phase 1 - Versions (3 methods)
  'getSOPVersions',
  'approveSOPVersion',
  'rejectSOPVersion',
  
  // Phase 1 - Schedules (4 methods)
  'getSOPSchedules',
  'createSOPSchedule',
  'updateSOPSchedule',
  'deleteSOPSchedule',
  
  // Phase 2 - Feedback (3 methods)
  'getSOPFeedback',
  'createSOPFeedback',
  'deleteSOPFeedback',
  
  // Phase 3 - Assignments (3 methods)
  'getSOPAssignments',
  'createSOPAssignment',
  'deleteSOPAssignment',
  
  // Phase 3 - Helpers (2 methods)
  'getUsers',
  'getRoles',
];

// Read the governance file
try {
  const content = fs.readFileSync(GOVERNANCE_FILE, 'utf8');
  
  console.log('\n🧪 SOP API Methods Test\n');
  console.log('=' .repeat(60));
  
  let passCount = 0;
  let failCount = 0;
  
  // Check each method
  EXPECTED_METHODS.forEach((methodName) => {
    const methodPattern = new RegExp(`${methodName}\\s*:\\s*async`);
    const found = methodPattern.test(content);
    
    if (found) {
      console.log(`✅ ${methodName}`);
      passCount++;
    } else {
      console.log(`❌ ${methodName}`);
      failCount++;
    }
  });
  
  console.log('=' .repeat(60));
  console.log(`\nResults: ${passCount}/${EXPECTED_METHODS.length} methods found\n`);
  
  if (failCount === 0) {
    console.log('🎉 SUCCESS! All API methods have been implemented.\n');
    console.log('Next steps:');
    console.log('  1. Start the frontend: cd frontend && npm run dev');
    console.log('  2. Navigate to a SOP detail page');
    console.log('  3. Test the Versions, Reviews, and Feedback tabs');
    console.log('  4. Open browser DevTools console and test API methods');
    process.exit(0);
  } else {
    console.log(`❌ FAILED: ${failCount} methods are missing!\n`);
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error reading governance.ts:', error.message);
  process.exit(1);
}
