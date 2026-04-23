import * as fs from 'fs/promises';
import * as path from 'path';
export async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
export async function ensureDirectory(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}
export async function readJsonFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}
export async function writeFile(filePath, content) {
    await ensureDirectory(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
}
//# sourceMappingURL=fileSystem.js.map