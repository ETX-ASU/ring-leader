module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
    },
    extends: [
        "plugin:promise/recommended", // Uses Rules for JavaScript Promises
        "plugin:import/errors", // Uses error rules for import
        "plugin:import/warnings", // Uses warning rules for import
        "plugin:import/typescript", // Uses typescript rules for import
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:node/recommended", // Uses ESLint's rules of Node.js
        "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        "plugin:prettier/recommended"
    ],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        "node/shebang": 0,
        "node/no-missing-import": 0,
        "node/no-unsupported-features/es-syntax": [
            "error",
            { ignores: ["modules"] }
        ],
        "@typescript-eslint/interface-name-prefix": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/ban-ts-ignore": 0,
        "@typescript-eslint/camelcase": 0,
        "promise/always-return": 0,
        "promise/no-promise-in-callback": 0,
        "@typescript-eslint/no-this-alias": 0,
        "node/no-unpublished-import": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        trailingComma: 0
    },
    overrides: [{
        files: ["src/*", "test/*"],
        excludedFiles: ["build/*"]
    }]
};