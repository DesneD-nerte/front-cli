import path from 'path';
import inquirer, { ChoiceOptions, SeparatorOptions } from 'inquirer';
import open from 'open';
import { Service } from 'typedi';
import { ConfigStructure } from '../types/ConfigStructure.js';
import { FileService } from './FileService.js';
import { ProjectStructure } from '../types/ProjectStructure.js';

@Service()
export class ConsoleInquirerService {
    private _count: number = 0;
    public get count() {
        return this._count;
    }

    public set count(value) {
        this._count = value;
    }

    private fileService: FileService;

    private questions = {
        pickProject: (project: Array<ChoiceOptions | SeparatorOptions>) => [
            {
                type: 'list',
                name: 'currentProject',
                message: 'Выберите проект для доступа',
                choices: project,
                loop: false,
                pageSize: 20,
            },
        ],
        pickLinkOfProject: (projectLinks: Array<ChoiceOptions | SeparatorOptions>) => [
            {
                type: 'list',
                name: 'pickedLink',
                message: 'Все ссылки проекта',
                choices: projectLinks,
                loop: false,
                pageSize: 20,
            },
        ],
    };

    constructor(fileService: FileService) {
        this.fileService = fileService;
    }

    /**
     * Показать все проекты в консоли и выбрать нужный
     */
    public async pickProjectFromList() {
        const configFiles = this.fileService.getConfigFiles();

        const allProjects = [];
        for (const configFile of configFiles) {
            allProjects.push(new inquirer.Separator(configFile.name.split('.')[0]));

            const fileContent: ConfigStructure = JSON.parse(this.fileService.readFile(path.join(configFile.parentPath, configFile.name)));

            const jsonConfigProjectsName = Object.keys(fileContent);
            for (let i = 0; i < jsonConfigProjectsName.length; i++) {
                allProjects.push({
                    name: ' - ' + jsonConfigProjectsName[i],
                    value: fileContent[jsonConfigProjectsName[i]],
                });
            }
        }

        return (await inquirer.prompt(this.questions.pickProject(allProjects))).currentProject;
    }

    /**
     * Показать все проекты конкретной команды и выбрать нужный
     */
    public async pickProjectByGroupName(projectGroup: string) {
        const configFile = this.fileService.readFile(path.join('config', `${projectGroup}.json`));
        const configFileContent: ConfigStructure = JSON.parse(configFile);

        const allProjects = [];
        const jsonConfigProjectsName = Object.keys(configFileContent);
        for (let i = 0; i < jsonConfigProjectsName.length; i++) {
            allProjects.push({
                name: ' - ' + jsonConfigProjectsName[i],
                value: configFileContent[jsonConfigProjectsName[i]],
            });
        }

        return (await inquirer.prompt(this.questions.pickProject(allProjects))).currentProject;
    }

    /**
     * Показать и открыть нужную ссылку выбранного проекта (config - конкретный файл и имя проекта)
     *
     * TODO Нужно переделать чтобы парсился config файл. Не должно быть хардкода по полям. Ссылки могут динамически добавляться
     */
    public async openLinkByPickedProject(pickedProject: ProjectStructure) {
        const allProjectLinks: Array<ChoiceOptions | SeparatorOptions> = [];
        const projectLinks = pickedProject.view;
        const swaggerLinks = pickedProject.swagger;
        const jiraLink = pickedProject.jira;
        const figmaLink = pickedProject.figma;
        const gitlabLink = pickedProject.gitlab;

        allProjectLinks.push(new inquirer.Separator('Проект:'));
        for (const item in projectLinks) {
            const projectLinkKey = item as keyof typeof projectLinks;

            allProjectLinks.push({
                name: ' - ' + projectLinks[projectLinkKey] + ' - ' + projectLinkKey,
                value: projectLinks[projectLinkKey],
            });
        }

        allProjectLinks.push(new inquirer.Separator('Swagger:'));
        for (const item in swaggerLinks) {
            const swaggerLinkKey = item as keyof typeof projectLinks;

            allProjectLinks.push({
                name: ' - ' + swaggerLinks[swaggerLinkKey] + ' - ' + swaggerLinkKey,
                value: swaggerLinks[swaggerLinkKey],
            });
        }

        allProjectLinks.push(new inquirer.Separator('JIRA:'));
        allProjectLinks.push({ name: ' - ' + jiraLink, value: jiraLink });
        allProjectLinks.push(new inquirer.Separator('Figma:'));
        allProjectLinks.push({ name: ' - ' + figmaLink, value: figmaLink });
        allProjectLinks.push(new inquirer.Separator('Gitlab:'));
        allProjectLinks.push({ name: ' - ' + gitlabLink, value: gitlabLink });

        const pickedLink = (await inquirer.prompt(this.questions.pickLinkOfProject(allProjectLinks))).pickedLink;
        await open(pickedLink);
    }
}