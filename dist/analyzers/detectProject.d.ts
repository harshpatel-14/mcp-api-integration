import type { ProjectConfig } from '../types/index.js';
export declare class ProjectAnalyzer {
    analyze(projectDir: string): Promise<ProjectConfig>;
    private readPackageJson;
    private readTsConfig;
    private detectFramework;
    private detectStateManagement;
    private detectQueryLibrary;
    private detectHttpClient;
    private detectFormLibrary;
    private detectValidationLibrary;
    private detectUIFramework;
    private detectPaths;
    private detectConventions;
    private detectAuthPatterns;
}
//# sourceMappingURL=detectProject.d.ts.map