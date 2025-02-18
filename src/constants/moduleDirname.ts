import path from 'path';

/**
 * Подняться на уровень выше так как файл внутри папки constants
 */
export const moduleDirname = path.join(import.meta.dirname, '../');
