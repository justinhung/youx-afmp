import express from "express";
import db from "../db/conn.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all applications
router.get("/", async (req, res) => {
  let collection = db.collection("applications");
  let results = await collection.find({})
    .toArray()
  res.send(results.map((doc) => {
    doc.id = doc._id.toString();
    return doc
  })).status(200);
});

// Get a single application
router.get("/:id", async (req, res) => {
  let collection = db.collection("applications");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) {
    res.send("Not found").status(404)
  } else {
    res.send({
      ...result,
      id: result._id,
    }).status(200);
  }
});

// Add a new document to the collection
router.post("/", async (req, res) => {
  let collection = db.collection("applications");
  let newDocument = req.body;
  newDocument.date = new Date();
  newDocument.status = 'Pending';
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// Update an application
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      ...req.body,
      status: 'Pending'
    }
  };

  let collection = db.collection("applications");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// Delete applications
router.delete("/", async (req, res) => {
  const query = {
    _id: {
      "$in": req.body.ids.map((id) => new ObjectId(id))
    }
  };

  const collection = db.collection("applications");
  let result = await collection.deleteMany(query);

  res.send(result).status(200);
});

export default router;