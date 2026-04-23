# Swagger API MCP - Integration Guide

## Your ProLine API Integration

Your Swagger/OpenAPI specification is available at:
```
https://devapi-proline.provoke.space/api/schema/
```

## Quick Start - Step by Step

### Step 1: Install Claude Desktop (if not already installed)

Download from: https://claude.ai/download

### Step 2: Configure MCP in Claude Desktop

1. **Find your Claude Desktop config file**:
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add this MCP configuration**:

```json
{
  "mcpServers": {
    "swagger-api-proline": {
      "command": "node",
      "args": [
        "/home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration/dist/index.js"
      ],
      "env": {
        "DEBUG": "false"
      }
    }
  }
}
```

3. **Restart Claude Desktop**

### Step 3: Test the MCP Integration

In Claude Desktop, ask:

```
List all available MCP tools for swagger-api-proline
```

You should see:
- ✅ `parse_swagger_spec`
- ✅ `analyze_project`
- ✅ `generate_api_layer`
- ✅ `generate_ui_components`
- ✅ `update_routes`
- ✅ `update_endpoint`

## Using the MCP - Complete Workflow

### Example 1: Generate Complete API Integration

**In Claude Desktop, say:**

```
I want to integrate the ProLine API into my React project.

1. Parse the Swagger spec from: https://devapi-proline.provoke.space/api/schema/
2. Analyze my project at: /home/harsh/Desktop/projects/test_get_shit_done
3. Generate types, services, hooks, validations, and UI components for the Alerts API
```

**What Claude will do:**

1. **Parse Swagger** - Extract all endpoints, schemas, auth patterns
2. **Analyze Project** - Detect React 19, Vite, TanStack Query, Zod, etc.
3. **Generate Files**:
   ```
   ✅ src/types/api/alerts.ts
   ✅ src/api/services/alertsService.ts
   ✅ src/hooks/api/useAlerts.ts
   ✅ src/lib/validations/alerts.ts
   ✅ src/pages/alerts/index.tsx
   ✅ src/pages/alerts/alert-detail.tsx
   ✅ src/components/create-alert-dialog.tsx
   ✅ src/router/path.ts (updated)
   ✅ src/router/routes.tsx (updated)
   ```

### Example 2: Generate Only API Layer (No UI)

**In Claude Desktop:**

```
Parse the ProLine API from: https://devapi-proline.provoke.space/api/schema/
Analyze my project at: /home/harsh/Desktop/projects/test_get_shit_done
Generate only types, services, and hooks for Tenants endpoints
Don't generate UI components
```

### Example 3: Generate for Specific Endpoints

**In Claude Desktop:**

```
Using ProLine API (https://devapi-proline.provoke.space/api/schema/)
Generate API integration for these endpoints only:
- /api/v1/tenants/
- /api/v1/users/
- /api/v1/subscriptions/

Include UI components for Tenants only
```

### Example 4: Update Existing Integration

**In Claude Desktop:**

```
The ProLine API endpoint /api/v1/alerts/ has been updated
Please update the types, service, and hook for this endpoint
Project path: /home/harsh/Desktop/projects/test_get_shit_done
```

## What Gets Generated

### 1. TypeScript Types (`src/types/api/`)

Following your strict TypeScript conventions:

```typescript
/**
 * Alert interface
 * Generated from OpenAPI specification
 */
export interface Alert {
  /** Alert ID */
  id: string;
  /** Alert title */
  title: string;
  /** Alert message content */
  message: string;
  /** Audience types */
  audience: string[];
  /** Notification type */
  notification_type: 'EMAIL' | 'IN_APP' | 'BOTH';
  /** Alert status */
  status: 'DRAFT' | 'SCHEDULED' | 'DELIVERED';
  /** Schedule datetime */
  schedule_at?: string;
  /** Created datetime */
  created_at: string;
}

/**
 * Create alert request
 */
export interface CreateAlertRequest {
  title: string;
  message: string;
  audience: string[];
  notification_type: 'EMAIL' | 'IN_APP' | 'BOTH';
  schedule_at?: string;
}

/**
 * API response wrapper
 */
export interface AlertResponse {
  status: number;
  message: string;
  data: Alert;
}

/**
 * Paginated response
 */
export interface PaginatedAlertResponse {
  status: number;
  message: string;
  data: Alert[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
  };
}
```

