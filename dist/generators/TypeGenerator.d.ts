import type { OpenAPIV3 } from 'openapi-types';
import type { ProjectConfig } from '../types/index.js';
export declare class TypeGenerator {
    private projectConfig;
    constructor(projectConfig: ProjectConfig);
    generate(spec: OpenAPIV3.Document, endpoints: string[]): Promise<string[]>;
    private groupSchemasByResource;
    private extractResourceFromPath;
    private extractSchemaName;
    private generateTypeFile;
    private generateInterface;
    private getTypeScriptType;
    updateEndpoint(endpointPath: string, method: string, updatedSpec: any): Promise<string | null>;
}
//# sourceMappingURL=TypeGenerator.d.ts.map