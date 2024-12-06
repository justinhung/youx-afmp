import { Layout } from "../layouts/Layout"
import { Box } from "@mui/material"
import ApplicationsTable from "../components/ApplicationsTable"

export default function Home() {
  return (
    <Layout>
      <Box sx={{ p: 4, margin: "auto", alignContent: "center" }}>
        {ApplicationsTable()}
      </Box>
    </Layout>
  );
}
