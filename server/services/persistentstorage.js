const { uuid } = require('uuidv4');
const fs = require("fs");

class PersistentStorage {
    _directory = null;

    constructor() {
        this._directory = process.env.PERSISTENT_STORAGE_DIRECTORY || '_storage';
        
        if (!fs.existsSync(this._directory)) {
            fs.mkdirSync(this._directory);
        }
    }

    async saveFile(filename, localPath) {
        const fileType = filename.split('.').pop();
        const generatedFilename = `${uuid()}.${fileType}`;
        const path = `${this._directory}/${generatedFilename}`;
        await fs.promises.copyFile(localPath, path);

        return generatedFilename;
    }

    async loadFile(filename) {
        const path = `${this._directory}/${filename}`;
        return await fs.promises.readFile(path);
    }

    async deleteFile(filename) {
        const path = `${this._directory}/${filename}`;
        await fs.promises.unlink(path);
    }
}

module.exports = new PersistentStorage();