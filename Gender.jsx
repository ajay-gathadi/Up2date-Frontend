import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import MaleIcon from "@mui/icons-material/Man";
import FemaleIcon from "@mui/icons-material/Woman";

function Gender({ value, onChange }) {
  const handleGenderSelection = (event) => {
    onChange(event.target.value);
  };

  const interFontStyle = {
    fontFamily: "Inter",
  };

  return (
    <FormControl component="fieldset" margin="normal">
      <FormLabel
        component="legend"
        sx={{
          ...interFontStyle,
          "&.Mui-focused": {
            color: "black",
          },
          "&:hover": {
            color: "black",
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
              icon={<MaleIcon color="action" />}
              checkedIcon={<MaleIcon color="primary" />}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 28,
                },
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
              icon={<FemaleIcon color="action" />}
              checkedIcon={<FemaleIcon color="primary" />}
              sx={{
                "& .MuiSvgIcon-root": { fontSize: 28 },
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
