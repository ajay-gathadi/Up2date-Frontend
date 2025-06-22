import {Alert, Box, Card, CardContent, Container, createTheme, Grid, ThemeProvider, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import {Error} from "@mui/icons-material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

const datePickerTheme = createTheme({
    palette: {
        primary: {
            main: 'rgba(223, 168, 18, 0.69)',
        }
    },
});

const theme = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(223, 168, 18, 0.69)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(223, 168, 18, 0.69)',
                    }
                }
            }
        }
    }
})

function DashBoard() {
    const [totalBusiness, setTotalBusiness] = useState(0);
    const [cashCollected, setCashCollected] = useState(0);
    const [onlineCollected, setOnlineCollected] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const fetchTotalBusiness = async (date) => {
        try {
            const formattedDate = date.toISOString().split("T")[0];
            const response = await fetch(`/dashboard/total-business-forDate?date=${formattedDate}`);
            if (!response.ok) {
                throw new Error(
                    `HTTP error! status: ${response.status} - ${await response.text}`
                );
            }
            const data = await response.json();
            console.log("Total Business amount: ", data);
            setTotalBusiness(data);
        } catch (e) {
            console.error("Error fetching total business:", e);
            setError(e.message);
        }
    };

    const fetchCashCollected = async (date) => {
        try {
            const formattedDate = date.toISOString().split("T")[0];
            const response = await fetch(`/dashboard/cash-collected-forDate?date=${formattedDate}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error fetching cash collected:", errorText);
                console.error("Cash Collected Response Status:", response.status);
                throw new Error(`HTTP Error! status: ${response.status} - ${await response.text()}`);
            }
            const responseText = await response.text();
            console.log("Cash Collected Response Text:", responseText);

            let data;
            try {
                data = JSON.parse(responseText);
                console.log("Cash Collected Parsed JSON:", data);
            } catch (parseError) {
                console.error("Failed to parse JSON response:", parseError, " trying as nummber...");
                data = parseFloat(responseText) || 0;
                console.log("Cash Collected Parsed as Number:", data);
            }

            // const data = await response.json();
            // console.log("Cash Collected Data:", data);
            setCashCollected(data);
        } catch (e) {
            console.error("Error fetching cash collected:", e);
            throw e;
        }
    };

    const fetchOnlineCollected = async (date) => {
        try {
            const formattedDate = date.toISOString().split("T")[0];
            const response = await fetch(`/dashboard/online-collected-forDate?date=${formattedDate}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error fetching online collected:", errorText);
                console.error("Online Collected Response Status:", response.status);
                console.error(
                    "Online Collected Response Text: ",
                    await response.text()
                )
                throw new Error(`HTTP Error! status: ${response.status} - ${await response.text()}`);
            }
            const data = await response.json();
            console.log("Online Collected Data:", data);
            setOnlineCollected(data);
        } catch (e) {
            console.error("Error fetching online collected:", e);
            throw e;
        }
    };


    const fetchAllData = async (date) => {
        try {
            setLoading(true);
            setError(null);

            await Promise.all([
                fetchTotalBusiness(date),
                fetchCashCollected(date),
                fetchOnlineCollected(date)
            ]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData(selectedDate)
    }, []);

    const handleDateChange = (newDate) => {
        if (newDate && newDate instanceof Date && !isNaN(newDate)) {
            setSelectedDate(newDate);
            fetchAllData(newDate);
        }
    }


    const DashboardCard = ({title, amount, color = "rgba(243,203,69)"}) => (
        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flexGrow: 1}}>
                <Typography sx={{fontFamily: 'Inter', fontSize: 20, whiteSpace: 'nowrap'}} color="black" gutterBottom>
                    {title}
                </Typography>
                {loading && (
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100}}>
                        0 ₹
                    </Box>
                )}
                {error && (
                    <Alert severity={'error'} sx={{mt: 2}}>
                        Error fetching data: {error}
                    </Alert>
                )}
                {
                    !loading && !error && (
                        <Typography variant={'h4'} component={'div'} sx={{fontWeight: 'bold', color: color}}>
                            {amount.toLocaleString("en-IN")} ₹
                        </Typography>
                    )
                }
            </CardContent>
        </Card>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', mt: 0}}>
                <Typography sx={{
                    position: 'fixed',
                    top: 30,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    zIndex: 1000,
                    fontWeight: 'bold',
                    fontSize: 34,
                    textAlign: 'center',
                    width: '100%',
                }}>
                    Dashboard
                </Typography>

                <ThemeProvider theme={theme}>
                    <Box sx={{position: 'fixed', top: 87, right: 32}}>
                        <DatePicker
                            label={"Select Date"}
                            value={selectedDate}
                            onChange={handleDateChange}
                            maxDate={new Date()}
                            format={'dd-MM-yyyy'}
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    size: 'small',
                                    sx: {
                                        width: 180,
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'black',
                                        }
                                    }
                                },
                                openPickerButton: {
                                    disableRipple: true,
                                    sx: {
                                        outline: 'none !important',
                                        '&:hover': {
                                            backgroundColor: 'rgba(243,203,69, 0.6)',
                                        }
                                    }
                                },
                                desktopPaper: {
                                    sx: {
                                        width: 'auto',
                                        minWidth: '250px',
                                        height: '290px',
                                        overflowY: 'auto',
                                    }
                                },
                                leftArrowIcon: {
                                    disableRipple: true,
                                    sx: {
                                        outline: 'none !important',
                                        color: 'rgba(243, 203, 69, 0.8) !important',
                                        '&:hover': {
                                            backgroundColor: 'rgba(243, 203, 69, 0.1) !important',
                                            color: 'rgba(243, 203, 69, 1) !important',
                                        }
                                    }
                                },
                                rightArrowIcon: {
                                    disableRipple: true,
                                    sx: {
                                        outline: 'none !important',
                                        color: 'rgba(243, 203, 69, 0.8) !important',
                                        '&:hover': {
                                            backgroundColor: 'rgba(243, 203, 69, 0.1) !important',
                                            color: 'rgba(243, 203, 69, 1) !important',
                                        }
                                    }
                                },
                                day: {
                                    sx: {
                                        width: '20',
                                        height: 30,
                                        fontSize: 14,
                                        fontFamily: 'Inter',
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(243,203,69, 0.2)',
                                            color: 'black',
                                            '&:hover': {backgroundColor: 'rgba(243,203,69, 0.6) !important'},
                                            '&:focus': {backgroundColor: 'rgba(243,203,69, 0.6) !important'},
                                        },
                                        outline: 'none !important',
                                    }
                                },
                                calendarHeader: {
                                    sx: {
                                        // padding: '10px 22px 20px 25px',
                                        padding: '10px 16px',
                                        '& .MuiPickersCalendarHeader-label': {
                                            fontSize: '13px',
                                            fontFamily: 'Inter',
                                        }
                                    }
                                },
                            }}
                        />
                    </Box>
                </ThemeProvider>

                <Container maxWidth="lg" sx={{flex: 1, mb: 4}}>
                    <Typography variant={'h6'} sx={{
                        textAlign: 'center',
                        mb: 2,
                        color: 'text.secondary',
                        fontWeight: 'medium',
                        fontFamily: "Inter"
                    }}>
                        Data for: {selectedDate.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{xs: "100%", md: "33.33%", lg: "25%"}}>
                            <DashboardCard title={'Total Business'} amount={totalBusiness} color={'rgba(243,203,69)'}/>
                        </Grid>

                        <Grid size={{xs: 12, md: 4, lg: 4}}>
                            <DashboardCard title={'Cash Collected'} amount={cashCollected} color={'rgba(243,203,69)'}/>
                        </Grid>

                        <Grid size={{xs: 12, md: 4, lg: 4}}>
                            <DashboardCard title={'Online Collected'} amount={onlineCollected}
                                           color={'rgba(243,203,69)'}/>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </LocalizationProvider>
    );
}

export default DashBoard;
