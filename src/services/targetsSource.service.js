import csvParser from "csv-parser";
import fs from "fs";

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

const segment = items => {
    let offset = 0;
    let limit = 0;

    const slices = [];

    while (limit < items.length) {
        if (limit + 1000 < items.length) limit += 1000;
        else limit = items.length;

        slices.push(items.slice(offset, limit));
        offset = limit;
    }

    return slices;
};

export default { read, segment };
