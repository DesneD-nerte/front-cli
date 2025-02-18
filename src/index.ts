#!/usr/bin/env node
import 'reflect-metadata';
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { currentCommand } from './commands/current.js';
// import packageInformation from '../package.json' assert { type: 'json' };

const program = new Command();

program
    .version('0.1.0')
    .description('CLI-утилита фронтенд команды');

program.addCommand(initCommand);
program.addCommand(listCommand);
program.addCommand(currentCommand);

program.parse(process.argv);