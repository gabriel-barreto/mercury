import axios from "axios";

const get = url =>
    new Promise((resolve, reject) => {
        if (!url) return reject(false);
        return axios
            .get(url, { headers: { Accept: "text/html" } })
            .then(response => resolve(response.data))
            .catch(() => resolve(null));
    });

export default { get };
