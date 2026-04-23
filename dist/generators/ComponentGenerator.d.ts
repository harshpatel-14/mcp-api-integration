import type { OpenAPIV3 } from 'openapi-types';
import type { ProjectConfig } from '../types/index.js';
export declare class ComponentGenerator {
    private projectConfig;
    constructor(projectConfig: ProjectConfig);
    generate(spec: OpenAPIV3.Document, endpoints: string[]): Promise<string[]>;
    private groupEndpointsByResource;
    private extractResourceFromPath;
    generateComponents(resourceName: string, operations: any[], componentTypes: string[]): Promise<string[]>;
    private generateListComponent;
    private generateCreateDialog;
    private extractFormFields;
    private generateFormFields;
    private toTitleCase;
}
//# sourceMappingURL=ComponentGenerator.d.ts.map