import CustomerName from "./CustomerName.jsx";
import MobileNumber from "./MobileNumber.jsx";
import Gender from "./Gender.jsx";
import React, { useState } from "react";
import Services from "./Services.jsx";
import Employee from "./Employee.jsx";
import PaymentMethod from "./PaymentMethod.jsx";
import salonName from "./assets/Up2Date Family Salon.png";
import {
  Alert,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  Button,
  Snackbar,
  Box,
} from "@mui/material";

export default function Customer() {
  const [customerData, setCustomerData] = useState({
    customerName: "",
    mobileNumber: "",
    gender: "",
    services: [],
    employeeName: "",
    paymentMethod: { cash: null, online: null, type: "cash" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const updateCustomerData = (key, value) => {
    setCustomerData((previousData) => ({ ...previousData, [key]: value }));

    if (formErrors[key]) {
      setFormErrors((previousErrors) => {
        const newErrors = { ...previousErrors };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const createCustomerServices = async (customerId) => {
    const services = customerData.services.map(async (serviceId) => {
      const totalAmount =
        Number(customerData.paymentMethod.cash) +
        Number(customerData.paymentMethod.online);

      let paymentMethodMode = "cash";
      if (
        customerData.paymentMethod.online > 0 &&
        customerData.paymentMethod.cash > 0
      ) {
        paymentMethodMode = "both";
      } else if (customerData.paymentMethod.online > 0) {
        paymentMethodMode = "online";
      }

      //CustomerServiceDTO Object
      const customerServiceData = {
        customerId: customerId,
        serviceId: serviceId,
        employeeId: Number(customerData.employeeName),
        paymentMethod: paymentMethodMode,
        amount: totalAmount / customerData.services.length,
        serviceTakenDate: new Date().toISOString(),
      };

      const sendResponseToBackend = await fetch("/customer-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerServiceData),
      });

      const responseText = await sendResponseToBackend.text();
      console.log("Full Response: ", responseText);

      if (!sendResponseToBackend.ok) {
        console.error("Service Creation Error: ", responseText);
        throw new Error(
          `Service creation failed: ${sendResponseToBackend.status}`
        );
      }

      return JSON.parse(responseText);
    });

    return Promise.all(services);
  };

  const validateForm = () => {
    const errors = {};

    if (!customerData.customerName) {
      errors.customerName = "Customer name is required";
    }

    if (!customerData.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    }

    if (!customerData.gender) {
      errors.gender = "Gender is required";
    }

    if (!customerData.services.length) {
      errors.services = "At least one service should be selected";
    }

    if (!customerData.employeeName) {
      errors.employeeName = "Please select an employee";
    }

    const totalPayment =
      (customerData.paymentMethod.cash || 0) +
      (customerData.paymentMethod.online || 0);
    if (totalPayment <= 0) {
      errors.paymentMethod =
        "Please enter the payment amount by selecting a payment method";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) {
      setNotification({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);

    console.log("Customer Data: ", customerData);

    try {
      const response = await fetch("/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerData.customerName,
          mobileNumber: customerData.mobileNumber,
          gender: customerData.gender,
        }),
      });

      const contentType = response.headers.get("Content-Type");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response: ", errorText);
        console.error("Status: ", response.status);
        console.error("Content-Type: ", contentType);
        throw new Error(`Customer creation failed: ${response.status}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response is not JSON: ", text);
        throw new Error("Response is not JSON");
      }

      //Get the id of the created customer
      const createdCustomer = await response.json();
      const customerId = createdCustomer.customerId;

      //Create customer service record
      await createCustomerServices(customerId);

      // alert("Data saved successfully");

      setCustomerData({
        customerName: "",
        mobileNumber: "",
        gender: "",
        services: [],
        employeeName: "",
        paymentMethod: { cash: null, online: null, type: "cash" },
      });
      // setSubmitted(true);
      setNotification({
        open: true,
        message: "Customer information saved successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving data: ", error);
      // setError(error.message);
      setNotification({
        open: true,
        message: error.message || "Failed to save customer information",
        severity: "error",
      });
      // alert("Error saving data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container
      maxWidth={false}
      // sx={{ py: 1 }}
    >
      {/* <Paper
        elevation={1}
        sx={{
          padding: 2,
          backgroundColor: "#fafafa",
          borderRadius: 2,
          overflowY: "auto",
        }}
        variant="outlined"
      > */}
      <Box
        sx={{
          pt: 1,
          position: "absolute",
          top: "-1px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        <img
          src={salonName}
          style={{
            height: "40px",
            objectFit: "contain",
          }}
        />
      </Box>

      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid lightgray",
          borderRadius: "8px",
          paddingTop: 1,
        }}
      >
        {/* {/* <Grid container spacing={3}> */}
        <Grid size={{ xs: 12, md: 10 }} sx={{ mx: "auto" }}>
          <Card variant="outlined" sx={{ height: "100%", border: "none" }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                mb: 1,
                fontFamily: "Inter",
                fontWeight: 600,
                paddingTop: "20px",
              }}
            >
              Customer Details
            </Typography>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
                  <CustomerName
                    value={customerData.customerName}
                    onChange={(value) =>
                      updateCustomerData("customerName", value)
                    }
                    error={formErrors.customerName}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }} sx={{ paddingTop: "0.5px" }}>
                  <MobileNumber
                    value={customerData.mobileNumber}
                    onChange={(value) =>
                      updateCustomerData("mobileNumber", value)
                    }
                    error={formErrors.mobileNumber}
                  />
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ mt: 1, paddingTop: 0.7 }}>
                  <Gender
                    value={customerData.gender}
                    onChange={(value) => updateCustomerData("gender", value)}
                    error={formErrors.gender}
                  />
                  {formErrors.gender && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 1,
                        ml: 2,
                        fontFamily: "Inter",
                      }}
                    >
                      {formErrors.gender}
                    </Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ mt: 1, paddingTop: 0.7 }}>
                  <Grid container spacing={2}>
                    <Grid
                      size={{ xs: 12, sm: 6 }}
                      // sx={{ mt: 1 }}
                    >
                      <Services
                        value={customerData.services}
                        onChange={(value) =>
                          updateCustomerData("services", value)
                        }
                        gender={customerData.gender}
                        error={formErrors.services}
                      />
                      {formErrors.services && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{ display: "block", mt: 1 }}
                        >
                          {formErrors.services}
                        </Typography>
                      )}
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Employee
                        value={customerData.employeeName}
                        onChange={(value) =>
                          updateCustomerData("employeeName", value)
                        }
                        error={formErrors.employeeName}
                      />
                      {formErrors.employeeName && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 1,
                            ml: 2,
                            fontFamily: "Inter",
                          }}
                        >
                          {formErrors.employeeName}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                    margin: "auto",
                    paddingTop: 0.8,
                  }}
                >
                  <Box sx={{ width: "100%", mx: "auto" }}>
                    <PaymentMethod
                      value={customerData.paymentMethod}
                      onChange={(value) =>
                        updateCustomerData("paymentMethod", value)
                      }
                    />

                    {formErrors.paymentMethod && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ display: "block", mt: 1 }}
                      >
                        {formErrors.paymentMethod}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* <Grid container justifyContent="center">
                      <Grid sx={{ mt: 1 }} size={{ xs: 12, sm: 10, md: 10, lg: 6 }}>
                        <PaymentMethod
                          value={customerData.paymentMethod}
                          onChange={(value) =>
                            updateCustomerData("paymentMethod", value)
                          }
                        />

                        {formErrors.paymentMethod && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ display: "block", mt: 1 }}
                          >
                            {formErrors.paymentMethod}
                          </Typography>
                        )}
                      </Grid>
                    </Grid> */}

                <Grid
                  size={{ xs: 12 }}
                  sx={{
                    // mt: 0.7,
                    paddingTop: 0.5,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="medium"
                    disabled={isLoading}
                    sx={{
                      backgroundColor: "rgba(223, 168, 18, 0.69)",
                      color: "black",
                      fontFamily: "Inter",
                      px: 4,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: 2,
                      "&:hover": {
                        backgroundColor: "rgba(223, 168, 18, 0.89)", // Slightly darker yellow on hover
                      },
                      "&:disabled": {
                        backgroundColor: "rgba(223, 168, 18, 0.3)", // Lighter yellow when disabled
                        color: "rgba(0, 0, 0, 1)", // Faded black when disabled
                      },
                    }}
                  >
                    {isLoading ? "Saving..." : "Submit"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* </Grid> */}
      </form>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      {/* </Paper> */}
    </Container>
  );

  // return (
  //   <div>
  //     <h1>Up2Date Family Salon</h1>
  //     <h5>Customer Information</h5>

  //     <form onSubmit={handleSubmit}>
  //       <CustomerName
  //         value={customerData.customerName}
  //         onChange={(value) => updateCustomerData("customerName", value)}
  //       />

  //       <MobileNumber
  //         value={customerData.mobileNumber}
  //         onChange={(value) => updateCustomerData("mobileNumber", value)}
  //       />

  //       <Gender
  //         value={customerData.gender}
  //         onChange={(value) => updateCustomerData("gender", value)}
  //       />

  //       <Services
  //         value={customerData.services}
  //         onChange={(value) => updateCustomerData("services", value)}
  //         gender={customerData.gender}
  //       />

  //       <Employee
  //         value={customerData.employeeName}
  //         onChange={(value) => updateCustomerData("employeeName", value)}
  //       />

  //       <PaymentMethod
  //         value={customerData.paymentMethod}
  //         onChange={(value) => updateCustomerData("paymentMethod", value)}
  //       />

  //       <button type="submit" disabled={isLoading}>
  //         {isLoading ? "Saving..." : "Submit"}
  //       </button>
  //     </form>

  //     {error && <p style={{ color: "red" }}>Error: {error}</p>}
  //   </div>
  // );
}
