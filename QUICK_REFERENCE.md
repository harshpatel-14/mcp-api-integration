# ProLine API + MCP - Quick Reference Card

## 🚀 Quick Setup (5 Steps)

### 1. MCP Location
```
/home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration
```

### 2. Claude Desktop Config
**File**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "swagger-api-proline": {
      "command": "node",
      "args": [
        "/home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration/dist/index.js"
      ]
    }
  }
}
```

### 3. Restart Claude Desktop

### 4. Test in Claude
```
List all available MCP tools
```

### 5. Generate API Integration
```
Parse ProLine API from: https://devapi-proline.provoke.space/api/schema/
Analyze my project at: /home/harsh/Desktop/projects/test_get_shit_done
Generate complete API integration for Alerts endpoints
```

---

## 📊 ProLine API Info

- **Swagger URL**: `https://devapi-proline.provoke.space/api/schema/`
- **API Version**: v1
- **Platform**: Multi-tenant AI SaaS
- **Endpoints**: ~254 endpoints
- **Auth**: JWT Cookie Auth + JWT Token

### Available Resources

Your ProLine API includes these main resources:

1. **Alerts** - `/api/v1/alerts/`
2. **Tenants** - `/api/v1/tenants/`
3. **Users** - `/api/v1/users/`
4. **Subscriptions** - `/api/v1/subscriptions/`
5. **Workspaces** - `/api/v1/workspaces/`
6. **Tasks** - `/api/v1/tasks/`
7. **Videos** - `/api/v1/videos/`
8. **AI Models** - `/api/v1/ai-models/`
9. And many more...

---

## 💬 Example Claude Commands

### Generate Everything for One Resource

```
I want to integrate the Alerts API from ProLine.

1. Parse: https://devapi-proline.provoke.space/api/schema/
2. Project: /home/harsh/Desktop/projects/test_get_shit_done
3. Generate: types, services, hooks, validations, and UI components
4. Resource: Alerts (/api/v1/alerts/)
```

### Generate API Layer Only (No UI)

```
Parse ProLine API (https://devapi-proline.provoke.space/api/schema/)
Analyze: /home/harsh/Desktop/projects/test_get_shit_done
Generate only types, services, and hooks for Tenants
Don't create UI components
```

### Generate Multiple Resources

```
Using ProLine API, generate integration for:
- Alerts (/api/v1/alerts/)
- Tenants (/api/v1/tenants/)
- Users (/api/v1/users/)

Project: /home/harsh/Desktop/projects/test_get_shit_done
Include all: types, services, hooks, validations
```

### Update Existing Endpoint

```
The Alerts endpoint has been updated in ProLine API
Update the types, service, and hook
Project: /home/harsh/Desktop/projects/test_get_shit_done
Endpoint: /api/v1/alerts/
```

---

## 📁 Generated Files Structure

After generation, you'll have:

```
src/
├── types/api/
│   ├── alerts.ts          ✅ TypeScript interfaces
│   ├── tenants.ts
│   └── users.ts
├── api/services/
│   ├── alertsService.ts   ✅ Axios API functions
│   ├── tenantsService.ts
│   └── usersService.ts
├── hooks/api/
│   ├── useAlerts.ts       ✅ TanStack Query hooks
│   ├── useTenants.ts
│   └── useUsers.ts
├── lib/validations/
│   ├── alerts.ts          ✅ Zod schemas
│   ├── tenants.ts
│   └── users.ts
├── pages/
│   ├── alerts/
│   │   ├── index.tsx      ✅ List page
│   │   └── alert-detail.tsx ✅ Detail page
│   └── tenants/
│       └── ...
└── components/
    ├── create-alert-dialog.tsx ✅ Create dialog
    └── ...
```

---

## 🔧 Troubleshooting

### MCP Not Loading

```bash
# Check Claude logs
tail -f ~/.config/Claude/logs/mcp*.log

# Rebuild MCP
cd /home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration
pnpm run build
```

### Test MCP Manually

```bash
cd /home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration
./test-integration.sh
```

### Verify Swagger Access

```bash
curl -v "https://devapi-proline.provoke.space/api/schema/" | head -50
```

---

## ✅ What You Get

### 1. TypeScript Types
- ✅ Full type safety
- ✅ JSDoc comments
- ✅ Enums for status values
- ✅ Request/Response interfaces
- ✅ Pagination types

### 2. API Services
- ✅ Axios integration
- ✅ Error handling
- ✅ Type-safe parameters
- ✅ Proper HTTP methods

### 3. React Query Hooks
- ✅ `useQuery` for GET
- ✅ `useMutation` for POST/PUT/DELETE
- ✅ Cache invalidation
- ✅ Toast notifications
- ✅ 5-minute stale time

### 4. Zod Validation
- ✅ Form validation schemas
- ✅ Min/max constraints from API
- ✅ Type inference
- ✅ Custom error messages

### 5. React Components (Optional)
- ✅ List page with AppTitle
- ✅ Detail page with back button
- ✅ Create dialog with CommonDialog
- ✅ Form with Field components
- ✅ Loading/Error/Empty states

---

## 🎯 Pro Tips

1. **Start Small**: Generate one resource first, test it, then generate more
2. **No UI First**: Generate API layer only, then add UI later if needed
3. **Update Pattern**: When API changes, use "update endpoint" command
4. **Check Generated Code**: Always review generated files before committing
5. **Follow Patterns**: MCP follows your existing code patterns automatically

---

## 📞 Quick Commands

```bash
# Navigate to MCP
cd /home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration

# Rebuild MCP
pnpm run build

# Test integration
./test-integration.sh

# Check Claude config
cat ~/.config/Claude/claude_desktop_config.json

# View Swagger spec
curl https://devapi-proline.provoke.space/api/schema/ | less
```

---

## 🎬 Ready to Use!

Your MCP is ready! Open Claude Desktop and try:

```
Hi! I want to integrate the ProLine API into my React project.
Can you help me generate the API layer for Alerts?

API: https://devapi-proline.provoke.space/api/schema/
Project: /home/harsh/Desktop/projects/test_get_shit_done
```

Claude will handle everything automatically! 🚀
