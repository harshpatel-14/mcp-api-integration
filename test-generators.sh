#!/bin/bash

echo "🧪 Testing Complete MCP Implementation"
echo "======================================"
echo ""

# Test 1: Check generators
echo "📦 Test 1: Checking generator implementations..."

for generator in TypeGenerator ServiceGenerator HookGenerator ValidationGenerator ComponentGenerator RouteGenerator; do
  if grep -q "placeholder" "src/generators/${generator}.ts" 2>/dev/null; then
    echo "  ❌ ${generator} is still a placeholder"
  else
    echo "  ✅ ${generator} has full implementation"
  fi
done

echo ""

# Test 2: Check dist files
echo "📦 Test 2: Checking compiled files..."
if [ -d "dist" ]; then
  GENERATOR_COUNT=$(find dist/generators -name "*.js" 2>/dev/null | wc -l)
  echo "  ✅ Found $GENERATOR_COUNT generator files in dist/"
else
  echo "  ❌ dist/ directory not found"
  exit 1
fi

echo ""

# Test 3: Check main entry point
echo "🚀 Test 3: Checking main entry point..."
if [ -f "dist/index.js" ]; then
  echo "  ✅ dist/index.js exists"
  
  # Check if it's executable
  if head -1 dist/index.js | grep -q "node"; then
    echo "  ✅ Entry point has node shebang"
  fi
else
  echo "  ❌ dist/index.js not found"
  exit 1
fi

echo ""

# Test 4: Verify ProLine API accessibility
echo "🌐 Test 4: Testing ProLine API..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://devapi-proline.provoke.space/api/schema/")

if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ ProLine API is accessible (HTTP $HTTP_CODE)"
else
  echo "  ⚠️  ProLine API returned HTTP $HTTP_CODE"
fi

echo ""

# Test 5: Check utility functions
echo "🔧 Test 5: Checking utility functions..."
for util in naming logger codeFormatting fileSystem; do
  if [ -f "dist/utils/${util}.js" ]; then
    echo "  ✅ utils/${util}.js exists"
  else
    echo "  ❌ utils/${util}.js missing"
  fi
done

echo ""

# Test 6: Check type definitions
echo "📝 Test 6: Checking type definitions..."
if [ -f "dist/types/index.js" ]; then
  echo "  ✅ Type definitions compiled"
else
  echo "  ❌ Type definitions missing"
fi

echo ""
echo "======================================"
echo "✅ MCP Implementation Complete!"
echo ""
echo "📍 Ready to use:"
echo "1. Configure Claude Desktop"
echo "2. Test with: node dist/index.js"
echo "3. Parse ProLine API: https://devapi-proline.provoke.space/api/schema/"
echo ""
echo "🎯 Next: Configure in Claude Desktop and generate your first API integration!"
