import React from "react";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { Application } from "../types";
import { useNavigate } from "react-router-dom";

/**
 * A form for creating or editing an application. The form includes fields for
 * name, address, salary, expenses, assets, liabilities, and amount. The form
 * is validated client-side, and the data is sent to the API to be
 * saved/updated.
 *
 * @param {Object} props - The props passed to the component.
 * @param {Application} [props.application] - The application to edit, or null
 *   if creating a new application.
 * @returns {ReactElement} The rendered form.
 */
export default function ApplicationForm({ application }: { application?: Application | null }) {
  type Field = {
    name: 'name' | 'address' | 'salary' | 'expenses' | 'assets' | 'liabilities' | 'amount'
    label: string;
    prefix: boolean;
  }

  const [formData, setFormData] = React.useState({
    name: application?.name || '',
    address: application?.address || '',
    salary: application?.salary || '',
    expenses: application?.expenses || '',
    assets: application?.assets || '',
    liabilities: application?.liabilities || '',
    amount: application?.amount || '',
  });

  const [errors, setErrors] = React.useState({
    name: false,
    address: false,
    salary: false,
    expenses: false,
    assets: false,
    liabilities: false,
    amount: false,
  });

  const fields: Field[] = [
    {
      name: "name",
      label: "Full Name",
      prefix: false,
    },
    {
      name: "address",
      label: "Address",
      prefix: false,
    },
    {
      name: "salary",
      label: "Salary",
      prefix: true,
    },
    {
      name: "expenses",
      label: "Expenses",
      prefix: true,
    },
    {
      name: "assets",
      label: "Assets",
      prefix: true,
    },
    {
      name: "liabilities",
      label: "Liabilities",
      prefix: true,
    },
    {
      name: "amount",
      label: "Amount",
      prefix: true,
    },
  ]

  const prefix = {
    input: {
      startAdornment: (
        <InputAdornment position="start">$</InputAdornment>
      ),
    },
  }

  /**
   * Handles a change event for a form input. Updates the formData state
   * accordingly and sets an error for the input if the value is empty.
   * @param {{ target: { name: string; value: string | number; }; }} e - The event
   * containing the input element that triggered the change
   */
  const handleChange = (e: { target: { name: string; value: string | number; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: !value }); // further validation could be added here
  };

  const navigate = useNavigate()
  
  /**
   * Handles form submission, either by creating a new application or
   * patching an existing one.
   *
   * First, triggers form validation by setting the `errors` state with
   * the current form data. Then, checks if there are any errors. If there
   * are, does not continue with the submission.
   *
   * If there are no errors, sends a request to the API to either create
   * or patch an application. If the request is successful, redirects to
   * the homepage.
   */
  const submit = async () => {
    // trigger form validation
    setErrors({
      name: !formData.name,
      address: !formData.address,
      salary: !formData.salary,
      expenses: !formData.expenses,
      assets: !formData.assets,
      liabilities: !formData.liabilities,
      amount: !formData.amount
    });

    // check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) return

    if (application) {
      await fetch(`${import.meta.env.VITE_API_URL}/applications/${application.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      )
    } else {
      await fetch(`${import.meta.env.VITE_API_URL}/applications`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      )
    }
    navigate("/")
  }

  return (
    <Paper sx={{ p: 4 }}>
      <h2>{application ? "Edit Application" : "New Application"}</h2>
      <Box sx={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: 2 }}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            error={errors[field.name]}
            id={field.name}
            aria-describedby={field.name}
            variant="outlined"
            label={field.label}
            name={field.name}
            slotProps={field.prefix ? prefix : {}}
            required
            value={formData[field.name]}
            onChange={handleChange}
            helperText={errors[field.name] ? `${field.label} is required` : " "}
          ></TextField>
        ))}
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button type="submit" variant="outlined" href="/">Cancel</Button>
        <Button type="submit" variant="contained" disableElevation onClick={submit}>{application ? 'Update' : 'Submit'}</Button>
      </Box>
    </Paper>
  );
}
