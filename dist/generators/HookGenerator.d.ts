import type { OpenAPIV3 } from 'openapi-types';
import type { ProjectConfig } from '../types/index.js';
export declare class HookGenerator {
    private projectConfig;
    constructor(projectConfig: ProjectConfig);
    generate(spec: OpenAPIV3.Document, endpoints: string[]): Promise<string[]>;
    private groupEndpointsByResource;
    private extractResourceFromPath;
    private generateHookFile;
    private generateQueryHook;
    private generateMutationHook;
    private extractPathParams;
    private generateOperationName;
    private getSuccessMessage;
    private getErrorMessage;
    private generateServiceImports;
    updateEndpoint(path: string, method: string, spec: any): Promise<string | null>;
}
//# sourceMappingURL=HookGenerator.d.ts.map