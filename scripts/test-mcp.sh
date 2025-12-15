#!/bin/bash

# Test script for Next.js MCP configuration
# This script verifies that MCP is properly configured

echo "🔍 Testing Next.js MCP Configuration"
echo "===================================="
echo ""

# Check if .mcp.json exists
if [ -f ".mcp.json" ]; then
    echo "✅ .mcp.json file exists"
    cat .mcp.json | jq '.' 2>/dev/null || cat .mcp.json
    echo ""
else
    echo "❌ .mcp.json file not found"
    exit 1
fi

# Check Next.js version
echo "📦 Checking Next.js version..."
cd frontend 2>/dev/null || exit 1
NEXT_VERSION=$(npm list next 2>/dev/null | grep 'next@' | sed -E 's/.*next@([0-9]+\.[0-9]+\.[0-9]+).*/\1/' | head -1)
echo "   Next.js version: $NEXT_VERSION"

if [ -z "$NEXT_VERSION" ]; then
    echo "❌ Could not determine Next.js version"
    exit 1
fi

# Check if version is 16+
MAJOR_VERSION=$(echo $NEXT_VERSION | cut -d. -f1)
if [ "$MAJOR_VERSION" -ge 16 ]; then
    echo "✅ Next.js version is compatible (16+)"
else
    echo "❌ Next.js version must be 16 or higher (current: $NEXT_VERSION)"
    exit 1
fi

echo ""

# Check if dev server is running
echo "🌐 Checking dev server status..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Dev server is running on port 3000"
    DEV_SERVER_RUNNING=true
else
    echo "⚠️  Dev server is not running on port 3000"
    echo "   Start it with: cd frontend && npm run dev"
    DEV_SERVER_RUNNING=false
fi

echo ""

# Summary
echo "📊 Configuration Summary"
echo "======================"
echo "✅ MCP configuration file: Present"
echo "✅ Next.js version: $NEXT_VERSION (Compatible)"
if [ "$DEV_SERVER_RUNNING" = true ]; then
    echo "✅ Dev server: Running"
    echo ""
    echo "🎉 MCP is configured and ready!"
    echo ""
    echo "To test MCP, ask your AI assistant:"
    echo "  'What errors are currently in my Next.js application?'"
    echo "  'Show me all routes in my application'"
    echo "  'What components are used in the dashboard page?'"
else
    echo "⚠️  Dev server: Not running"
    echo ""
    echo "⚠️  Start the dev server to enable MCP:"
    echo "   cd frontend && npm run dev"
fi

echo ""
echo "📚 Documentation:"
echo "  - Quick Start: docs/MCP_QUICK_START.md"
echo "  - Full Plan: docs/NEXTJS_MCP_INTEGRATION_PLAN.md"
echo "  - Summary: docs/MCP_IMPLEMENTATION_SUMMARY.md"

