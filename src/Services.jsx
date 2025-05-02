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
  OutlinedInput,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React, { useState, useEffect, useMemo, useRef } from "react";
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

  const servicesRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && !alwaysOpen) {
        if (
          servicesRef.current &&
          !servicesRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, alwaysOpen]);

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
      ref={servicesRef}
      fullWidth
      margin="normal"
      variant="outlined"
      sx={{
        width: "400px",
      }}
    >
      <InputLabel
        id="services-select-label"
        shrink={true}
        sx={{
          fontFamily: "Inter",
          color: "black",
          "&.Mui-focused": {
            color: "black",
          },
        }}
      >
        Services
      </InputLabel>

      <Box
        sx={{
          position: "absolute",
          top: "-25px",
          right: "10px",
          display: "flex",
          zIndex: 1,
          alignItems: "center",
        }}
      >
        <Typography variant="caption" sx={{ mr: 1, fontFamily: "Inter" }}>
          {shouldAlwaysOpen ? "Always Open" : "Click to open"}
        </Typography>
        <Switch
          size="small"
          checked={alwaysOpen}
          onChange={handleToggleMode}
          color="primary"
        />
      </Box>

      <OutlinedInput
        id="services-select"
        label="Services"
        notched={true}
        onClick={toggleDropdown}
        readOnly
        endAdornment={
          !alwaysOpen && (
            <Box
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "4px",
                marginRight: "8px",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {isOpen ? <ArrowUpward /> : <ArrowDownward />}
            </Box>
          )
        }
        value={
          value.length > 0
            ? `${value.length} ${value.length === 1 ? "service" : "services"}`
            : "Select Services"
        }
        sx={{
          fontFamily: "Inter",
          // fontSize: "14px",
          cursor: alwaysOpen ? "default" : "pointer",
          "&:hover": {
            borderColor: alwaysOpen
              ? "rgba(0, 0, 0, 0.23)"
              : "rgba(0, 0, 0, 0.5)",
          },

          "& .MuiOutlinedInput-input": {
            fontSize: "14px",
          },
        }}
      />

      <Collapse in={shouldAlwaysOpen} timeout="auto">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 2,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            Error loading services: {error}
          </Alert>
        ) : filteredServices.length === 0 ? (
          <Alert severity="info" sx={{ mt: 1 }}>
            No services available for {gender || "selected gender"}
          </Alert>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              mt: 1,
              maxHeight: "200px",
              overflowY: "auto",
              p: 1,
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
                      size="small"
                      checked={value.includes(currentService.serviceId)}
                      onChange={() =>
                        handleServiceChange(currentService.serviceId)
                      }
                      // color="warning"
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                      sx={{
                        "&.Mui-checked": {
                          color: "rgba(223, 168, 18, 0.69)",
                        },
                      }}
                    />
                  }
                  label={currentService.serviceName}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontWeight: 500,
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
