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
  Menu,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowDownward,
  ArrowUpward,
  KeyboardArrowUp,
} from "@mui/icons-material";

function Services({ value, onChange, gender, error = null }) {
  const [services, setServices] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [alwaysOpen, setAlwaysOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const formControlRef = useRef(null);
  const outlinedInputRef = useRef(null);

  console.log(
    `%cRENDER: alwaysOpen=<span class="math-inline">\{alwaysOpen\}, isOpen\=</span>{isOpen}, anchorEl=${
      anchorEl ? "exists" : "null"
    }`,
    "color: blue; font-weight: bold;"
  );

  const handleClick = (event) => {
    if (!alwaysOpen) {
      setAnchorEl(event.currentTarget);
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    if (!alwaysOpen) {
      setAnchorEl(null);
      setIsOpen(false);
    }
  };

  const handleToggleMode = (event, newCheckedState) => {
    event.stopPropagation();
    console.log(
      `%cHANDLE_TOGGLE_MODE: newCheckedState=<span class="math-inline">\{newCheckedState\}, current alwaysOpen\=</span>{alwaysOpen}`,
      "color: green; font-weight: bold;"
    );

    setAlwaysOpen(newCheckedState);

    if (!newCheckedState) {
      console.log(
        "%cHANDLE_TOGGLE_MODE: Setting to OFF state (anchor=null, isOpen=false)",
        "color: green;"
      );
      setAnchorEl(null);
      setIsOpen(false);
    } else {
      console.log(
        "%cHANDLE_TOGGLE_MODE: Setting to ON state (anchor=ref, isOpen=true)",
        "color: green;"
      );
      setAnchorEl(outlinedInputRef.current);
      setIsOpen(true);
    }
  };

  const toggleDropdown = (event) => {
    if (alwaysOpen) {
      return;
    }
    // setIsOpen((isOpen) => !isOpen);
    setIsOpen((prev) => {
      const willOpen = !prev;
      if (willOpen) {
        setAnchorEl(event?.currentTarget || outlinedInputRef.current);
        if (outlinedInputRef.current) {
          outlinedInputRef.current.focus();
        }
      } else {
        setAnchorEl(null);
      }
      return willOpen;
    });
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
        setFetchError(error.message);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    console.log(
      `%cEFFECT_CLICK_OUTSIDE: Setup. isOpen=<span class="math-inline">\{isOpen\}, alwaysOpen\=</span>{alwaysOpen}`,
      "color: orange;"
    );
    function handleClickOutside(event) {
      if (isOpen && !alwaysOpen) {
        if (
          formControlRef.current &&
          !formControlRef.current.contains(event.target) &&
          !(anchorEl && anchorEl.parentNode.contains(event.target)) &&
          !event.target.closest(".MuiMenu-paper") &&
          !event.target.closest(".switch-container")
        ) {
          console.log("handleClickOutside called: closing");

          setIsOpen(false);
          setAnchorEl(null);
        } else {
          console.log("handleClickOutside called: inside");
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, alwaysOpen, anchorEl]);

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

  const handleServiceChange = (serviceId, event) => {
    event.stopPropagation();
    if (value.includes(serviceId)) {
      onChange(value.filter((id) => id !== serviceId));
    } else {
      onChange([...value, serviceId]);
    }
  };

  const getDisplayValue = () => {
    if (value.length === 0) {
      return "Select Services";
    }

    // return filteredServices
    //   .filter((service) => value.includes(service.serviceId))
    //   .map((service) => service.serviceName)
    //   .join(", ");
  };

  const selectedServiceObject = useMemo(() => {
    if (!services || services.length === 0) return [];
    return value
      .map((id) => filteredServices.find((service) => service.serviceId === id))
      .filter(Boolean);
  }, [value, filteredServices, services]);

  const handleDeleteChip = (serviceIdToDelete) => {
    onChange(value.filter((id) => id !== serviceIdToDelete));
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ flexWrap: "wrap", gap: "3px", overflow: "auto" }}
      >
        {selectedServiceObject.map((currentService) => (
          <Chip
            key={currentService.serviceId}
            label={currentService.serviceName}
            onDelete={() => handleDeleteChip(currentService.serviceId)}
            size="small"
            sx={{
              fontFamily: "Inter",
              borderColor: "rgba(223, 168, 18, 0.69)",
              "& .MuiOutlinedInput-input": {
                display: "flex",
                alignItems: "center",
                padding: "2px 2px",
                fontSize: "14px",
                height: "auto",
                cursor: alwaysOpen ? "default" : "pointer",
              },
              "& .MuiChip-label": {
                color: "rgba(0,0,0,0.87",
              },
              "& .MuiChip-deleteIcon": {
                color: "rgba(0,0,0,0.54)",
                "&:hover": {
                  color: "rgba(0,0,0,0.87)",
                },
              },
            }}
          />
        ))}
      </Stack>
      <FormControl
        ref={formControlRef}
        fullWidth
        margin="normal"
        variant="outlined"
        error={Boolean(error)}
        sx={{
          width: "400px",
          position: "relative",
        }}
      >
        <InputLabel
          id="services-select-label"
          shrink={true}
          sx={{
            fontFamily: "Inter",
            color: error ? "error.main" : "black",
            "&.Mui-focused": {
              color: error ? "error.main" : "black",
            },
          }}
        >
          Services
        </InputLabel>

        {/* <Box
      className="switch-container"
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
          // onClick={(e) => e.stopPropagation()}
          color="primary"
        />
      </Box> */}

        <OutlinedInput
          ref={outlinedInputRef}
          id="services-select"
          label="Services"
          notched={true}
          onClick={(e) => {
            if (!alwaysOpen) {
              toggleDropdown(e);
            }
          }}
          // value={getDisplayValue()}
          error={Boolean(error)}
          readOnly
          endAdornment={
            !alwaysOpen && (
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(e);
                  if (outlinedInputRef.current) {
                    outlinedInputRef.current.focus();
                  }
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
              ? `${value.length} ${
                  value.length === 1 ? "service selected" : "services selected"
                }`
              : "Select Services"
          }
          sx={{
            fontFamily: "Inter",
            // fontSize: "14px",
            cursor: alwaysOpen ? "default" : "pointer",
            transition: "all 0.2s ease",
            height: "56px",
            "& .MuiOutlinedInput-root": {
              cursor: alwaysOpen ? "default" : "pointer",
            },

            "& .MuiOutlinedInput-input": {
              fontSize: "14px",
              textAlign: "center",
              color: value.length === 0 ? "rgba(0,0,0,0.38)" : "inherit",
              cursor: alwaysOpen ? "default" : "pointer",
              textOverflow: "ellipsis",
              overflow: "auto",
              whiteSpace: "normal",
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "rgba(223, 168, 18, 0.69)",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "rgba(223, 168, 18, 1)",
            },

            "&.Mui-focused": {
              borderColor: "rgba(223, 168, 18, 0.05)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: error ? "error.main" : "rgba(223, 168, 18, 0.69)",
              },
            },
          }}
        />

        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          keepMounted
          disableAutoFocusItem
          marginThreshold={0}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          slotProps={{
            list: {
              disablePadding: true,
              onClick: (e) => e.stopPropagation(),
              sx: {
                maxHeight: "200px",
                overflowY: "auto",
              },
            },
            paper: {
              sx: {
                mt: "4px",
                height: "auto",
                maxHeiht: "200px",
                width: anchorEl ? `${anchorEl.offsetWidth}px` : "auto",
                overflowY: "auto",
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },

                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(155, 38, 38, 0.05)",
                  borderRadius: "4px",
                },

                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.58)",
                  },
                },
              },
            },
          }}
        >
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
          ) : fetchError ? (
            <MenuItem disabled>
              <Alert severity="error" sx={{ mt: 1 }}>
                Error loading services: {fetchError}
              </Alert>
            </MenuItem>
          ) : filteredServices.length === 0 ? (
            <MenuItem disabled>
              <Alert severity="info" sx={{ mt: 1 }}>
                No services available for {gender || "selected gender"}
              </Alert>
            </MenuItem>
          ) : (
            filteredServices.map((currentService) => (
              <MenuItem
                key={currentService.serviceId}
                onClick={(e) => {
                  e.stopPropagation();
                  handleServiceChange(currentService.serviceId, e);
                }}
                disableRipple
                sx={{
                  fontFamily: "Inter",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Checkbox
                  checked={value.includes(currentService.serviceId)}
                  size="small"
                  sx={{
                    "&.Mui-checked": {
                      color: "rgba(223, 168, 18, 0.69)",
                    },
                  }}
                />
                {currentService.serviceName}
              </MenuItem>
            ))
          )}
        </Menu>

        {/*       
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
        ) : fetchError ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            Error loading services: {fetchError}
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
      </Collapse> */}
      </FormControl>
    </>
  );
}

export default Services;
