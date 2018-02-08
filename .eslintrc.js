module.exports = {
    "extends": "google",
    "parserOptions": {
        "ecmaVersion": 8,
    },
    "env": {
        "node": true,
    },
    "rules": {
        "max-len": ["error", {"code": 100}],
        "camelcase": "off", // Off for destructuring
        "async-await/space-after-async": 2,
        "async-await/space-after-await": 2,
    },
    "plugins": ["async-await"],
};