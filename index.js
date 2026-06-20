const express = require("express");
const dontenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
dontenv.config();


const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        //fetching data from the databsse*
        const database = client.db("simpleCRUD")
        const ideasCollection = database.collection("ideas")
        app.get("/ideas", async (req, res) => {
            const ideas = await ideasCollection.find().toArray();
            res.send(ideas);
        });


        //showing every card in detailes
        app.get("/ideas/:id", async (req, res) => {
            const id = Number(req.params.id);

            const result = await ideasCollection.findOne({
                id: id,
            });

            res.send(result);
        });

        //ading user idea to the database
        app.post("/ideas", async (req, res) => {
            const idea = req.body;

            const result = await ideasCollection.insertOne(idea);

            res.send(result);
        });

        //showing login user ideas
        app.get("/my-ideas/:email", async (req, res) => {
            const email = req.params.email;

            const result = await ideasCollection.find({ createdBy: email }).toArray();

            res.send(result);
        });


        //showing limited data
        app.get("/trending-ideas", async (req, res) => {
            const result = await ideasCollection
                .find()
                .limit(6)
                .toArray();

            res.send(result);
        });



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// run().catch(console.dir);





app.get("/", (req, res) => {
    res.send("Server is running fine!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});