import { Layout } from "../layouts/Layout";
import {
  Box,
} from "@mui/material";
import ApplicationForm from "../components/ApplicationForm";


export default function NewApplication() {
  return (
    <Layout>
      <Box sx={{ p: 4, margin: "auto", alignContent: "center", maxWidth: "560px" }}>
        <ApplicationForm />
      </Box>
    </Layout>
  )
}