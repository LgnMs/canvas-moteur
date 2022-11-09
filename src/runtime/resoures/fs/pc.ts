
import { BaseDirectory, copyFile, createDir, exists, readDir, readTextFile, removeDir, removeFile, writeTextFile } from '@tauri-apps/api/fs';
import { FileEntry, FileSystem } from './fs'

export class FileSystemForPc implements FileSystem {
    readTextFile(filePath: string): Promise<string> {
        return readTextFile(filePath, { dir: BaseDirectory.Home });
    }
    
    createDir(dir: string): Promise<void> {
        return createDir(dir, { dir: BaseDirectory.Home, recursive: true });
    }

    readDir(dir: string): Promise<FileEntry[]> {
        return readDir(dir, { dir: BaseDirectory.Home, recursive: true });
    }

    writeTextFile(path: string, content: string): Promise<void> {
        return writeTextFile(path, content, { dir: BaseDirectory.Home });
    }

    removeFile(file: string): Promise<void> {
        return removeFile(file, { dir: BaseDirectory.Home });
    }

    removeDir(dir: string): Promise<void> {
        return removeDir(dir, { dir: BaseDirectory.Home, recursive: true });
    }

    copyFile(source: string, destination: string): Promise<void> {
        return copyFile(source, destination, { dir: BaseDirectory.Home });
    }

    exists(path: string): Promise<void> {
        return exists(path, { dir: BaseDirectory.App });
    }

}