const express = require('express');
const app = express();
const {client, createTable, createCustomer, createRestaurant, createReservation, fetchCustomers, fetchRestaurants,destroyReservation, fetchReservations} = require('./db.js')
const PORT = process.env.PORT || 5000;

app.use(express.json());



app.get('/api/customers', async(req,res,next) => {
    try {
        res.send(await fetchCustomers());
    } catch (error) {
        next(error)
    }
})

app.get('/api/restaurants', async(req,res,next) => {
    try {
        res.send(await fetchRestaurants());
    } catch (error) {
        next(error)
    }
})

app.get('/api/reservations', async(req,res,next) => {
    try {
        res.send(await fetchReservations());
    } catch (error) {
        next(error)
    }
})

app.post('/api/customers/:id/reservations', async (req,res,next) => {
    const {date, party_count, restaurant_id} = req.body;
    const customer_reservations = {
        date,
        party_count,
        restaurant_id,
        customer_id: req.params.id
    }

   
    try {
        const response = await createReservation(customer_reservations);
        res.send(response)
    } catch (error) {
        next(error);
    }
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
    const customer_id = req.params.customer_id;
    const reservationId = req.params.id;

    try {
        const result = await destroyReservation({customer_id, reservationId});
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});


const init = async() => {
    await client.connect();
    console.log('Connected to DB....')

    await createTable();
    const [john, maiden, matthew, redlobster,cast,jayhan]  = await Promise.all([
        createCustomer('John'), 
        createCustomer('Maiden'), 
        createCustomer('Matthew'), 
        createRestaurant('Red Lobster'), 
        createRestaurant('Cast Iron Pot'),
        createRestaurant('Jayhan\s Grill'),
    ]);

    const reservation1 = {
        date: '2023-05-13',
        party_count: 10,
        restaurant_id: redlobster.id,
        customer_id: john.id,

    }
       const reservation2 = {
        date: '2022-10-21',
        party_count: 10,
        restaurant_id: redlobster.id,
        customer_id: john.id,

    }
       const reservation3 = {
        date: '2024-11-05',
        party_count: 10,
        restaurant_id: redlobster.id,
        customer_id: john.id,

    }
       const reservation4 = {
        date: '2023-10-05',
        party_count: 10,
        restaurant_id: redlobster.id,
        customer_id: john.id,

    }

    // console.log(customers)
    const reservations = await Promise.all([
        createReservation(reservation1),
        createReservation(reservation2),
        createReservation(reservation3),
        createReservation(reservation4)

    ])

    app.listen(PORT, () => {
        console.log(`Server listening on PORT${PORT}`)
    })
}

init();
