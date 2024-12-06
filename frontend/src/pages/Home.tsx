import { Layout } from "../layouts/Layout"
import { Box } from "@mui/material"
import ApplicationsTable from "../components/ApplicationsTable"
import React, { useEffect } from "react";

export default function Home() {
  const [applications, setApplications] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      setIsLoading(true)
      const results = await fetch(`${import.meta.env.VITE_API_URL}/applications`).then(resp => resp.json());
      setApplications(results);
      setIsLoading(false);
    }
    loadApplications();
  }, []);

  return (
    <Layout>
      <Box sx={{ p: 4, margin: "auto", alignContent: "center" }}>
        {isLoading && <p>Loading...</p>}
        {applications && (
          <ApplicationsTable applications={applications} />
        )}
      </Box>
    </Layout>
  );
}
