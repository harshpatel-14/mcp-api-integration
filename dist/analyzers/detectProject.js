import * as fs from 'fs/promises';
import * as path from 'path';
import { logger } from '../utils/logger.js';
import { readJsonFile, fileExists } from '../utils/fileSystem.js';
export class ProjectAnalyzer {
    async analyze(projectDir) {
        logger.info('Analyzing project structure...');
        const packageJson = await this.readPackageJson(projectDir);
        const tsConfig = await this.readTsConfig(projectDir);
        const config = {
            framework: this.detectFramework(packageJson),
            stateManagement: this.detectStateManagement(packageJson),
            httpClient: this.detectHttpClient(packageJson),
            formLibrary: this.detectFormLibrary(packageJson),
            validationLibrary: this.detectValidationLibrary(packageJson),
            uiFramework: this.detectUIFramework(packageJson),
            queryLibrary: this.detectQueryLibrary(packageJson),
            paths: await this.detectPaths(projectDir, tsConfig),
            conventions: await this.detectConventions(projectDir),
            authPatterns: await this.detectAuthPatterns(projectDir),
        };
        logger.info('Project analysis complete');
        return config;
    }
    async readPackageJson(projectDir) {
        const packageJsonPath = path.join(projectDir, 'package.json');
        return await readJsonFile(packageJsonPath);
    }
    async readTsConfig(projectDir) {
        try {
            const tsConfigPath = path.join(projectDir, 'tsconfig.json');
            const content = await fs.readFile(tsConfigPath, 'utf-8');
            const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
            return JSON.parse(cleanContent);
        }
        catch {
            return {};
        }
    }
    detectFramework(packageJson) {
        if (packageJson.dependencies?.['next']) {
            return 'nextjs';
        }
        if (packageJson.dependencies?.['vite'] || packageJson.devDependencies?.['vite']) {
            return 'vite-react';
        }
        return 'cra';
    }
    detectStateManagement(packageJson) {
        const stateManagement = [];
        if (packageJson.dependencies?.['@reduxjs/toolkit']) {
            stateManagement.push('redux-toolkit');
        }
        if (packageJson.dependencies?.['zustand']) {
            stateManagement.push('zustand');
        }
        if (packageJson.dependencies?.['jotai']) {
            stateManagement.push('jotai');
        }
        if (packageJson.dependencies?.['recoil']) {
            stateManagement.push('recoil');
        }
        return stateManagement;
    }
    detectQueryLibrary(packageJson) {
        if (packageJson.dependencies?.['@tanstack/react-query']) {
            return 'tanstack-query';
        }
        if (packageJson.dependencies?.['swr']) {
            return 'swr';
        }
        if (packageJson.dependencies?.['@reduxjs/toolkit']) {
            return 'rtk-query';
        }
        return null;
    }
    detectHttpClient(packageJson) {
        if (packageJson.dependencies?.['axios']) {
            return 'axios';
        }
        if (packageJson.dependencies?.['ky']) {
            return 'ky';
        }
        return 'fetch';
    }
    detectFormLibrary(packageJson) {
        if (packageJson.dependencies?.['react-hook-form']) {
            return 'react-hook-form';
        }
        if (packageJson.dependencies?.['formik']) {
            return 'formik';
        }
        return null;
    }
    detectValidationLibrary(packageJson) {
        if (packageJson.dependencies?.['zod']) {
            return 'zod';
        }
        if (packageJson.dependencies?.['yup']) {
            return 'yup';
        }
        if (packageJson.dependencies?.['joi']) {
            return 'joi';
        }
        return null;
    }
    detectUIFramework(packageJson) {
        if (packageJson.dependencies?.['@radix-ui/react-dialog'] ||
            packageJson.dependencies?.['@radix-ui/react-select']) {
            return 'shadcn';
        }
        if (packageJson.dependencies?.['@mui/material']) {
            return 'mui';
        }
        if (packageJson.dependencies?.['antd']) {
            return 'ant-design';
        }
        if (packageJson.dependencies?.['@chakra-ui/react']) {
            return 'chakra';
        }
        return null;
    }
    async detectPaths(projectDir, tsConfig) {
        const baseUrl = tsConfig.compilerOptions?.baseUrl || 'src';
        const paths = tsConfig.compilerOptions?.paths || {};
        const resolvePath = (pattern, defaultPath) => {
            const aliasPath = paths[`@/${pattern}`]?.[0] || paths[`${pattern}/*`]?.[0];
            if (aliasPath) {
                return path.join(baseUrl, aliasPath.replace('/*', ''));
            }
            return path.join('src', defaultPath);
        };
        // Detect test directory: prefer project-root-level "tests" or "e2e" when present
        const testsPath = await this.detectTestsDir(projectDir);
        return {
            api: resolvePath('api/*', 'api/services'),
            types: resolvePath('types/*', 'types/api'),
            hooks: resolvePath('hooks/*', 'hooks/api'),
            validations: resolvePath('lib/validations/*', 'lib/validations'),
            components: resolvePath('components/*', 'components'),
            pages: resolvePath('pages/*', 'pages'),
            tests: testsPath,
        };
    }
    async detectTestsDir(projectDir) {
        const candidates = ['e2e', 'tests', 'test', 'playwright'];
        for (const dir of candidates) {
            try {
                await fs.access(path.join(projectDir, dir));
                return dir;
            }
            catch {
                // directory does not exist, try next
            }
        }
        return 'e2e';
    }
    async detectConventions(projectDir) {
        const servicesDir = path.join(projectDir, 'src/api/services');
        try {
            const files = await fs.readdir(servicesDir);
            const serviceFiles = files.filter(f => f.endsWith('Service.ts') || f.endsWith('Service.tsx'));
            if (serviceFiles.length > 0) {
                return {
                    serviceNamePattern: '{feature}Service',
                    hookNamePattern: 'use{Feature}',
                    typeNamePattern: '{Feature}{Operation}',
                    validationNamePattern: '{feature}Schema',
                    componentNamePattern: '{Feature}{Component}',
                };
            }
        }
        catch {
            // Directory doesn't exist
        }
        return {
            serviceNamePattern: '{feature}Service',
            hookNamePattern: 'use{Feature}',
            typeNamePattern: '{Feature}{Operation}',
            validationNamePattern: '{feature}Schema',
            componentNamePattern: '{Feature}{Component}',
        };
    }
    async detectAuthPatterns(projectDir) {
        try {
            const axiosInstancePath = path.join(projectDir, 'src/api/axiosInstance.ts');
            if (await fileExists(axiosInstancePath)) {
                const content = await fs.readFile(axiosInstancePath, 'utf-8');
                let tokenStorage = 'localStorage';
                let tokenKey = 'token';
                let authHeader = 'Authorization';
                if (content.includes('localStorage.getItem')) {
                    tokenStorage = 'localStorage';
                    const match = content.match(/localStorage\.getItem\(['"]([^'"]+)['"]\)/);
                    if (match)
                        tokenKey = match[1];
                }
                else if (content.includes('getState()')) {
                    tokenStorage = 'redux';
                }
                else if (content.includes('document.cookie')) {
                    tokenStorage = 'cookie';
                }
                if (content.includes('Bearer')) {
                    authHeader = 'Authorization';
                }
                else if (content.includes('X-Auth-Token')) {
                    authHeader = 'X-Auth-Token';
                }
                return {
                    tokenStorage,
                    tokenKey,
                    authHeader,
                };
            }
        }
        catch {
            // File doesn't exist or read error
        }
        return {
            tokenStorage: 'localStorage',
            tokenKey: 'token',
            authHeader: 'Authorization',
        };
    }
}
//# sourceMappingURL=detectProject.js.map