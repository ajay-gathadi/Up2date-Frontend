import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import PhoneIcon from "@mui/icons-material/Phone";
import { useState } from "react";

function MobileNumber({ value = "", onChange, error = null }) {
  const [touched, setTouched] = useState(false);

  const handleMobileChange = (event) => {
    const input = event.target.value;
    if (input === "" || (/^[0-9]+$/.test(input) && input.length <= 10)) {
      onChange(input);
    }
  };

  const getErrorMessage = () => {
    if (touched && value && value.length !== 10) {
      return "Mobile number must be 10 digits";
    }
    return error;
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <TextField
      id="mobileNumber"
      type="tel"
      label="Mobile Number"
      value={value}
      onChange={handleMobileChange}
      onBlur={handleBlur}
      variant="outlined"
      inputMode="numeric"
      placeholder="Enter Mobile Number"
      minLength={10}
      error={Boolean((value && value.length !== 10) || error)}
      helperText={getErrorMessage()}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon />
            </InputAdornment>
          ),
        },
        htmlInput: {
          maxLength: 10,
          pattern: "[0-9]*",
          inputMode: "numeric",
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
