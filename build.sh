#!/bin/bash

echo "🔨 Building Swagger API MCP..."
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build TypeScript
echo "🔧 Compiling TypeScript..."
pnpm run build

# Make executable
chmod +x dist/index.js

echo ""
echo "✅ Build complete!"
echo ""
echo "📍 Next steps:"
echo "1. Add to Claude Desktop config:"
echo "   ~/.config/Claude/claude_desktop_config.json"
echo ""
echo "2. Add this configuration:"
echo '{'
echo '  "mcpServers": {'
echo '    "swagger-api": {'
echo '      "command": "node",'
echo '      "args": ["'$(pwd)'/dist/index.js"]'
echo '    }'
echo '  }'
echo '}'
echo ""
echo "3. Restart Claude Desktop"
echo ""
