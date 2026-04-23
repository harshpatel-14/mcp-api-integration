# API MCP

Model Context Protocol server for generating complete API and UI layers from API specifications.

## Features

- **Parse Swagger/OpenAPI specs** from URL or file path
- **Analyze React projects** automatically (Vite, Next.js, CRA)
- **Generate TypeScript types** from OpenAPI schemas
- **Generate API services** with Axios
- **Generate TanStack Query hooks** with caching
- **Generate Zod validations** from constraints
- **Generate React components** (optional)
- **Update routes** automatically

## Installation

### 1. Install Dependencies

```bash
cd /home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration
pnpm install
```

### 2. Build the MCP

```bash
pnpm run build
```

### 3. Configure Claude Desktop

Add to `~/.config/Claude/claude_desktop_config.json`:

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

### 4. Restart Claude Desktop

Close and reopen Claude Desktop completely.

## Usage

### Parse Swagger Specification

```
Parse this Swagger spec: https://jsonplaceholder.typicode.com/swagger.json
```

### Analyze Project

```
Analyze my React project at: /home/harsh/Desktop/projects/test_get_shit_done
```

### Generate API Layer

```
Generate the complete API layer from the parsed spec
Include types, services, hooks, and validations
```

### Generate with UI Components

```
Generate API layer with UI components for the posts resource
```

## Tools Available

1. **parse_swagger_spec** - Parse OpenAPI/Swagger specification
2. **analyze_project** - Analyze React project structure
3. **generate_api_layer** - Generate complete API layer
4. **generate_ui_components** - Generate React UI components
5. **update_routes** - Update React Router configuration

## Example Workflow

```
1. Parse Swagger: https://jsonplaceholder.typicode.com/swagger.json
2. Analyze project: /home/harsh/Desktop/projects/test_get_shit_done
3. Generate API layer from the parsed spec
4. Generate UI components for "posts" resource
5. Update routes for "posts"
```

## Requirements

- Node.js >= 18.0.0
- pnpm (or npm/yarn)
- Claude Desktop

## Development

```bash
# Watch mode
pnpm run dev

# Type check
pnpm run type-check

# Clean build
pnpm run clean
pnpm run build
```

## Generated Files

- `src/types/api/*.ts` - TypeScript interfaces
- `src/api/services/*.ts` - API service functions
- `src/hooks/api/*.ts` - TanStack Query hooks
- `src/lib/validations/*.ts` - Zod schemas
- `src/pages/*/` - React components (optional)
- `src/components/*-dialog.tsx` - Dialog components (optional)

## License

MIT
