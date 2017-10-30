const promisify = require('es6-promisify');
const fs = require('fs');
const child_process = require('child_process');
const GIFEncoder = require('gifencoder');
const Canvas = require('canvas');

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

const imagesToGif = (imageDatas, filePath, {
    width = 600,
    height = 400,
    repeat = true,
    delay = 2000,
    quality = 10
} = {}) => {
    var encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(fs.createWriteStream(filePath));
    encoder.start();
    encoder.setRepeat(repeat ? 0 : -1);
    encoder.setDelay(delay);
    encoder.setQuality(quality);

    imageDatas.forEach((data) => {
        let canvas = new Canvas(width, height);
        let ctx = canvas.getContext('2d');
        let img = new Canvas.Image;
        img.src = data;
        ctx.drawImage(img, 0, 0, width, height);
        encoder.addFrame(ctx);
    });

    return encoder.finish();
};

module.exports = {
    exec,
    base64ToPNG,
    imagesToGif
};
