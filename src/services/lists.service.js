import $http from "./http.service";

const basePath = "/contactdb/lists";

const create = listData =>
    $http
        .post(basePath, listData)
        .then(({ data = {} }) => data.id || null)
        .catch(err => {
            throw err;
        });

const fill = () => {};

export default { create, fill };
