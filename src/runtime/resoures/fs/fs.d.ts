/**
 * from https://github.com/tauri-apps/tauri/blob/e4292ce/tooling/api/src/fs.ts#L154
 */
 export interface FileEntry {
    path: string
    /**
     * Name of the directory/file
     * can be null if the path terminates with `..`
     */
    name?: string
    /** Children of this entry if it's a directory; null otherwise */
    children?: FileEntry[]
}

/**
 * 文件系统
 */
export interface FileSystem {
    readTextFile(filePath: string): Promise<string>;
    createDir(dir: string): Promise<void>;
    readDir(dir: string): Promise<FileEntry[]>;
    writeTextFile(path: string, content: string): Promise<void>;
    removeFile(file: string): Promise<void>;
    removeDir(dir: string): Promise<void>;
    copyFile(source: string, destination: string): Promise<void>;
    exists(path: string): Promise<void>;
}


