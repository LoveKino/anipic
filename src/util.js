const promisify = require('es6-promisify');
const fs = require('fs');
const child_process = require('child_process');

const writeFile = promisify(fs.writeFile);

function base64ToPNG(data, file) {
    data = data.replace(/^data:image\/png;base64,/, '');
    return writeFile(file, data, 'base64');
}


/**
 * collect information ny run a command
 */

const exec = (cmd, options = {}) => {
    return new Promise((resolve, reject) => {
        try {
            let child = child_process.exec(cmd, options, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        cmd,
                        stdout,
                        stderr
                    });
                }
            });

            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    exec,
    base64ToPNG
};
