import type { OpenAPIV3 } from 'openapi-types';
import type { ProjectConfig } from '../types/index.js';
export declare class ValidationGenerator {
    private projectConfig;
    constructor(projectConfig: ProjectConfig);
    generate(spec: OpenAPIV3.Document, endpoints: string[]): Promise<string[]>;
    private groupEndpointsByResource;
    private extractResourceFromPath;
    private generateValidationFile;
    private generateValidationSchema;
    private resolveSchema;
    private generateSchemaFields;
    private getZodValidation;
    private getBaseZodType;
    private getFieldLabel;
    private generateOperationName;
    updateEndpoint(path: string, method: string, spec: any): Promise<string | null>;
}
//# sourceMappingURL=ValidationGenerator.d.ts.map