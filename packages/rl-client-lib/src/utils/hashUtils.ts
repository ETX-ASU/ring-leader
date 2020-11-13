const queryString = require('query-string');

const getHash = async ()  => {
    const parsed = queryString.parse(window.location.search);
    return parsed.hash;
};

const startParamsWithHash = async ()  => {
    const parsed = queryString.parse(window.location.search);
    return `?hash=${parsed.hash}`;
}

const hashParam = async ()  => {
    const parsed = queryString.parse(window.location.search);
    return `?hash=${parsed.hash}`;
}

export {getHash, startParamsWithHash, hashParam}
