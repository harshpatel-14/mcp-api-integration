import type { OpenAPIV3 } from 'openapi-types';
import type { EndpointInfo, ParsedSwaggerSpec } from '../types/index.js';
export declare class SwaggerParser {
    parse(specUrl: string): Promise<ParsedSwaggerSpec>;
    private isUrl;
    private fetchFromUrl;
    private readFromFile;
    private validateSpec;
    private resolveReferences;
    private resolveSchemaRefs;
    extractEndpoints(spec: OpenAPIV3.Document): EndpointInfo[];
    extractAuthSchemes(spec: OpenAPIV3.Document): Record<string, any>;
    extractServers(spec: OpenAPIV3.Document): OpenAPIV3.ServerObject[];
    getInfo(spec: OpenAPIV3.Document): OpenAPIV3.InfoObject;
}
//# sourceMappingURL=parseSwagger.d.ts.map