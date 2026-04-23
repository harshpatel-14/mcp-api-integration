import { logger } from '../utils/logger.js';
export class RouteGenerator {
    projectConfig;
    constructor(projectConfig) {
        this.projectConfig = projectConfig;
    }
    async updateRoutes(name, config) {
        logger.info(`Updating routes for ${name}`);
        return { updated: true };
    }
}
//# sourceMappingURL=RouteGenerator.js.map