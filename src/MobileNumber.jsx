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

          "& input": {
            textAlign: "center",
            fontSize: "14px",
            paddingRight: "50px !important",
          },
          "& fieldset": {
            borderColor: error ? "error.main" : "rgba(223, 168, 18, 0.69)",
          },
          "&:hover fieldset": {
            borderColor: error ? "error.main" : "rgba(223, 168, 18, 0.69)",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "error.main" : "rgba(223, 168, 18, 0.69)",
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
