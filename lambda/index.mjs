import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(connectionString);

export const handler = async (event) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));
  const { httpMethod, path, pathParameters, body } = event 
  let data, collection, query;
  let statusCode = '200';
  const headers = {
      'Content-Type': 'application/json',
  };

  try {
    if (path.startsWith('/applications/')) {
      const userId = pathParameters?.id;
      switch (httpMethod) {
        case 'GET':
          collection = db.collection("applications");
          query = {_id: new ObjectId(userId)};
          let result = await collection.findOne(query);

          if (!result) {
            data = "Not found"
            statusCode = '404'
          } else {
            data = {
              ...result,
              id: result._id,
            }
          }
          break;
        case 'PUT':
          query = { _id: new ObjectId(userId) };
          const updates = {
            $set: {
              ...req.body,
              status: 'Pending'
            }
          };

          collection = db.collection("applications");
          await collection.updateOne(query, updates);
          break;
      }
    } else {
      switch (httpMethod) {
        case 'DELETE':
          query = {
            _id: {
              "$in": req.body.ids.map((id) => new ObjectId(id))
            }
          };
        
          collection = db.collection("applications");
          await collection.deleteMany(query);
          break;
        case 'GET':
          collection = db.collection("applications");
          let results = await collection.find({}).toArray();
          data = results.map((doc) => {
            doc.id = doc._id.toString();
            return doc
          });
          break;
        case 'POST':
          collection = db.collection("applications");
          let newDocument = req.body;
          newDocument.date = new Date();
          newDocument.status = 'Pending';
          await collection.insertOne(newDocument);
          break;
        default:
          throw new Error(`Unsupported method "${httpMethod}"`);
      }
    }
  } catch (err) {
    statusCode = '400';
    data = err.message;
  } finally {
    data = JSON.stringify(data);
  }

  return {
    statusCode,
    data,
    headers,
  };
};