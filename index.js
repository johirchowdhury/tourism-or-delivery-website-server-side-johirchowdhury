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
        //delete data
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ServiceCollection.deleteOne(query);
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