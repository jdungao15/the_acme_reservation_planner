const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL) || "localhost://restaurant_db";
const uuid = require('uuid')


const createCustomer = async (name) => {
    const SQL = `
        INSERT INTO customers(id,name) VALUES($1,$2)
        RETURNING *
    
    `
    const res = await client.query(SQL, [uuid.v4(), name])
    return res.rows[0];
}

const createRestaurant = async (name) => {
    const SQL = `
        INSERT INTO restaurants(id,name) VALUES($1,$2)
        RETURNING *
    `
    const res = await client.query(SQL, [uuid.v4(), name]);
    return res.rows[0];
}

const fetchCustomers = async () => {
    const SQL = `
        SELECT * FROM customers
    `
    const res = await client.query(SQL);
    return res.rows;
}

const fetchReservations = async () => {
    const SQL = `
        SELECT * FROM reservations
    `
    const res = await client.query(SQL)
    return res.rows;
}

const fetchRestaurants = async () => {
    const SQL = `
        SELECT * FROM restaurants
    `
    const res = await client.query(SQL);
    return res.rows;
}

const createReservation = async ({date, party_count, restaurant_id, customer_id}) => {
    const SQL = `
        INSERT INTO reservations(id, date, party_count, restaurant_id, customer_id) VALUES($1,$2,$3,$4,$5)
        RETURNING *
    
    `
    const response = await client.query(SQL, [uuid.v4(), date, party_count, restaurant_id, customer_id]);
    return response.rows;
}

const destroyReservation = async ({reservationId, customer_id}) => {
    const SQL = `
        DELETE FROM reservations WHERE id=$1 AND customer_id = $2
    
    `
    const response = await client.query(SQL,[reservationId, customer_id]);
    return response.rows

}


const createTable = async () => {
  const SQL = `
        DROP TABLE IF EXISTS reservations;
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS restaurants;
        

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
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
            customer_id UUID REFERENCES customers(id) NOT NULL
        );
    `;
    await client.query(SQL);
  console.log("database seeded");
};


module.exports = {client, fetchReservations, createTable, createCustomer, createRestaurant, createReservation, fetchCustomers, fetchRestaurants,destroyReservation}