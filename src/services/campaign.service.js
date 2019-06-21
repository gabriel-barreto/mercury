import $http from "./http.service";

const basePath = "/campaign";

const create = () => $http.post(basePath);
const shoot = () => {};

export default { create, shoot };
