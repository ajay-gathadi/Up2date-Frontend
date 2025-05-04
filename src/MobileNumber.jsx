import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import PhoneIcon from "@mui/icons-material/Phone";

function MobileNumber({ value = "", onChange, error = null }) {
  const handleMobileChange = (event) => {
    const input = event.target.value;
    if (input === "" || /^[0-9]+$/.test(input)) {
      onChange(input);
    }
  };

  return (
    <TextField
      id="mobileNumber"
      label="Mobile Number"
      value={value}
      onChange={handleMobileChange}
      variant="outlined"
      inputMode="numeric"
      placeholder="Enter Mobile Number"
      maxLength={10}
      minLength={10}
      error={Boolean(error)}
      helperText={error}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon />
            </InputAdornment>
          ),
        },
      }}
      margin="normal"
      sx={{
        width: "400px",
        mt: 0,
        mb: 0,
        "& .MuiOutlinedInput-root": {
          color: "black",
          fontFamily: "Inter",
          "& fieldset": {
            borderColor: error ? "error.main" : "black",
          },
          "&:hover fieldset": {
            borderColor: error ? "error.main" : "black",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "error.main" : "black",
          },
        },
        "& .MuiInputLabel-root": {
          fontFamily: "Inter",
          color: error ? "error.main" : "black",
        },
      }}
    />
  );
}

export default MobileNumber;
