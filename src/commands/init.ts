import { Command } from 'commander';

export const initCommand = new Command('init')
    .argument('<project-name>', 'Название проекта')
    .description('Создание нового проекта')
    .action((projectName) => {
        console.log(`Создание нового проекта: ${projectName}`);
    });
