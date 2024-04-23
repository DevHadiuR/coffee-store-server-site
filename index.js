const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the coffee store server site");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vuymtad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const coffeeId = req.params.id;
      const query = { _id: new ObjectId(coffeeId) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const coffeeId = req.params.id;
      const query = { _id: new ObjectId(coffeeId) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const newCoffeeData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffe = {
        $set: {
          coffeeName: newCoffeeData.coffeeName,
          coffeeSupplier: newCoffeeData.coffeeSupplier,
          coffeeCategory: newCoffeeData.coffeeCategory,
          coffeeChef: newCoffeeData.coffeeChef,
          coffeeTaste: newCoffeeData.coffeeTaste,
          coffeeDetails: newCoffeeData.coffeeDetails,
          coffeeUrl: newCoffeeData.coffeeUrl,
        },
      };
      const result = await coffeeCollection.updateOne(
        filter,
        updatedCoffe,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Coffee store server is running on port : ${port}`);
});
