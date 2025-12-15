#!/usr/bin/env node

/**
 * Script to validate that no SelectItem components have empty string values
 * This prevents runtime errors with Radix UI Select components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC_DIR = path.join(__dirname, '../src');
const errors = [];

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Check for SelectItem with empty string value
    if (line.includes('SelectItem')) {
      // Check if this line or nearby lines have value="" or value={""}
      const checkRange = Math.max(0, index - 2);
      const checkEnd = Math.min(lines.length, index + 3);
      const context = lines.slice(checkRange, checkEnd).join('\n');
      
      // Patterns to detect empty string values
      const emptyValuePatterns = [
        /SelectItem[^>]*value=["']{2}/,  // value=""
        /SelectItem[^>]*value=\{\s*["']{2}\s*\}/,  // value={""}
        /SelectItem[^>]*value=\{\s*field\.value\s*\|\|\s*["']{2}\s*\}/,  // value={field.value || ""}
        /SelectItem[^>]*value=\{\s*option\.value\s*\|\|\s*["']{2}\s*\}/,  // value={option.value || ""}
        /\{\s*value:\s*["']{2}\s*,/i,  // { value: "", ... } in options array
      ];
      
      emptyValuePatterns.forEach(pattern => {
        if (pattern.test(context)) {
          errors.push({
            file: filePath,
            line: index + 1,
            context: line.trim(),
          });
        }
      });
    }
  });
}

console.log('🔍 Scanning for SelectItem components with empty string values...\n');

const files = findFiles(SRC_DIR);
files.forEach(checkFile);

if (errors.length > 0) {
  console.error('❌ Found SelectItem components with empty string values:\n');
  errors.forEach(({ file, line, context }) => {
    const relativePath = path.relative(process.cwd(), file);
    console.error(`  ${relativePath}:${line}`);
    console.error(`    ${context}\n`);
  });
  console.error('⚠️  Radix UI Select components do not allow empty string values.');
  console.error('   Use "all" or "none" instead, or filter out empty values.\n');
  process.exit(1);
} else {
  console.log('✅ No SelectItem components with empty string values found.\n');
  process.exit(0);
}

