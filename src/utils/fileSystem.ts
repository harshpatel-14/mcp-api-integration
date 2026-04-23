import * as fs from 'fs/promises';
import * as path from 'path';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function readJsonFile<T = any>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await ensureDirectory(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}
