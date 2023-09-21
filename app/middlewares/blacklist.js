const blacklistedTokens = new Set();

const add = (token) => {
    blacklistedTokens.add(token);
};

const contains = (token) => {
    return blacklistedTokens.has(token);
};

module.exports = { add, contains };