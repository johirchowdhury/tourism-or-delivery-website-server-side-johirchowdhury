const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjijy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("best-travel-agent");
        const ServiceCollection = database.collection("service");
        const orderCollection = database.collection("order");
        //GET API
        app.get('/services', async (req, res) => {
            const cursor = ServiceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //GET SINGLE DATA
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await ServiceCollection.findOne(query);
            res.send(services);
        })
        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the database', service)
            const result = await ServiceCollection.insertOne(service);
            // console.log('post hitted');
            res.json(result);
        })
        //use POST to get data by keys
        app.post('/services/byKeys', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await ServiceCollection.find(query).toArray();
            res.json(products);
        })
        //delete data
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ServiceCollection.deleteOne(query);
            res.send(result);
        })
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders)
            // console.log(result)
            res.send(result);
        })

        app.get('/myorder', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const order = orderCollection.find(query);
            const result = await order.toArray();
            console.log(result);
            res.json(result);
        })
        app.get('/manageOrder', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            console.log(orders)
            res.send(orders);
        })
        app.delete('/manageOrder/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running Genius Server, Updated");
});
app.listen(port, () => {
    console.log("Running Genius Server and Port", port);
})


//dbname: genius
//pass: xvACFiGL3OncU1Ca