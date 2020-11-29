const queryString = require('query-string');

const getHash =  () : any  => {
    const parsed = queryString.parse(window.location.search);
    return parsed.hash;
};

const startParamsWithHash =  () : any  => {
    const parsed = queryString.parse(window.location.search);
    return `?hash=${parsed.hash}`;
}

const addHashParam =  () : any => {
    const parsed = queryString.parse(window.location.search);
    return `&hash=${parsed.hash}`;
}

export {getHash, startParamsWithHash, addHashParam}
