export declare function fileExists(filePath: string): Promise<boolean>;
export declare function ensureDirectory(dirPath: string): Promise<void>;
export declare function readJsonFile<T = any>(filePath: string): Promise<T>;
export declare function writeFile(filePath: string, content: string): Promise<void>;
//# sourceMappingURL=fileSystem.d.ts.map