import CustomerName from "./CustomerName.jsx";
import MobileNumber from "./MobileNumber.jsx";
import Gender from "./Gender.jsx";
import React, {useState} from "react";
import Services from "./Services.jsx";
import Employee from "./Employee.jsx";
import PaymentMethod from "./PaymentMethod.jsx";
import salonName from "../icons/Up2Date Family Salon.png";
import Up2dateLogo from "../icons/Up2dateLogo.png";
import {Alert, Box, Button, Card, CardContent, Container, Grid, Paper, Snackbar, Typography} from "@mui/material";
import {createCustomer, createCustomerService} from "../services/customerService";
import {useCustomer} from "../hooks/useCustomer";
import {CustomerProvider} from "../context/CustomerContext";

function CustomerForm() {
    // const [customerData, setCustomerData] = useState({
    //     customerName: "",
    //     mobileNumber: "",
    //     gender: "",
    //     services: [],
    //     employeeName: "",
    //     paymentMethod: {cash: null, online: null, type: "cash"},
    // });
    const {customerData, updateCustomerData, resetCustomerData} = useCustomer();
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleUpdate = (key, value) => {
        updateCustomerData(key, value)

        if (formErrors[key]) {
            setFormErrors((previousErrors) => {
                const newErrors = {...previousErrors};
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        // if (!customerData.customerName) {
        //     errors.customerName = "Customer name is required";
        // }

        // if (!customerData.mobileNumber) {
        //     errors.mobileNumber = "Mobile number is required";
        // }

        // if (!customerData.gender) {
        //     errors.gender = "Gender is required";
        // }

        // if (!customerData.services.length) {
        //     errors.services = "At least one service should be selected";
        // }

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
            // const customerResponse = await fetch("/api/customer/create", {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify({
            //         customerName: customerData.customerName,
            //         mobileNumber: customerData.mobileNumber,
            //         gender: customerData.gender,
            //     }),
            // });
            //
            // if (!customerResponse.ok) {
            //     const errorText = await customerResponse.text();
            //     throw new Error(`Customer creation failed: ${errorText}`);
            // }
            //
            // const createdCustomer = await customerResponse.json();
            const createdCustomer = await createCustomer({
                customerName: customerData.customerName,
                mobileNumber: customerData.mobileNumber,
                gender: customerData.gender,
            })
            const customerId = createdCustomer.customerId;

            const cash_Amount = Number(customerData.paymentMethod.cash) || 0;
            const online_Amount = Number(customerData.paymentMethod.online) || 0;
            const totalAmount = cash_Amount + online_Amount;

            let paymentMethodMode = "cash";
            if (cash_Amount > 0 && online_Amount > 0) {
                paymentMethodMode = "both";
            } else if (online_Amount > 0) {
                paymentMethodMode = "online";
            }

            const customerServiceData = {
                customerId: customerId,
                serviceIds: customerData.services,
                employeeId: Number(customerData.employeeName),
                paymentMethod: paymentMethodMode,
                amount: totalAmount,
                cashAmount: cash_Amount,
                onlineAmount: online_Amount,
                serviceTakenDate: new Date().toISOString(),
            };

            // const serviceResponse = await fetch("/customer-service", {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify(customerServiceData)
            // });
            //
            // if (!serviceResponse.ok) {
            //     const errorText = await serviceResponse.text();
            //     throw new Error(`Service creation failed: ${errorText}`);
            // }
            await createCustomerService(customerServiceData);

            resetCustomerData();

            setNotification({
                open: true,
                message: "Customer information saved successfully",
                severity: "success",
            });
        } catch (error) {
            console.error("Error saving data: ", error);

            setNotification({
                open: true,
                message: error.response?.data?.message || error.message || "Failed to save customer information",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification({...notification, open: false});
    };

    return (
        <Container
            maxWidth={false}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: -1
                }}
            >
                <img
                    src={Up2dateLogo}
                    style={{
                        height: "50px",
                        marginRight: "10px",
                        marginTop: '-10px',
                        objectFit: "contain",
                    }}
                />
                <img
                    src={salonName}
                    style={{
                        height: "40px",
                        objectFit: "contain"
                    }}
                    alt={"Up2Date Family Salon"}/>
            </Box>
            <Paper
                sx={{
                    borderRadius: 7,
                    overflowY: "auto",
                    height: "100%",
                    width: "100%",
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    mt: 1
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
                                                handleUpdate("customerName", value)
                                            }
                                            error={formErrors.customerName}
                                        />
                                    </Grid>

                                    <Grid size={{xs: 12, sm: 6}} sx={{paddingTop: "0.5px"}}>
                                        <MobileNumber
                                            value={customerData.mobileNumber}
                                            onChange={(value) =>
                                                handleUpdate("mobileNumber", value)
                                            }
                                            error={formErrors.mobileNumber}
                                        />
                                    </Grid>

                                    <Grid size={{xs: 12}} sx={{mt: 1, paddingTop: 0.7}}>
                                        <Gender
                                            value={customerData.gender}
                                            onChange={(value) => handleUpdate("gender", value)}
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
                                                        handleUpdate("services", value)
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
                                                        handleUpdate("employeeName", value)
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
                                                    handleUpdate("paymentMethod", value)
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

export default function Customer() {
    return (
        <CustomerProvider>
            <CustomerForm/>
        </CustomerProvider>
    )
}
