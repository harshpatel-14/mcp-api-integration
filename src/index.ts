#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { SwaggerParser } from './tools/parseSwagger.js';
import { TypeGenerator } from './generators/TypeGenerator.js';
import { ServiceGenerator } from './generators/ServiceGenerator.js';
import { HookGenerator } from './generators/HookGenerator.js';
import { ValidationGenerator } from './generators/ValidationGenerator.js';
import { ComponentGenerator } from './generators/ComponentGenerator.js';
import { RouteGenerator } from './generators/RouteGenerator.js';
import { ProjectAnalyzer } from './analyzers/detectProject.js';
import { logger } from './utils/logger.js';
import type { ParsedSwaggerSpec, ProjectConfig, GenerationResult } from './types/index.js';

const TOOLS: Tool[] = [
  {
    name: 'parse_swagger_spec',
    description:
      'Parse OpenAPI/Swagger specification from URL or file path and extract endpoints, schemas, and authentication',
    inputSchema: {
      type: 'object',
      properties: {
        specUrl: {
          type: 'string',
          description: 'URL or file path to OpenAPI/Swagger specification',
        },
        outputDir: {
          type: 'string',
          description: 'Output directory for generated files (default: current directory)',
          default: '.',
        },
      },
      required: ['specUrl'],
    },
  },
  {
    name: 'analyze_project',
    description:
      'Analyze existing React project structure, detect tech stack, state management, and conventions',
    inputSchema: {
      type: 'object',
      properties: {
        projectDir: {
          type: 'string',
          description: 'Project root directory',
          default: '.',
        },
      },
    },
  },
  {
    name: 'generate_api_layer',
    description:
      'Generate complete API layer: types, services, hooks, validations from parsed Swagger spec',
    inputSchema: {
      type: 'object',
      properties: {
        spec: {
          type: 'object',
          description: 'Parsed OpenAPI specification',
        },
        projectConfig: {
          type: 'object',
          description: 'Project configuration from analyze_project',
        },
        endpoints: {
          type: 'array',
          description: 'Specific endpoints to generate (if empty, generates all)',
          items: { type: 'string' },
          default: [],
        },
        generateUI: {
          type: 'boolean',
          description: 'Generate UI components (list, detail, create dialog)',
          default: false,
        },
      },
      required: ['spec', 'projectConfig'],
    },
  },
  {
    name: 'generate_ui_components',
    description:
      'Generate React UI components for CRUD operations following project patterns',
    inputSchema: {
      type: 'object',
      properties: {
        resourceName: {
          type: 'string',
          description: 'Resource name (e.g., "posts", "users")',
        },
        endpoints: {
          type: 'object',
          description: 'Endpoint definitions from Swagger',
        },
        projectConfig: {
          type: 'object',
          description: 'Project configuration',
        },
        components: {
          type: 'array',
          description: 'Components to generate',
          items: {
            type: 'string',
            enum: ['list', 'detail', 'create', 'edit', 'delete'],
          },
          default: ['list', 'detail', 'create'],
        },
      },
      required: ['resourceName', 'endpoints', 'projectConfig'],
    },
  },
  {
    name: 'update_routes',
    description: 'Update React Router configuration with new routes',
    inputSchema: {
      type: 'object',
      properties: {
        resourceName: {
          type: 'string',
          description: 'Resource name for routes',
        },
        routeConfig: {
          type: 'object',
          description: 'Route configuration',
        },
        projectConfig: {
          type: 'object',
          description: 'Project configuration',
        },
      },
      required: ['resourceName', 'routeConfig', 'projectConfig'],
    },
  },
];

class SwaggerMCPServer {
  private server: Server;
  private swaggerParser: SwaggerParser;
  private projectAnalyzer: ProjectAnalyzer;

