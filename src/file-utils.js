import fs from 'fs';
import path from 'path';

export function existsFile(filePath) {
    try {
        return fs.statSync(filePath);
    } catch (e) {
        return false;
    }
}

export function readFile(filePath, bin = false) {
    return fs.readFileSync(filePath, bin ? null : 'utf8');
}

export function writeFile(filePath, data, bin = false) {
    mkDirRecursively(path.dirname(filePath));
    fs.writeFileSync(filePath, data, bin ? null : 'utf8');
}

function mkDirRecursively(folderPath) {
    const parentPath = path.dirname(folderPath);

    if (!existsFile(parentPath)) {
        mkDirRecursively(parentPath);
    }

    const stat = existsFile(folderPath);

    if (!stat) {
        fs.mkdirSync(folderPath);
    } else if (stat.isFile()) {
        throw `Found file on ${folderPath} while creating a folder`;
    }
}

export function walkDir(pathToWalk, cb) {
    let stat = existsFile(pathToWalk);

    if (!stat || stat.isFile()) return;

    fs.readdirSync(pathToWalk).forEach((filePath) => {
        const fullFilePath = `${pathToWalk}${path.sep}${filePath}`;
        stat = fs.statSync(fullFilePath);

        if (stat.isFile()) {
            cb(fullFilePath, false);
        } else if (stat.isDirectory()) {
            walkDir(fullFilePath, cb);
        }
    });

    cb(pathToWalk, true);
}
