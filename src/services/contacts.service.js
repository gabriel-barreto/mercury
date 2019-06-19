import $http from "./http.service";
import validator from "../utils/validator";

const basePath = "/contactdb/recipients";
const _required = ["first_name", "last_name", "email"];

const fetchAll = (page = 1, pageSize = 1000) =>
    $http
        .get(basePath, { params: { page, page_size: pageSize } })
        .then(({ data }) => data.recipients)
        .then(found => found.map(each => each.id))
        .catch(err => {
            throw err;
        });

const fetch = email =>
    new Promise((resolve, reject) => {
        if (email) {
            const options = { params: { email } };

            return $http
                .get(`${basePath}/search`, options)
                .then(raw => raw.data)
                .then(response => {
                    if (response) return response;
                    resolve({});
                })
                .then(({ recipient_count: count, recipients }) => {
                    if (count > 0) return recipients;
                    resolve({});
                })
                .then(([{ id, email, last_name, first_name }]) =>
                    resolve({ id, email, last_name, first_name })
                )
                .catch(reject);
        }

        resolve({});
    });

const check = email =>
    new Promise((resolve, reject) => {
        return fetch(email)
            .then(contact => {
                if (Object.keys(contact).includes("id")) resolve(true);
                resolve(false);
            })
            .catch(reject);
    });

const create = payload =>
    new Promise((resolve, reject) => {
        if (validator.validate(_required, payload)) {
            $http
                .post(basePath, [payload])
                .then(response => response.data)
                .then(({ persisted_recipients }) =>
                    resolve(persisted_recipients)
                )
                .catch(reject);
        }
        resolve({});
    });

const remove = contactId =>
    new Promise((resolve, reject) => {
        if (contactId) {
            return $http
                .delete(`${basePath}/${contactId}`)
                .then(() => resolve(true))
                .catch(reject);
        }
        resolve(false);
    });

const removeAll = () =>
    new Promise(async (resolve, reject) => {
        try {
            const targets = await fetchAll();
            const promises = targets.map(each => remove(each));

            Promise.all(promises)
                .then(resolve)
                .catch(reject);
        } catch (ex) {
            throw ex;
        }
    });

export default { fetchAll, fetch, check, create, remove, removeAll };
