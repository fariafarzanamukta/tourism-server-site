const express = require('express')
var cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

const app = express()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ycmdl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("alFathTourism");
        const packagesCollection = database.collection("Packages");


        const orderCollection = database.collection("order");


        //GET PACKAGES API
        app.get('/Packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        //GET Single Pack
        app.get('/Packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
        })


        //POST
        app.post('/Packages', async (req, res) => {
            const package = req.body;
            const result = await packagesCollection.insertOne(package);
            console.log(result);
            res.json(result)
        })

        app.get('/Order', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        })

        app.post('/Order', async (req, res) => {
            const order = req.body;
            
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result)
        })
        //get my order
        app.get('/Order/:email', async (req, res) => {
            // console.log(req.params.email);

            const result = await orderCollection.find({ email: req.params.email }).toArray();
            res.json(result);
        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)       
})