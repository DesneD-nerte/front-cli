import { Command } from 'commander';
import { Container } from 'typedi';
import { ConsoleInquirerService } from '../service/ConsoleInquirerService.js';
import { FileService } from '../service/FileService.js';

export const currentCommand = new Command('current')
    .description('Вывод ссылок текущего открытого проекта')
    .action(async () => {
        try {
            const fileService = new FileService();
            const consoleInqurerService = Container.get(ConsoleInquirerService);

            const projectName = (await fileService.getPackageJsonFileFromCurrentProject()).name;
            const projectStructure = await fileService.getProjectStructureFromProjectName(projectName);

            return await consoleInqurerService.openLinkByPickedProject(projectStructure);
        } catch (e) {
            console.log(e);
        }
    });