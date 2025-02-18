import { Dirent } from 'node:fs';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import childProccess from 'child_process';
import { once } from 'events';
import { moduleDirname } from '../constants/moduleDirname.js';
import { ConfigStructure } from '../types/ConfigStructure.js';
import { Service } from 'typedi';

@Service()
export class FileService {

    constructor() {
    }

    public getConfigFiles(): Dirent[] {
        return readdirSync(path.join(moduleDirname, 'config'), { withFileTypes: true });
    }

    public readFile(path: string): string {
        return readFileSync(path, { encoding: 'utf-8' });
    }

    public getProjectStructureFromProjectName(projectName: string) {
        const configFiles = this.getConfigFiles();

        for (const configFile of configFiles) {
            const fileContent: ConfigStructure = JSON.parse(this.readFile(path.join(configFile.parentPath, configFile.name)));
            for (const fileContentKey in fileContent) {

                if (fileContentKey === projectName) {
                    return fileContent[fileContentKey];
                }
            }
        }

        throw new Error('Проект не найден в списке конфигураций');
    }

    public async getPackageJsonFileFromCurrentProject() {
        const workingFilePath = path.join(moduleDirname, 'childProcesses', 'getShellWorkingDirectory');
        const cwd = childProccess.spawn('node', [workingFilePath]);
        let packageDirectoryPath = '';

        cwd.stdout.on('data', (data) => {
            packageDirectoryPath = path.join(data.toString().trim(), 'package.json');
        });
        cwd.stderr.on('data', (data) => {
            throw new Error('Ошибка получения package.json файла проекта');
        });

        await once(cwd, 'close');

        return JSON.parse(this.readFile(packageDirectoryPath));
    }
}