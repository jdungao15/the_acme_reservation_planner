const express = require('express');
const app = express();
const {createTable,client } = require('./db.js')
const PORT = process.env.PORT || 3000;

app.use(express.json());




const init = async() => {
    await client.connect();
    console.log('Connected to DB....')

    await createTable();

    app.listen(PORT, () => {
        console.log(`Server listening on PORT${PORT}`)
    })
}

init();
