import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";

function Employee({ value = "", onChange, error = null }) {
  const [employees, setEmployees] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch("/employees");

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data = await response.json();
        setEmployees(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees: ", error);
        setFetchError(error.message);
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  function handleEmployeeChange(event) {
    const selectedEmployee = event.target.value;
    onChange(selectedEmployee);
  }

  const getEmployeeName = () => {
    if (!value || employees.length === 0) return "";
    const employee = employees.find(
      (currentEmployee) => currentEmployee.employeeId === Number(value)
    );
    return employee ? employee.employeeName : "";
  };

  return (
    <FormControl
      fullWidth
      margin="normal"
      error={Boolean(error)}
      sx={{
        width: "400px",
      }}
    >
      <InputLabel
        id="employee-select-label"
        shrink={true}
        sx={{
          fontFamily: "Inter",
          color: error ? "error.main" : "text.primary",
          "&.Mui-focused": {
            color: error ? "error.main" : "black",
          },
        }}
      >
        Employee
      </InputLabel>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : fetchError ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {fetchError}
        </Alert>
      ) : (
        <Select
          labelId="employee-select-label"
          id="employee-select"
          value={value}
          onChange={handleEmployeeChange}
          label="Employee"
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontFamily: "Inter",
                    ml: 0.5,
                    fontSize: "14px",
                  }}
                >
                  Select Employee
                </Typography>
              );
            }

            return (
              <Chip
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 24,
                      height: 24,
                      "& .MuiSvgIcon-root": {
                        fontSize: 16,
                      },
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                }
                label={getEmployeeName()}
                sx={{ fontFamily: "Inter" }}
              />
            );
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "rgba(223, 168, 18, 0.69)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "rgba(223, 168, 18, 0.69)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "rgba(223, 168, 18, 0.69)",
            },
            fontFamily: "Inter",
          }}
          MenuProps={{
            PaperProps: {
              style: { maxHeight: 48 * 4.5 },
            },
          }}
        >
          <MenuItem disabled value="">
            <Typography sx={{ fontFamily: "Inter", fontSize: "14px" }}>
              Select Employee
            </Typography>
          </MenuItem>

          {employees.length === 0 ? (
            <MenuItem disabled>
              <Typography sx={{ fontFamily: "Inter" }}>
                No Employees Found
              </Typography>
            </MenuItem>
          ) : (
            employees.map((currentEmployee) => (
              <MenuItem
                key={currentEmployee.employeeId}
                value={currentEmployee.employeeId}
                sx={{
                  fontFamily: "Inter",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 22,
                      height: 22,
                      mr: 1,
                      bgcolor: "rgba(223, 168, 18, 0.69)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {currentEmployee.employeeName[0]}
                  </Avatar>
                  {currentEmployee.employeeName}
                </Box>
              </MenuItem>
            ))
          )}
        </Select>
      )}
    </FormControl>
  );
}

export default Employee;
