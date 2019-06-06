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

const validatePayload = payload => {
    const required = ["first_name", "last_name", "email"];
    const found = required.filter(each => payload[each]);

    return found.length === required.length;
};

const create = payload =>
    new Promise((resolve, reject) => {
        if (validatePayload(payload)) {
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

export default { fetch, check, create, remove };