  constructor() {
    this.server = new Server(
      {
        name: 'swagger-api-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.swaggerParser = new SwaggerParser();
    this.projectAnalyzer = new ProjectAnalyzer();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'parse_swagger_spec':
            return await this.handleParseSwagger(args as { specUrl: string; outputDir?: string });

          case 'analyze_project':
            return await this.handleAnalyzeProject(args as { projectDir?: string });

          case 'generate_api_layer':
            return await this.handleGenerateAPILayer(args as any);

          case 'generate_ui_components':
            return await this.handleGenerateUIComponents(args as any);

          case 'update_routes':
            return await this.handleUpdateRoutes(args as any);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async handleParseSwagger(args: { specUrl: string; outputDir?: string }) {
    const { specUrl } = args;

    logger.info(`Parsing Swagger spec from: ${specUrl}`);

    const parsedSpec = await this.swaggerParser.parse(specUrl);
    const endpoints = this.swaggerParser.extractEndpoints(parsedSpec);
    const authSchemes = this.swaggerParser.extractAuthSchemes(parsedSpec);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              success: true,
              message: 'Swagger specification parsed successfully',
              data: {
                info: parsedSpec.info,
                servers: parsedSpec.servers,
                endpointCount: endpoints.length,
                endpoints: endpoints.map(e => ({
                  path: e.path,
                  method: e.method,
                  operationId: e.operation.operationId,
                  tags: e.tags,
                })),
                schemaCount: Object.keys(parsedSpec.components?.schemas || {}).length,
                authSchemes,
                spec: parsedSpec,
              },
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleAnalyzeProject(args: { projectDir?: string }) {
    const { projectDir = '.' } = args;

    logger.info(`Analyzing project: ${projectDir}`);

    const projectConfig = await this.projectAnalyzer.analyze(projectDir);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              success: true,
              message: 'Project analyzed successfully',
              data: projectConfig,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleGenerateAPILayer(args: any) {
    const { spec, projectConfig, endpoints = [], generateUI = false } = args;

    logger.info('Generating API layer...');

    const results: GenerationResult = {
      types: [],
      services: [],
      hooks: [],
      validations: [],
      ui: [],
    };

    const typeGenerator = new TypeGenerator(projectConfig);
    results.types = await typeGenerator.generate(spec, endpoints);

    const serviceGenerator = new ServiceGenerator(projectConfig);
    results.services = await serviceGenerator.generate(spec, endpoints);

    const hookGenerator = new HookGenerator(projectConfig);
    results.hooks = await hookGenerator.generate(spec, endpoints);

    const validationGenerator = new ValidationGenerator(projectConfig);
    results.validations = await validationGenerator.generate(spec, endpoints);

    if (generateUI) {
      const componentGenerator = new ComponentGenerator(projectConfig);
      results.ui = await componentGenerator.generate(spec, endpoints);
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              success: true,
              message: 'API layer generated successfully',
              data: {
                generated: {
                  types: results.types.length,
                  services: results.services.length,
                  hooks: results.hooks.length,
                  validations: results.validations.length,
                  uiComponents: results.ui.length,
                },
                files: [
                  ...results.types,
                  ...results.services,
                  ...results.hooks,
                  ...results.validations,
                  ...results.ui,
                ],
              },
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleGenerateUIComponents(args: any) {
    const { resourceName, endpoints, projectConfig, components = ['list', 'detail', 'create'] } =
      args;

    logger.info(`Generating UI components for: ${resourceName}`);

    const componentGenerator = new ComponentGenerator(projectConfig);
    const generated = await componentGenerator.generateComponents(
      resourceName,
      endpoints,
      components
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              success: true,
              message: 'UI components generated successfully',
              data: {
                generated: generated.length,
                files: generated,
              },
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleUpdateRoutes(args: any) {
    const { resourceName, routeConfig, projectConfig } = args;

    logger.info(`Updating routes for: ${resourceName}`);

    const routeGenerator = new RouteGenerator(projectConfig);
    const updated = await routeGenerator.updateRoutes(resourceName, routeConfig);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              success: true,
              message: 'Routes updated successfully',
              data: updated,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Swagger API MCP Server started successfully');
  }
}

const server = new SwaggerMCPServer();
server.start().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
