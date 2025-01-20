import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import 'dotenv/config';

function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}

const dialect: Dialect = process.env.DB_DIALECT as Dialect;
if (!dialect) {
    throw new Error("Invalid or missing DB_DIALECT in .env");
}

const host = getEnvVar("DB_HOST");
const username = getEnvVar("DB_USER");
const password = getEnvVar("DB_PASS");
const database = getEnvVar("DB_NAME");
const port = Number(process.env.DB_PORT) || 3306;
const models = [__dirname + '/../models'];

// Configurarea Sequelize
export const connection = new Sequelize({
    dialect,
    host,
    username,
    password,
    database,
    port,
    models
});
