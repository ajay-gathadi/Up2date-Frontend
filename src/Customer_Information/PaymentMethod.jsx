import {
    Box,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    Icon,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import Checkbox from "@mui/material/Checkbox";
import CurrencyRupee from "@mui/icons-material/CurrencyRupee";

function PaymentMethod({value = {cash: null, online: null}, onChange}) {
    const handlePaymentMethodChange = (methodOfPayment, event) => {
        if (event) {
            event.stopPropagation();
        }
        const newPaymentMethod = {...value};

        if (methodOfPayment === "cash") {
            newPaymentMethod.cash = newPaymentMethod.cash === null ? 0 : null;
        } else if (methodOfPayment === "online") {
            newPaymentMethod.online = newPaymentMethod.online === null ? 0 : null;
        }

        setTimeout(() => {
            onChange(newPaymentMethod);
        }, 0);
    };

    const handleAmountChange = (methodOfPayment, amount) => {
        const numericAmount = Number(amount);
        const validAmount =
            amount === "" ? 0 : numericAmount < 0 ? 0 : numericAmount;

        onChange({
            ...value,
            [methodOfPayment]: validAmount,
        });
    };

    const totalAmount =
        (value.cash === null ? 0 : Number(value.cash || 0)) +
        (value.online === null ? 0 : Number(value.online || 0));

    const UpiPayIcon = () => (
        <Icon className="material-symbols-outlined" sx={{mr: 1, fontSize: 20}}>
            upi_pay
        </Icon>
    );

    const getWidthStyles = () => ({
        maxWidth: value.cash !== null || value.online !== null ? "100%" : "170px",
        width:
            value.cash !== null || value.online !== null
                ? "calc(100% - 27px)"
                : "auto",
        transition: "all 0.2s ease",
    });

    return (
        <FormControl
            fullWidth
            margin="normal"
            sx={{
                borderRadius: "8px",
                padding: "16px",
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    mb: 1.5,
                    fontFamily: "Inter",
                    fontWeight: 450,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <PaymentsIcon sx={{mr: 1, fontSize: 20}}/>
                Payment
            </Typography>

            <FormGroup sx={{mb: 1, width: "100%"}}>
                <Paper
                    variant="outlined"
                    sx={{
                        mb: 1.5,
                        p: 1,
                        borderColor: "rgba(223, 168, 18, 0.69)",
                        transition: "all 0.2s ease",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        maxWidth: value.cash !== null ? "100%" : "170px",
                        width: value.cash !== null ? "calc(100% - 27px)" : "auto",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={value.cash !== null}
                                    onChange={(e) => handlePaymentMethodChange("cash", e)}
                                    sx={{
                                        color: "rgba(223, 168, 18, 0.69)",
                                        "&.Mui-checked": {
                                            color: "rgba(223, 168, 18, 0.69)",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            fontSize: 22, // Control size of checkbox icon instead
                                        },
                                    }}
                                />
                            }
                            label={
                                <Box sx={{display: "flex", alignItems: "center"}}>
                                    <CurrencyRupee sx={{mr: 1, fontSize: 20}}/>
                                    <Typography sx={{fontFamily: "Inter"}}>Cash</Typography>
                                </Box>
                            }
                            sx={{m: 0}}
                        />

                        {value.cash !== null && (
                            <TextField
                                label="Amount"
                                type="number"
                                value={value.cash || ""}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">₹</InputAdornment>
                                        ),
                                    },
                                }}
                                variant="outlined"
                                size="small"
                                placeholder="Enter cash amount"
                                onChange={(e) => handleAmountChange("cash", e.target.value)}
                                sx={{
                                    mt: 0.5,
                                    ml: 4.4,
                                    mr: 1,
                                    width: {xs: "100%", sm: "400px"},

                                    maxWidth: "220px",
                                    "& .MuiOutlinedInput-root": {
                                        fontFamily: "Inter",
                                        "&.Mui-focused fieldset": {
                                            borderColor: "rgba(223, 168, 18, 0.69)",
                                        },
                                        "& input": {
                                            padding: "8px 4px",
                                            fontSize: "14px",
                                            textAlign: "center",
                                        },
                                    },

                                    "& .MuiInputLabel-root": {
                                        "&.Mui-focused": {
                                            color: "rgba(26, 26, 23, 0.69)",
                                        },
                                        // fontSize: "10px",
                                        // transform: "translate(18px, -7px) scale(1.2)", //Let's adjust the layout of the label
                                    },
                                }}
                            />
                        )}
                    </Box>
                </Paper>

                <Paper
                    variant="outlined"
                    sx={{
                        mb: 1.5,
                        p: 1,
                        borderColor: "rgba(223, 168, 18, 0.69)",
                        transition: "all 0.2s ease",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        maxWidth: value.online !== null ? "100%" : "170px",
                        width: value.online !== null ? "calc(100% - 27px)" : "auto",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            justifyContent: "flex-start",
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={value.online !== null}
                                    onChange={(e) => handlePaymentMethodChange("online", e)}
                                    sx={{
                                        color: "rgba(223, 168, 18, 0.69)",
                                        "&.Mui-checked": {
                                            color: "rgba(223, 168, 18, 0.69)",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            fontSize: 22, // Control size of checkbox icon instead
                                        },
                                    }}
                                    padding="10px"
                                />
                            }
                            label={
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <UpiPayIcon/>
                                    <Typography
                                        sx={{
                                            fontFamily: "Inter",
                                        }}
                                    >
                                        Online
                                    </Typography>
                                </Box>
                            }
                            sx={{m: 0}}
                        />

                        {value.online !== null && (
                            <TextField
                                label="Amount"
                                type="number"
                                value={value.online || ""}
                                onChange={(e) => handleAmountChange("online", e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">₹</InputAdornment>
                                        ),
                                    },
                                }}
                                variant="outlined"
                                size="small"
                                placeholder="Enter online amount"
                                sx={{
                                    mt: 0.5,
                                    ml: 3,
                                    width: {xs: "100%", sm: "220px"},
                                    maxWidth: "220px",
                                    "& .MuiOutlinedInput-root": {
                                        fontFamily: "Inter",
                                        "&.Mui-focused fieldset": {
                                            borderColor: "rgba(223, 168, 18, 0.69)",
                                        },
                                        "& input": {
                                            padding: "8px 4px",
                                            fontSize: "14px",
                                            textAlign: "center",
                                        },
                                    },

                                    "& .MuiInputLabel-root": {
                                        "&.Mui-focused": {
                                            color: "rgba(26, 26, 23, 0.69)",
                                        },
                                    },
                                }}
                            />
                        )}
                    </Box>
                </Paper>

                <Divider
                    sx={{
                        mb: 2,
                        px: 1,
                        // maxWidth:
                        //   value.cash !== null || value.online !== null ? "100%" : "170px",
                        // width:
                        //   value.cash !== null || value.online !== null
                        //     ? "calc(100% - 27px)"
                        //     : "auto",
                        ...getWidthStyles(),
                    }}
                />

                <Paper
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        p: 1,
                        bgcolor:
                            totalAmount > 0
                                ? "rgba(223, 168, 18, 0.69)"
                                : "rgba(235, 188, 60, 0.69)",
                        borderRadius: 1,
                        // transition: "all 0.2s ease",
                        // // width: "100%",
                        // maxWidth:
                        //   value.cash !== null || value.online !== null ? "100%" : "170px",
                        // width:
                        //   value.cash !== null || value.online !== null
                        //     ? "calc(100% - 27px)"
                        //     : "auto",
                        ...getWidthStyles(),
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            fontFamily: "Inter",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        Total amount: <CurrencyRupee sx={{mx: 0.5, fontSize: 18}}/>
                        {totalAmount}
                    </Typography>
                </Paper>
            </FormGroup>
        </FormControl>
    );
}

export default PaymentMethod;
