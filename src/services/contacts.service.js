import $http from "./http.service";

const basePath = "/contactdb/recipients";

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

const create = payload => $http.post(basePath, payload);

const remove = () => {};

export default { fetch, check, create, remove };
