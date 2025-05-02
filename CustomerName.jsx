import { TextField, InputAdornment } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

function CustomerName({ value = "", onChange, error = null }) {
  const handleNameChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <TextField
      id="customerName"
      label="Customer Name"
      variant="outlined"
      value={value}
      onChange={handleNameChange}
      margin="normal"
      placeholder="Enter Customer Name"
      error={Boolean(error)}
      helperText={error}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        width: "400px",
        mt: 0,
        mb: 0,
        "& .MuiInputLabel-root": {
          color: error ? "error.main" : "black",
          fontFamily: "Inter",
        },
        "& .MuiInputLabel-root:hover": {
          color: "black",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "black",
        },
        "& .MuiOutlinedInput-root": {
          fontFamily: "Inter",
          "& fieldset": {
            borderColor: "black",
          },
          "&:hover fieldset": {
            borderColor: "black",
          },
          "&.Mui-focused fieldset": {
            borderColor: "black",
          },
        },
      }}
    />
  );
}

export default CustomerName;
