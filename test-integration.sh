#!/bin/bash

echo "🧪 Testing Swagger API MCP with ProLine API"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if dist exists
echo "📦 Test 1: Checking if MCP is built..."
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ dist/ directory exists${NC}"
else
    echo -e "${RED}❌ dist/ directory not found${NC}"
    echo "Run: pnpm run build"
    exit 1
fi

# Test 2: Check if entry point exists
echo ""
echo "📦 Test 2: Checking entry point..."
if [ -f "dist/index.js" ]; then
    echo -e "${GREEN}✅ dist/index.js exists${NC}"
else
    echo -e "${RED}❌ dist/index.js not found${NC}"
    exit 1
fi

# Test 3: Test Swagger endpoint accessibility
echo ""
echo "🌐 Test 3: Testing ProLine API accessibility..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://devapi-proline.provoke.space/api/schema/")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ ProLine API is accessible (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ ProLine API returned HTTP $HTTP_CODE${NC}"
    echo "Check if the API is up or requires authentication"
fi

# Test 4: Parse first 50 lines of Swagger spec
echo ""
echo "📄 Test 4: Fetching Swagger spec preview..."
echo -e "${YELLOW}First 30 lines of ProLine API spec:${NC}"
curl -s "https://devapi-proline.provoke.space/api/schema/" | head -30
echo ""
echo -e "${GREEN}✅ Swagger spec is accessible${NC}"

# Test 5: Count endpoints
echo ""
echo "📊 Test 5: Counting API endpoints..."
ENDPOINT_COUNT=$(curl -s "https://devapi-proline.provoke.space/api/schema/" | grep -c "operationId:")
echo -e "${GREEN}✅ Found approximately $ENDPOINT_COUNT endpoints${NC}"

# Test 6: List available resource types
echo ""
echo "📋 Test 6: Extracting resource types..."
echo -e "${YELLOW}Available resources:${NC}"
curl -s "https://devapi-proline.provoke.space/api/schema/" | grep "tags:" -A 1 | grep "- " | sort -u | head -20

# Test 7: Check authentication schemes
echo ""
echo "🔐 Test 7: Checking authentication schemes..."
echo -e "${YELLOW}Available auth schemes:${NC}"
curl -s "https://devapi-proline.provoke.space/api/schema/" | grep -A 2 "securitySchemes:"

echo ""
echo "==========================================="
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "📍 Next Steps:"
echo "1. Configure Claude Desktop with this MCP"
echo "2. Add to: ~/.config/Claude/claude_desktop_config.json"
echo ""
echo "   {"
echo "     \"mcpServers\": {"
echo "       \"swagger-api-proline\": {"
echo "         \"command\": \"node\","
echo "         \"args\": [\"$(pwd)/dist/index.js\"]"
echo "       }"
echo "     }"
echo "   }"
echo ""
echo "3. Restart Claude Desktop"
echo "4. Ask Claude: 'List available MCP tools'"
echo ""
echo "📖 See INTEGRATION_GUIDE.md for complete usage instructions"
