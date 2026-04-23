import type { OpenAPIV3 } from 'openapi-types';
import type { ProjectConfig } from '../types/index.js';
export declare class ServiceGenerator {
    private projectConfig;
    constructor(projectConfig: ProjectConfig);
    generate(spec: OpenAPIV3.Document, endpoints: string[]): Promise<string[]>;
    private groupEndpointsByResource;
    private extractResourceFromPath;
    private generateServiceFile;
    private generateServiceFunction;
    private extractPathParams;
    private buildUrlPath;
    private getResponseType;
    private generateOperationName;
    private generateTypeImports;
    updateEndpoint(path: string, method: string, spec: any): Promise<string | null>;
}
//# sourceMappingURL=ServiceGenerator.d.ts.map