### 2. API Services (`src/api/services/`)

Using your Axios instance pattern:

```typescript
import axiosInstance from '@/api/axiosInstance';
import type {
  Alert,
  CreateAlertRequest,
  AlertResponse,
  PaginatedAlertResponse,
} from '@/types/api/alerts';

/**
 * Fetch paginated list of alerts
 */
export const getAlertsService = async (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  ordering?: string;
}): Promise<PaginatedAlertResponse> => {
  const response = await axiosInstance.get<PaginatedAlertResponse>(
    '/api/v1/alerts/',
    { params }
  );
  return response.data;
};

/**
 * Get alert detail by ID
 */
export const getAlertDetailService = async (
  alertId: string
): Promise<AlertResponse> => {
  const response = await axiosInstance.get<AlertResponse>(
    `/api/v1/alerts/${alertId}/`
  );
  return response.data;
};

/**
 * Create new alert
 */
export const createAlertService = async (
  data: CreateAlertRequest
): Promise<AlertResponse> => {
  const response = await axiosInstance.post<AlertResponse>(
    '/api/v1/alerts/',
    data
  );
  return response.data;
};

/**
 * Update alert
 */
export const updateAlertService = async (
  alertId: string,
  data: Partial<CreateAlertRequest>
): Promise<AlertResponse> => {
  const response = await axiosInstance.patch<AlertResponse>(
    `/api/v1/alerts/${alertId}/`,
    data
  );
  return response.data;
};

/**
 * Delete alert
 */
export const deleteAlertService = async (
  alertId: string
): Promise<void> => {
  await axiosInstance.delete(`/api/v1/alerts/${alertId}/`);
};
```

### 3. TanStack Query Hooks (`src/hooks/api/`)

Following your React Query v5 patterns:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import {
  getAlertsService,
  getAlertDetailService,
  createAlertService,
  updateAlertService,
  deleteAlertService,
} from '@/api/services/alertsService';

/**
 * Fetch alerts list with pagination
 */
export function useAlertsQuery(params?: {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => getAlertsService(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Fetch alert detail by ID
 */
export function useAlertDetailQuery(alertId: string) {
  return useQuery({
    queryKey: ['alerts', alertId],
    queryFn: () => getAlertDetailService(alertId),
    enabled: !!alertId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create alert mutation
 */
export function useCreateAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAlertService,
    onSuccess: (data) => {
      toast.success(data.message || 'Alert created successfully');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create alert');
    },
  });
}

/**
 * Update alert mutation
 */
export function useUpdateAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, data }: { alertId: string; data: any }) =>
      updateAlertService(alertId, data),
    onSuccess: (data) => {
      toast.success(data.message || 'Alert updated successfully');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update alert');
    },
  });
}

/**
 * Delete alert mutation
 */
export function useDeleteAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAlertService,
    onSuccess: () => {
      toast.success('Alert deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete alert');
    },
  });
}
```

### 4. Zod Validation Schemas (`src/lib/validations/`)

Following your validation patterns:

```typescript
import { z } from 'zod';

/**
 * Create alert validation schema
 */
export const createAlertSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
  audience: z
    .array(z.string())
    .min(1, 'At least one audience type is required'),
  notification_type: z.enum(['EMAIL', 'IN_APP', 'BOTH'], {
    required_error: 'Notification type is required',
  }),
  schedule_at: z.string().optional(),
});

/**
 * Type inference for form data
 */
export type CreateAlertFormData = z.infer<typeof createAlertSchema>;

/**
 * Update alert validation schema
 */
export const updateAlertSchema = createAlertSchema.partial();
export type UpdateAlertFormData = z.infer<typeof updateAlertSchema>;
```

### 5. React Components (Optional)

Following your component patterns (CommonDialog, Field, AppTitle, etc.):

```typescript
// src/pages/alerts/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppTitle from '@/components/app-title';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyData } from '@/components/empty-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useAlertsQuery } from '@/hooks/api/useAlerts';
import { CreateAlertDialog } from '@/components/create-alert-dialog';

