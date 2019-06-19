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

const fill = () => {};

export default { create, fill };
