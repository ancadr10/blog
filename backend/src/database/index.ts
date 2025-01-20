import { connection } from "./connection";

// connection.sync({force: true});   //useful when creating the db tables
connection.sync();

export {
    connection
}