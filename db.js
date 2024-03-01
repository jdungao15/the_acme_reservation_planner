const pg = require("pg");
const client =
  new pg.client(process.env.DATABASE_URL) || "localhost://restaurant_db";

const createTable = async () => {


  const SQL = `
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS restaurants;
        DROP TABLE IF EXISTS reservations;

        CREATE TABLE customers(
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );

        CREATE TABLE restaurants(
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );

        CREATE TABLE reservations(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant UUID REFERENCES restaurants(id) NOT NULL,
            customer_id UUID REFERENCES customers(id) NOT NULL
        );
    `;
    await client.query(SQL);
  console.log("database seeded");
};


modules.exports = {client, createTable}