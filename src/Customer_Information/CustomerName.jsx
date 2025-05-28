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
        "& input": {
          textAlign: "center",
          fontSize: "14px",
          paddingRight: "50px !important",
        },
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
            borderColor: "rgba(223, 168, 18, 0.69)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(223, 168, 18, 0.69)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "rgba(223, 168, 18, 0.69)",
          },
        },
      }}
    />
  );
}

export default CustomerName;
