import csvParser from "csv-parser";
import fs from "fs";
import { promisify } from "util";

const mapperOptions = { skipLines: 1, headers: ["name", "email"] };

const read = filepath =>
    new Promise((resolve, reject) => {
        if (!filepath) return resolve([]);

        try {
            const stats = fs.statSync(filepath);
            if (!stats.isFile()) return resolve([]);
        } catch (_) {
            return resolve([]);
        }

        const rows = [];
        fs.createReadStream(filepath)
            .pipe(csvParser(mapperOptions))
            .on("data", row => rows.push({ ...row }))
            .on("end", () => resolve(rows))
            .on("error", reject);
    });

module.exports = { read };
