import {
  Alert,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Box,
  FormLabel,
  Paper,
  Typography,
  Switch,
  IconButton,
  Collapse,
  InputLabel,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowDownward,
  ArrowUpward,
  KeyboardArrowUp,
} from "@mui/icons-material";

function Services({ value, onChange, gender }) {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [alwaysOpen, setAlwaysOpen] = useState(false);

  const handleToggleMode = () => {
    setAlwaysOpen((alwaysOpen) => !alwaysOpen);

    if (!alwaysOpen) {
      setIsOpen(true);
    }
  };

  const toggleDropdown = () => {
    if (!alwaysOpen) {
      setIsOpen((isOpen) => !isOpen);
    }
  };

  useEffect(() => {
    //Fetch services from the backend
    const fetchServices = async () => {
      try {
        const response = await fetch("/services");

        const contentType = response.headers.get("Content-Type");

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response: ", errorText);
          console.error("Status: ", response.status);
          throw new Error("Failed to fetch services");
        }

        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response from services: ", text);
          throw new Error("Services Response is not JSON");
        }

        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    if (!gender || gender === "") {
      return services;
    } else if (gender === "Male") {
      return services.filter(
        (currentService) => currentService.forMale === true
      );
    } else if (gender === "Female") {
      return services.filter((currentService) => {
        return currentService.forFemale === true;
      });
    }
    return services;
  }, [services, gender]);

  const handleServiceChange = (serviceId) => {
    if (value.includes(serviceId)) {
      onChange(value.filter((id) => id !== serviceId));
    } else {
      onChange([...value, serviceId]);
    }
  };

  const shouldAlwaysOpen = alwaysOpen || isOpen;

  return (
    <FormControl
      fullWidth
      margin="normal"
      variant="outlined"
      // component="fieldset"
      // margin="normal"
      // variant="outlined"
      sx={{ display: "flex", minHeight: "56px", position: "relative", pt: 1 }}
      // sx={{ width: "100%", position: "relative", pt: 1 }}
    >
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          mt: -4.5,
        }}
      > */}
      {/* <FormLabel
        component="legend"
        sx={{
          fontFamily: "Inter",
          position: "absolute",
          top: "-8px",
          left: "14px",
          padding: "0 4px",
          zIndex: 2,
          fontSize: "0.75rem",
          backgroundColor: "#fafafa",
          color: "black",
          pointerEvents: "none",
          transform: "translateY(0)",
          lineHeight: 1,
          "&.Mui-focuesd": {
            color: "black",
          },
          "&:hover": {
            color: "black",
          },
        }}
      >
        Services
      </FormLabel> */}

      <InputLabel
        id="services-select-label"
        shrink
        sx={{
          fontFamily: "Inter",
          position: "absolute",
          top: "-8px",
          left: "8px",
          fontSize: "0.8rem",
          padding: "0 5px",
          backgroundColor: "#fafafa",
          zIndex: 1,
          lineHeight: 1,

          color: "rgba(32, 28, 28, 0.73)",
          // transform: "none",
          "&.Mui-focused": {
            color: "rgba(223, 168, 18, 0.69)",
          },
        }}
      >
        Services
      </InputLabel>

      {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
      <Box
        sx={{
          position: "absolute",
          top: "4px",
          right: "10px",
          display: "flex",
          zIndex: 1,
          alignItems: "center",
        }}
      >
        <Typography variant="caption" sx={{ mr: 1, fontFamily: "Inter" }}>
          {alwaysOpen ? "Always Open" : "Close"}
        </Typography>
        <Switch
          size="small"
          checked={alwaysOpen}
          onChange={handleToggleMode}
          color="primary"
        />
      </Box>
      {/* </Box> */}

      <Box
        id="services-select"
        labelId="services-select-label"
        label="Services"
        notched={true}
        onClick={toggleDropdown}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          p: 1,
          mb: 0.1,
          mt: -1,
          cursor: alwaysOpen ? "default" : "pointer",
          "&:hover": {
            borderColor: alwaysOpen
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Typography fontFamily="Inter">
          {value.length > 0
            ? `${value.length} ${
                value.length === 1 ? "service" : "services"
              } selected`
            : "Select Services"}
        </Typography>

        {!alwaysOpen && (
          <Box
            component="span"
            onClick={(event) => {
              event.stopPropagation();
              toggleDropdown();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {isOpen ? <ArrowUpward /> : <ArrowDownward />}
          </Box>
        )}
      </Box>

      <Collapse in={shouldAlwaysOpen} timeout="auto">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            Error loading services: {error}
          </Alert>
        ) : filteredServices.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            No services available for {gender || "selected gender"}
          </Alert>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              maxHeight: "200px",
              overflowY: "auto",
              p: 1,
              // Firefox scrollbar properties
              // scrollbarWidth: "thin",
              // scrollbarColor: "rgba(0,0,0,0.2) rgba(0,0,0,0.05)",
              // WebKit scrollbar properties (Chrome, Safari)
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.58)",
                },
              },
            }}
          >
            <FormGroup>
              {filteredServices.map((currentService) => (
                <FormControlLabel
                  key={currentService.serviceId}
                  control={
                    <Checkbox
                      checked={value.includes(currentService.serviceId)}
                      onChange={() =>
                        handleServiceChange(currentService.serviceId)
                      }
                      color="primary"
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  label={currentService.serviceName}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontFamily: "Inter",
                    },
                    py: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      transform: "translateX(1px)",
                      borderRadius: "4px",
                    },
                  }}
                />
              ))}
            </FormGroup>
          </Paper>
        )}
      </Collapse>
    </FormControl>
  );
}

export default Services;
