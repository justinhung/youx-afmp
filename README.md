# Asset Finance Management Platform

Uses MERN stack along with Vite and MUI for development 

## How to start development server?
- run `npm install` in frontend and api
- create .env files in api and backend from .env.example
- to start api:
  - `node app.js`
  - uses port 3333
- to start frontend:
  - `npm run dev`
  - uses port 5173

## Deployment and CI/CD
- To deploy to AWS, commit code and push to main - this will automatically trigger GitHub Actions to zip the lambda folder and deploy it to AWS Lambda. For the frontend, AWS Amplify will build and redeploy the frontend as well when it sees that the main branch has been pushed to.
- Ensure that rewrites and redirects for /* are changed to 200, as Amplify will default to 404 as SPAs handle routing client side
- Ensure that API gateway is set up properly for CORS and sending data correctly through to the Lambda function.
- Environment variables are handled in the Lambda and Amplify environment variables, and can be found in .env.example for local development
  - The following environment variables are required for the backend:
    - DB_NAME: name of the MongoDB database.
    - ATLAS_URI: The URI of the MongoDB database.
  - and frontend:
    - VITE_API_URL: The URL of the API.

## Logging and Monitoring
CloudWatch is enabled to track usage and errors