import CustomerName from "./CustomerName.jsx";
import MobileNumber from "./MobileNumber.jsx";
import Gender from "./Gender.jsx";
import React, {useState} from "react";
import Services from "./Services.jsx";
import Employee from "./Employee.jsx";
import PaymentMethod from "./PaymentMethod.jsx";
import salonName from "../assets/Up2Date Family Salon.png";
import {Alert, Box, Button, Card, CardContent, Container, Grid, Paper, Snackbar, Typography} from "@mui/material";

export default function Customer() {
    const [customerData, setCustomerData] = useState({
        customerName: "",
        mobileNumber: "",
        gender: "",
        services: [],
        employeeName: "",
        paymentMethod: {cash: null, online: null, type: "cash"},
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
        setCustomerData((previousData) => ({...previousData, [key]: value}));

        if (formErrors[key]) {
            setFormErrors((previousErrors) => {
                const newErrors = {...previousErrors};
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const createCustomerServices = async (customerId) => {
        const services = customerData.services.map(async (serviceId) => {
            const cash_Amount = Number(customerData.paymentMethod.cash) || 0;
            const online_Amount = Number(customerData.paymentMethod.online) || 0;
            const totalAmount = cash_Amount + online_Amount;

            let paymentMethodMode = "cash";
            if (cash_Amount > 0 && online_Amount > 0) {
                paymentMethodMode = "both";
            } else if (online_Amount > 0) {
                paymentMethodMode = "online";
            }

            //CustomerServiceDTO Object
            const customerServiceData = {
                customerId: customerId,
                serviceId: serviceId,
                employeeId: Number(customerData.employeeName),
                paymentMethod: paymentMethodMode,
                // amount: totalAmount / customerData.services.length,
                // cashAmount: cash_Amount / customerData.services.length,
                // onlineAmount: online_Amount / customerData.services.length,
                amount: totalAmount,
                cashAmount: cash_Amount,
                onlineAmount: online_Amount,
                serviceTakenDate: new Date().toISOString(),
            };
            console.log("Sending customer service data: ", customerServiceData);
            console.log("Cash Amount: ", cash_Amount);
            console.log("Online Amount: ", online_Amount);
            console.log("Total Amount: ", totalAmount);
            console.log("Payment Method Object: ", customerData.paymentMethod);

            const sendResponseToBackend = await fetch("/customer-service", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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
            const response = await fetch("/api/customer/create", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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
                paymentMethod: {cash: null, online: null, type: "cash"},
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
        setNotification({...notification, open: false});
    };

    return (
        <Container maxWidth={false}>
            <Box
                sx={{
                    pt: 1,
                    position: "absolute",
                    top: "7px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                }}
            >
                <img
                    src={salonName}
                    style={{
                        height: "40px",
                        objectFit: "contain"
                    }}
                />
            </Box>
            <Paper
                // elevation={3}
                sx={{
                    borderRadius: 4,
                    overflowY: "auto",
                    height: "100%",
                    width: "100%",
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    mt: -3,
                }}
                variant="outlined"
            >
                <form
                    onSubmit={handleSubmit}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                >
                    {/* {/* <Grid container spacing={3}> */}
                    <Grid size={{xs: 12, md: 10}} sx={{mx: "auto"}}>
                        <Card variant="outlined" sx={{height: "100%", border: "none"}}>
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                                sx={{
                                    mb: 1,
                                    fontFamily: "Inter",
                                    fontWeight: 600,
                                    paddingTop: "10px",
                                }}
                            >
                                Customer Details
                            </Typography>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 12, sm: 6, lg: 6}}>
                                        <CustomerName
                                            value={customerData.customerName}
                                            onChange={(value) =>
                                                updateCustomerData("customerName", value)
                                            }
                                            error={formErrors.customerName}
                                        />
                                    </Grid>

                                    <Grid size={{xs: 12, sm: 6}} sx={{paddingTop: "0.5px"}}>
                                        <MobileNumber
                                            value={customerData.mobileNumber}
                                            onChange={(value) =>
                                                updateCustomerData("mobileNumber", value)
                                            }
                                            error={formErrors.mobileNumber}
                                        />
                                    </Grid>

                                    <Grid size={{xs: 12}} sx={{mt: 1, paddingTop: 0.7}}>
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

                                    <Grid size={{xs: 12}} sx={{mt: 1, paddingTop: 0.7}}>
                                        <Grid container spacing={2}>
                                            <Grid
                                                size={{xs: 12, sm: 6}}
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
                                                        sx={{display: "block", mt: 1}}
                                                    >
                                                        {formErrors.services}
                                                    </Typography>
                                                )}
                                            </Grid>

                                            <Grid size={{xs: 12, sm: 6}}>
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
                                        <Box sx={{width: "100%", mx: "auto"}}>
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
                                                    sx={{display: "block", mt: 1}}
                                                >
                                                    {formErrors.paymentMethod}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    <Grid
                                        size={{xs: 12}}
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
                                                    backgroundColor: "rgba(243,183,25,0.89)", // Slightly darker yellow on hover
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
                    autoHideDuration={3000}
                    onClose={handleCloseNotification}
                    anchorOrigin={{vertical: "top", horizontal: "center"}}

                >
                    <Alert
                        onClose={handleCloseNotification}
                        severity={notification.severity}
                        variant="filled"
                        sx={{width: "100%", borderRadius: 10}}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </Container>
    );
}
