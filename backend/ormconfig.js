module.exports = {
    /*
     * Configurable
     */
    "host": process.env.TYPEORM_HOST || "localhost",
    "port": process.env.TYPEORM_PORT || 5432,
    "username": process.env.TYPEORM_USERNAME || "project_a",
    "password": process.env.TYPEORM_PASSWORD || "password",
    "database": process.env.TYPEORM_DATABASE || "project_a",
    "synchronize": process.env.TYPEORM_SYNCHRONIZE || false,
    "logging": (process.env.TYPEORM_LOGGING === "true") || false,

    /*
     * Fixed
     */
    "name": "default",
    "type": "postgres",
    "entities": [
        __dirname + '/dist/**/*.entity.js'
    ],
};