import fs from "fs";

const check = path => {
    try {
        const stat = fs.lstatSync(path);
        return stat.isFile();
    } catch (_) {
        return false;
    }
};

const validate = payload => {
    const _required = ["title", "subject", "targets", "template", "subject"];
    const keys = Object.keys(payload);
    const found = _required.map(each => keys.includes(each));

    return !found.includes(false);
};

const parse = path => {
    if (!check(path)) return null;

    const settings = require(path);

    if (!validate(settings)) return null;

    return {
        tags: settings.tags || [],
        title: settings.title,
        subject: settings.subject,
        targets: settings.targets,
        template: settings.template,
    };
};

export default { parse };
