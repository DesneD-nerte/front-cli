import { Command } from 'commander';
import { Container } from 'typedi';
import { ConsoleInquirerService } from '../service/ConsoleInquirerService.js';

export const listCommand = new Command('list')
    .argument('[project-group]', 'Конкретная команда')
    .description('Вывод всех frontend проектов')
    .action(async (projectGroup) => {
        try {
            const consoleInqurerService = Container.get(ConsoleInquirerService);

            let pickedProject;

            if (projectGroup) {
                console.log(`Вывод всех frontend проектов команды ${projectGroup}`);
                pickedProject = await consoleInqurerService.pickProjectByGroupName(projectGroup);
            } else {
                console.log(`Вывод всех frontend проектов`);
                pickedProject = await consoleInqurerService.pickProjectFromList();
            }

            await consoleInqurerService.openLinkByPickedProject(pickedProject);
        } catch (e) {
            console.log('Ошибка при выполнении команды', String(e));
        }
    });

