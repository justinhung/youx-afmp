import { Layout } from "../layouts/Layout";
import {
  Box,
} from "@mui/material";
import ApplicationForm from "../components/ApplicationForm";
import React from "react";
import { useParams } from "react-router-dom";

export default function ViewApplication() {
  const [application, setApplication] = React.useState(null);
  const { id } = useParams();

  React.useEffect(() => {
    const loadApplications = async () => {
      const results = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`).then(resp => resp.json());
      setApplication(results);
    }
    loadApplications();
  }, []);

  return (
    <Layout>
      <Box sx={{ p: 4, margin: "auto", alignContent: "center", maxWidth: "560px" }}>
        {application && (<ApplicationForm application={application} />)}
      </Box>
    </Layout>
  )
}