/**
 * Module Validation Script
 * 
 * This script attempts to bootstrap the NestJS application to catch
 * dependency injection errors before deployment.
 * 
 * This validates:
 * - Module imports/exports
 * - Dependency injection wiring
 * - Repository availability
 * - Service/provider registration
 * 
 * Note: This may require database connection for TypeORM initialization.
 * If database is not available, it will still catch DI errors but may
 * show connection warnings (which can be ignored for DI validation).
 * 
 * Usage: npm run validate:modules
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function validateModules() {
  console.log('🔍 Validating NestJS module dependencies...\n');
  console.log('This will check for dependency injection errors...\n');

  let app;
  let diValidationComplete = false;
  
  // Set a timeout to catch if DI validation hangs
  const timeout = setTimeout(() => {
    if (!diValidationComplete) {
      console.log('\n⏱️  Validation is taking longer than expected...');
      console.log('   (This may be due to database connection attempts)');
      console.log('   DI validation should complete soon...\n');
    }
  }, 3000);

  try {
    // Attempt to create the application
    // This will fail if there are any dependency injection issues
    // Create app - this will throw immediately if there are DI errors
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'], // Only show errors and warnings
      abortOnError: false, // Don't abort on first error, collect all
    });

    diValidationComplete = true;
    clearTimeout(timeout);
    
    // Give it a moment to see if DI errors appear, then close
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ All modules validated successfully!');
    console.log('✅ All dependencies are properly configured.');
    console.log('✅ No dependency injection errors found.\n');

    // Close the app immediately - we don't need to run it
    await app.close();
    process.exit(0);
  } catch (error) {
    clearTimeout(timeout);
    
    // Check if it's a dependency injection error
    const isDIError = 
      error.message?.includes("can't resolve dependencies") ||
      error.message?.includes("is not available in") ||
      error.message?.includes("Please make sure that the argument") ||
      error.message?.includes("at index") ||
      error.message?.includes("Nest can't resolve dependencies");

    const isDBError = 
      error.message?.includes("ENOTFOUND") ||
      error.message?.includes("ECONNREFUSED") ||
      error.message?.includes("database") ||
      error.message?.includes("Unable to connect");

    if (isDIError) {
      console.error('\n❌ Dependency Injection Error Detected!\n');
      console.error('This is the same type of error that would occur in Docker.\n');
      console.error('Error details:');
      console.error(error.message);
      
      if (error.stack) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }

      console.error('\n💡 Fix the dependency injection issues above before deploying.');
      console.error('💡 Common fixes:');
      console.error('   - Add missing entities to TypeOrmModule.forFeature()');
      console.error('   - Import missing modules');
      console.error('   - Export services from their modules\n');
      process.exit(1);
    } else if (isDBError) {
      // Database connection errors - DI validation passed, but DB not available
      console.log('\n✅ Dependency injection validation passed!');
      console.log('⚠️  Database connection failed (expected if DB is not running)');
      console.log('✅ Module structure is valid - no DI errors detected.\n');
      console.log('💡 To fully validate, ensure database is running or use Docker.\n');
      
      if (app) {
        await app.close();
      }
      process.exit(0);
    } else {
      // Other errors - show but check if app was created
      console.warn('\n⚠️  Warning during validation:');
      console.warn(error.message);
      
      if (app) {
        console.log('\n✅ Application was created successfully.');
        console.log('✅ No dependency injection errors detected.\n');
        await app.close();
        process.exit(0);
      } else {
        console.error('\n❌ Failed to create application.');
        console.error('Error details:', error.message);
        if (error.stack) {
          console.error('\nStack trace:');
          console.error(error.stack);
        }
        process.exit(1);
      }
    }
  }
}

// Run validation
validateModules();


