import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { OpenAPIV3 } from 'openapi-types';
import { logger } from '../utils/logger.js';
import type { EndpointInfo, ParsedSwaggerSpec } from '../types/index.js';

export class SwaggerParser {
  async parse(specUrl: string): Promise<ParsedSwaggerSpec> {
    logger.info(`Parsing specification from: ${specUrl}`);

    let spec: OpenAPIV3.Document;

    if (this.isUrl(specUrl)) {
      spec = await this.fetchFromUrl(specUrl);
    } else {
      spec = await this.readFromFile(specUrl);
    }

    this.validateSpec(spec);
    const resolvedSpec = await this.resolveReferences(spec);

    logger.info('Specification parsed successfully');
    return resolvedSpec as ParsedSwaggerSpec;
  }

  private isUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  private async fetchFromUrl(url: string): Promise<OpenAPIV3.Document> {
    try {
      const response = await axios.get<OpenAPIV3.Document>(url);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch specification from URL: ${url}`, error);
      throw new Error(`Failed to fetch specification: ${error}`);
    }
  }

  private async readFromFile(filePath: string): Promise<OpenAPIV3.Document> {
    try {
      const absolutePath = path.resolve(filePath);
      const content = await fs.readFile(absolutePath, 'utf-8');

      if (filePath.endsWith('.json')) {
        return JSON.parse(content);
      }

      throw new Error(`Unsupported file format: ${filePath}. Only JSON is supported.`);
    } catch (error) {
      logger.error(`Failed to read specification from file: ${filePath}`, error);
      throw new Error(`Failed to read specification: ${error}`);
    }
  }

  private validateSpec(spec: any): void {
    if (!spec.openapi && !spec.swagger) {
      throw new Error('Invalid OpenAPI/Swagger specification');
    }

    if (spec.swagger && !spec.swagger.startsWith('2.')) {
      throw new Error('Swagger 2.x specifications are not supported. Please use OpenAPI 3.x');
    }

    if (spec.openapi && !spec.openapi.startsWith('3.')) {
      throw new Error('Only OpenAPI 3.x specifications are supported');
    }

    if (!spec.paths || Object.keys(spec.paths).length === 0) {
      throw new Error('No paths found in specification');
    }

    logger.info(`Validated OpenAPI ${spec.openapi || spec.swagger} specification`);
  }

  private async resolveReferences(spec: OpenAPIV3.Document): Promise<OpenAPIV3.Document> {
    const resolvedSpec = JSON.parse(JSON.stringify(spec));

    if (resolvedSpec.components?.schemas) {
      Object.keys(resolvedSpec.components.schemas).forEach(schemaName => {
        this.resolveSchemaRefs(resolvedSpec.components!.schemas![schemaName], resolvedSpec);
      });
    }

    return resolvedSpec;
  }

  private resolveSchemaRefs(schema: any, spec: OpenAPIV3.Document): void {
    if (!schema || typeof schema !== 'object') return;

    if (schema.$ref) {
      const refPath = schema.$ref.replace('#/', '').split('/');
      let refValue: any = spec;

      for (const part of refPath) {
        refValue = refValue[part];
      }

      schema._resolved = refValue;
    }

    if (schema.properties) {
      Object.values(schema.properties).forEach((prop: any) => {
        this.resolveSchemaRefs(prop, spec);
      });
    }

    if (schema.items) {
      this.resolveSchemaRefs(schema.items, spec);
    }

    ['allOf', 'oneOf', 'anyOf'].forEach(key => {
      if (schema[key]) {
        schema[key].forEach((subSchema: any) => {
          this.resolveSchemaRefs(subSchema, spec);
        });
      }
    });
  }

  extractEndpoints(spec: OpenAPIV3.Document): EndpointInfo[] {
    const endpoints: EndpointInfo[] = [];

    Object.entries(spec.paths).forEach(([path, pathItem]) => {
      if (!pathItem) return;

      const methods = ['get', 'post', 'put', 'patch', 'delete'] as const;

      methods.forEach(method => {
        const operation = (pathItem as any)[method] as OpenAPIV3.OperationObject;
        if (operation) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            operation,
            tags: operation.tags || [],
          });
        }
      });
    });

    return endpoints;
  }

  extractAuthSchemes(spec: OpenAPIV3.Document): Record<string, any> {
    return spec.components?.securitySchemes || {};
  }

  extractServers(spec: OpenAPIV3.Document): OpenAPIV3.ServerObject[] {
    return spec.servers || [];
  }

  getInfo(spec: OpenAPIV3.Document): OpenAPIV3.InfoObject {
    return spec.info;
  }
}
