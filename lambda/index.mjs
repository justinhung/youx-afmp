import { MongoClient, ObjectId } from 'mongodb'

let cachedClient = null

// Connect to MongoDB and allow connection pooling
async function connectToMongoDB() {
  try {
    if (cachedClient) return cachedClient;

    const client = new MongoClient(process.env.ATLAS_URI);
  
    await client.connect();
    cachedClient = client;
    return client;
  } catch (err) {
    console.error(err)
  }
}

  /**
   * Handle API Gateway events.
   * @param {Object} event - An object containing the HTTP method, path, and request body.
   * @returns {Object} An object with the following properties:
   *   - statusCode: The HTTP status code for the response.
   *   - body: The response body as a JSON string.
   *   - headers: An object with HTTP headers.
   */
export const handler = async (event) => {
  const { httpMethod, path, body } = event 
  let data, collection, query;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://main.d2060macrmw9rl.amplifyapp.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  };
  const client = await connectToMongoDB()
  const db = client.db('youx-afmp')

  try {
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers,
      };
    } else if (path.startsWith('/applications/')) {
      const userId = path.split('/').pop();
      if (!userId) {
        throw new Error("Missing user ID in path parameters.");
      }
      switch (httpMethod) {
        // get a single application
        case 'GET':
          collection = db.collection("applications");
          query = {_id: new ObjectId(userId)};
          let result = await collection.findOne(query);

          if (!result) {
            data = "Not found"
            statusCode = 404
          } else {
            data = {
              ...result,
              id: result._id,
            }
          }
          break;
        // update application
        case 'PATCH':
          query = { _id: new ObjectId(userId) };
          const updates = {
            $set: {
              ...JSON.parse(body),
              status: 'Pending'
            }
          };

          collection = db.collection("applications");
          await collection.updateOne(query, updates);
          break;
      }
    } else if (path === '/applications') {
      switch (httpMethod) {
        // delete multiple applications
        case 'DELETE':
          const reqBody = JSON.parse(body);
          if (!reqBody.ids || !Array.isArray(reqBody.ids)) {
            throw new Error("Invalid or missing IDs in request body.");
          }
          query = {
            _id: {
              "$in": reqBody.ids.map((id) => new ObjectId(id))
            }
          };
        
          collection = db.collection("applications");
          await collection.deleteMany(query);
          break;
        // get all applications
        case 'GET':
          collection = db.collection("applications");
          let results = await collection.find({}).toArray();
          data = results.map((doc) => {
            doc.id = doc._id.toString();
            return doc
          });
          break;
        // create a new application
        case 'POST':
          collection = db.collection("applications");
          let newDocument = JSON.parse(body)
          newDocument.date = new Date();
          newDocument.status = 'Pending';
          await collection.insertOne(newDocument);
          break;
        default:
          throw new Error(`Unsupported method "${httpMethod}"`);
      }
    } else {
      statusCode = 404;
      throw new Error(`Unkown path`);
    }
  } catch (err) {
    statusCode = 400;
    data = { error: err.message };
  } finally {
    data = JSON.stringify(data);
  }

  return {
    statusCode,
    body: data,
    headers,
  };
};