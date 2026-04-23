# Swagger API MCP - Quick Start

## Build and Install

```bash
# Navigate to MCP directory
cd /home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration

# Run build script
chmod +x build.sh
./build.sh
```

## Configure Claude Desktop

Edit: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "swagger-api": {
      "command": "node",
      "args": [
        "/home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration/dist/index.js"
      ]
    }
  }
}
```

## Test the MCP

Restart Claude Desktop, then ask:

```
Can you list the MCP tools available?
```

You should see:
- parse_swagger_spec
- analyze_project
- generate_api_layer
- generate_ui_components
- update_routes

## Example Usage

```
1. Parse this Swagger spec: https://jsonplaceholder.typicode.com/swagger.json

2. Analyze my project at: /home/harsh/Desktop/projects/test_get_shit_done

3. Generate the API layer with types, services, hooks, and validations
```

## Troubleshooting

### MCP not loading?
- Check the absolute path in config
- Restart Claude Desktop completely
- Check logs: `~/.config/Claude/logs/mcp*.log`

### Build errors?
- Run: `pnpm install --force`
- Run: `pnpm run clean && pnpm run build`

### Permission errors?
- Run: `chmod +x dist/index.js`
