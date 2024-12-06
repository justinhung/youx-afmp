import "./loadEnvironment.js";
import express from 'express';
import cors from 'cors';
import applications from './routes/applications.js';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/applications', applications);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});