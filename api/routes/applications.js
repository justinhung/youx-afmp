import express from "express";
import db from "../db/conn.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all applications
router.get("/", async (req, res) => {
  let collection = await db.collection("applications");
  let results = await collection.find({})
    .toArray()
  res.send(results.map((doc) => {
    doc.id = doc._id.toString();
    return doc
  })).status(200);
});

// Get a single application
router.get("/:id", async (req, res) => {
  let collection = await db.collection("applications");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Add a new document to the collection
router.post("/", async (req, res) => {
  let collection = await db.collection("applications");
  let newDocument = req.body;
  newDocument.date = new Date();
  newDocument.status = 'Pending';
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// Update an application
router.patch("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const updates = {
    $set: req.body
  };

  let collection = await db.collection("applications");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// Delete applications
router.delete("/applications", async (req, res) => {
  const query = {
    _id: {
      "$in": req.params.ids.map((id) => ObjectId(id))
    }
  };

  const collection = db.collection("applications");
  let result = await collection.delete(query);

  res.send(result).status(200);
});

export default router;