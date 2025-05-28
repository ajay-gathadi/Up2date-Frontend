import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import MaleIcon from "@mui/icons-material/Man";
import FemaleIcon from "@mui/icons-material/Woman";

function Gender({ value, onChange, error = null }) {
  const handleGenderSelection = (event) => {
    onChange(event.target.value);
  };

  const interFontStyle = {
    fontFamily: "Inter",
  };

  return (
    <FormControl component="fieldset" margin="normal" error={Boolean(error)}>
      <FormLabel
        component="legend"
        sx={{
          ...interFontStyle,
          color: error ? "error.main" : "text.primary",
          "&.Mui-focused": {
            color: error ? "error.main" : "black",
          },
          "&:hover": {
            color: error ? "error.main" : "black",
          },
        }}
      >
        Gender
      </FormLabel>
      <RadioGroup
        row
        aria-label="gender"
        name="gender"
        value={value}
        onChange={handleGenderSelection}
      >
        <FormControlLabel
          value="Male"
          control={
            <Radio
              icon={<MaleIcon color={error ? "error" : "action"} />}
              checkedIcon={<MaleIcon color={error ? "error": "rgba(223, 168, 18, 0.69)"} />}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 28,
                },

                '&.Mui-checked':{
                  color: 'rgba(223, 168, 18, 0.69)'
                },

                '&:hover' : {
                  backgroundColor: 'rgba(223, 168, 18, 0.04)'
                }
              }}
            />
          }
          label="Male"
          sx={{
            // mr: 2,
            // borderRadius: "8px",
            // padding: "6px 12px",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-3px) scale(1.05)",
              //   boxShadow: "0 10px 20px rgba(36, 32, 32, 0.1)",
              cursor: "pointer",
              "& .MuiSvgIcon-root": {
                transform: "scale(1.05)",
              },
            },
            "& .MuiFormControlLabel-label": interFontStyle,
          }}
        />
        <FormControlLabel
          value="Female"
          control={
            <Radio
              icon={<FemaleIcon color={error ? "error" : "action"} />}
              checkedIcon={<FemaleIcon color={error ? "error" : "rgba(223, 168, 18, 0.69)"} />}
              sx={{
                "& .MuiSvgIcon-root": { fontSize: 28 },
                '&.Mui-checked':{
                  color: 'rgba(223, 168, 18, 0.69)'
                },

                '&:hover' : {
                  backgroundColor: 'rgba(223, 168, 18, 0.04)'
                }
              }}
            />
          }
          label="Female"
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-3px) scale(1.05)",
              cursor: "pointer",
              "& .MuiSvgIcon-root": {
                transform: "scale(1.05)",
              },
            },
            "& .MuiFormControlLabel-label": interFontStyle,
          }}
        />
      </RadioGroup>
    </FormControl>
  );
}

export default Gender;
