const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// madleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zchez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const jobsCollections = client.db("job-hunter").collection("jobs");
    const jobsApplicationCollections = client
      .db("job-hunter")
      .collection("job_applications");

    app.get("/jobs", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = {hr_email: email}
      }
      const cursor = jobsCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollections.findOne(query);
      res.send(result);
    });

    app.post("/jobs", async (req, res) => {
      const newJob = req.body;
      const result = await jobsCollections.insertOne(newJob);
      res.send(result);
    });

    // job application

    app.get("/job_applications", async (req, res) => {
      const email = req.query.email;
      const query = { applicantEmail: email };
      const result = await jobsApplicationCollections.find(query).toArray();

      // fokira way te aggregate data
      for (const data of result) {
        console.log(data.jobId);
        const query1 = { _id: new ObjectId(data.jobId) };
        const job = await jobsCollections.findOne(query1);

        if (job) {
          data.title = job.title;
          data.location = job.location;
          data.company = job.company;
          data.company_logo = job.company_logo;
        }
      }

      res.send(result);
    });

    app.get("/job_applications/jobs/:jobId", async (req, res) => {
      const jobId = req.params.jobId;
      const query = {jobId: jobId}
      const result = await jobsApplicationCollections.find(query).toArray()
      res.send(result)
    })

    // app.get("/job_applications/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await jobsApplicationCollections.findOne(query);
    //   res.send(result);
    // });

    app.post("/job_applications", async (req, res) => {
      const application = req.body;
      const result = await jobsApplicationCollections.insertOne(application);

      const id = application.jobId;
      const query = {_id: new ObjectId(id)}
      const job = await jobsCollections.findOne(query)

      let newCount = 0;
      if(job.applicationCount){
        newCount = job.applicationCount + 1;
      }else{
        newCount = 1;
      }

      const filter = {_id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          applicationCount: newCount
        }
      }

      const updateResult = await jobsCollections.updateOne(filter, updatedDoc);


      res.send(result);
    });

    app.delete("/job_applications/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsApplicationCollections.deleteOne(query);
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

app.get("/", (req, res) => {
  res.send("wellcome Backend");
});

app.listen(port, () => {
  console.log(`Server site connented on prot: ${port} `);
});
