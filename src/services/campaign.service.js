import $http from "./http.service";
import validator from "../utils/validator";

const basePath = "/campaign";
const _required = [
    "title",
    "subject",
    "list_ids",
    "sender_id",
    "categories",
    "html_content",
];

const create = payload =>
    new Promise((resolve, reject) => {
        if (!payload) return reject(false);
        else if (!validator.validate(_required, payload)) return reject(false);
        return $http
            .post(basePath, payload)
            .then(({ data }) => data.id || null)
            .then(resolve)
            .catch(reject);
    });
const shoot = () => {};

export default { create, shoot };
