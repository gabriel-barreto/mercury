import $http from "./http.service";
import validator from "../utils/validator";

const basePath = "/contactdb/lists";
const _required = ["title"];

const create = listData =>
    new Promise((resolve, reject) => {
        if (validator.validate(_required, listData)) {
            return $http
                .post(basePath, listData)
                .then(({ data = {} }) => resolve(data.id || null))
                .catch(reject);
        }
        resolve(null);
    });

const fill = (listId, targets) => {
    if (!listId) return;
    else if (!targets) return;

    if (!(typeof listId == "number"))
        throw new Error("listId should be a number");
    else if (!(targets instanceof Array))
        throw new Error("targets should be an array of contact ids");

    if (targets.length < 1) return;

    return new Promise((resolve, _reject) => {
        return $http
            .post(`${basePath}/${listId}/recipients`, targets)
            .then(_ => resolve(true))
            .catch(_ => resolve(false));
    });
};

export default { create, fill };
