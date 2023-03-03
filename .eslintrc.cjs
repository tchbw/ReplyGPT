module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    rules: {
        // "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/no-var-requires": "off", //webpack config uses require
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-unused-vars": "off"
    },
    env: {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true,
    }
};
