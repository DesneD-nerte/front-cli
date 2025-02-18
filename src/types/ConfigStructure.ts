import { ProjectStructure } from './ProjectStructure.js';

export interface ConfigStructure {
    [projectName: string]: ProjectStructure;
}