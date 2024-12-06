import { Layout } from "../layouts/Layout";
import {
  Box,
} from "@mui/material";
import ApplicationForm from "../components/ApplicationForm";
import { Application } from "../types";


export default function ViewApplication() {
  const application: Application = {
    id: 1,
    name: "John Doe",
    address: "123 Main St",
    salary: '50000',
    expenses: '10000',
    assets: '20000',
    liabilities: '5000',
  };

  return (
    <Layout>
      <Box sx={{ p: 4, margin: "auto", alignContent: "center", maxWidth: "560px" }}>
        <ApplicationForm application={application} />
      </Box>
    </Layout>
  )
}