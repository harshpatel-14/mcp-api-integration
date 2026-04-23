import type { OpenAPIV3 } from 'openapi-types';

export interface ProjectConfig {
  framework: 'vite-react' | 'nextjs' | 'cra';
  stateManagement: string[];
  httpClient: 'axios' | 'fetch' | 'ky';
  formLibrary: 'react-hook-form' | 'formik' | null;
  validationLibrary: 'zod' | 'yup' | 'joi' | null;
  uiFramework: 'shadcn' | 'mui' | 'ant-design' | 'chakra' | null;
  queryLibrary: 'tanstack-query' | 'swr' | 'rtk-query' | null;
  paths: {
    api: string;
    types: string;
    hooks: string;
    validations: string;
    components: string;
    pages: string;
  };
  conventions: {
    serviceNamePattern: string;
    hookNamePattern: string;
    typeNamePattern: string;
    validationNamePattern: string;
    componentNamePattern: string;
  };
  authPatterns: {
    tokenStorage: 'localStorage' | 'cookie' | 'redux' | 'context';
    tokenKey: string;
    authHeader: string;
    refreshTokenEndpoint?: string;
  };
}

export interface ParsedSwaggerSpec extends OpenAPIV3.Document {
  _resolved?: boolean;
}

export interface GenerationResult {
  types: string[];
  services: string[];
  hooks: string[];
  validations: string[];
  ui: string[];
}

export interface EndpointInfo {
  path: string;
  method: string;
  operation: OpenAPIV3.OperationObject;
  tags: string[];
}

export interface MCPToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    uri?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface GeneratedFile {
  path: string;
  type: 'type' | 'service' | 'hook' | 'validation' | 'component' | 'route';
}