export function AlertsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data, isLoading, error } = useAlertsQuery();

  // Rest of the component following your exact patterns...
}
```

## Testing the Integration

### Manual Test in Terminal

```bash
# Navigate to MCP directory
cd /home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration

# Test parsing the Swagger spec
node dist/index.js << 'EOF'
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "parse_swagger_spec",
    "arguments": {
      "specUrl": "https://devapi-proline.provoke.space/api/schema/",
      "outputDir": "."
    }
  },
  "id": 1
}
EOF
```

### Check Generated Files

After running the MCP through Claude Desktop, check:

```bash
# Check generated types
ls -la /home/harsh/Desktop/projects/test_get_shit_done/src/types/api/

# Check generated services
ls -la /home/harsh/Desktop/projects/test_get_shit_done/src/api/services/

# Check generated hooks
ls -la /home/harsh/Desktop/projects/test_get_shit_done/src/hooks/api/

# Check generated validations
ls -la /home/harsh/Desktop/projects/test_get_shit_done/src/lib/validations/
```

## Common Issues & Solutions

### Issue 1: MCP Not Loading

**Solution**: Check Claude Desktop logs
```bash
# Linux
tail -f ~/.config/Claude/logs/mcp*.log

# macOS
tail -f ~/Library/Logs/Claude/mcp*.log
```

### Issue 2: Permission Denied

**Solution**: Make entry point executable
```bash
chmod +x /home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration/dist/index.js
```

### Issue 3: Module Not Found

**Solution**: Rebuild the MCP
```bash
cd /home/harsh/Desktop/projects/test_get_shit_done/mcp-api-integration
pnpm install
pnpm run build
```

### Issue 4: Swagger Spec Not Accessible

**Solution**: Check if you need authentication
```bash
curl -v "https://devapi-proline.provoke.space/api/schema/"
```

## Advanced Usage

### Custom Configuration

Create `mcp-config.json` in the MCP directory:

```json
{
  "defaultSwaggerUrl": "https://devapi-proline.provoke.space/api/schema/",
  "defaultProjectPath": "/home/harsh/Desktop/projects/test_get_shit_done",
  "outputPaths": {
    "types": "src/types/api",
    "services": "src/api/services",
    "hooks": "src/hooks/api",
    "validations": "src/lib/validations"
  },
  "generation": {
    "typescript": true,
    "services": true,
    "hooks": true,
    "validations": true,
    "ui": false
  }
}
```

### Authentication Headers

If your Swagger spec requires authentication:

```bash
# Add to env in claude_desktop_config.json
"env": {
  "SWAGGER_AUTH_TOKEN": "your-token-here"
}
```

## Next Steps

1. ✅ **Install Claude Desktop** (if not already)
2. ✅ **Configure MCP** in Claude Desktop config
3. ✅ **Restart Claude Desktop**
4. ✅ **Test Integration** - Ask Claude to parse your Swagger spec
5. ✅ **Generate API Layer** - Let Claude create all the files
6. ✅ **Review Generated Code** - Check if it follows your patterns
7. ✅ **Test in Your App** - Import and use the generated hooks

## Support

For issues:
- Check Claude Desktop logs
- Verify MCP is running: `ps aux | grep swagger-api-mcp`
- Test Swagger endpoint: `curl https://devapi-proline.provoke.space/api/schema/`
- Rebuild MCP: `cd mcp-api-integration && pnpm run build`

## Example Commands for Claude

### Generate Everything
```
Parse ProLine API from https://devapi-proline.provoke.space/api/schema/
Analyze my project at /home/harsh/Desktop/projects/test_get_shit_done
Generate complete API integration with UI for all endpoints
```

### Generate Specific Resource
```
Using ProLine API, generate integration for Alerts endpoints
Project: /home/harsh/Desktop/projects/test_get_shit_done
Include types, services, hooks, validations, and UI components
```

### Update Endpoint
```
Update the /api/v1/tenants/ endpoint integration
The Swagger spec has changed
Project: /home/harsh/Desktop/projects/test_get_shit_done
```

### No UI Generation
```
Parse ProLine API and generate API layer only
Don't create UI components
Project: /home/harsh/Desktop/projects/test_get_shit_done
```
