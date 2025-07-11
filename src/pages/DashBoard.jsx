import {Alert, Box, Card, CardContent, Container, createTheme, Grid, ThemeProvider, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import {Error} from "@mui/icons-material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

const theme = createTheme({
    palette: {
        primary: {
            main: 'rgba(223, 168, 18, 0.69)',
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: 'rgba(223, 168, 18, 0.69) !important',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'rgba(223, 168, 18, 0.69) !important',
                        }
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
    const [summaryData, setSummaryData] = useState(({
        totalBusiness: 0,
        cashCollected: 0,
        onlineCollected: 0,
        totalProfit: 0,
    }));

    console.log("Log 1: Dashboard component is starting to render");

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
        const fetchDashboardSummary = async () => {
            try {
                const formattedDate = selectedDate.toISOString().split("T")[0];
                const response = await fetch(`/dashboard/summary?date=${formattedDate}`);

                if (response.ok) {
                    const data = await response.json();
                    setSummaryData((data));
                } else {
                    console.error("Failed to get dashboard summary:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching dashboard summary:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardSummary();
    }, [selectedDate]);

    const handleDateChange = (newDate) => {
        if (newDate && newDate instanceof Date && !isNaN(newDate)) {
            setSelectedDate(newDate);
        }
    }

    console.log("Log 2: Dashboard component has finished rendering");
    if (loading) {
        console.log("Log 4: Component is loading state...");
    }


    const DashboardCard = ({title, amount, color = "rgba(243,203,69)"}) => (
        <>
            <Card sx={{height: '90px', width: '180px', display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flexGrow: 1}}>
                    <Typography variant={'h4'}
                                sx={{fontFamily: 'Inter', fontSize: 18, fontWeight: '570', whiteSpace: 'nowrap'}}
                                color="black"
                                gutterBottom>
                        {title}
                    </Typography>
                    {error && (
                        <Alert severity={'error'} sx={{mt: 2}}>
                            Error fetching data: {error}
                        </Alert>
                    )}
                    {
                        !loading && !error && (
                            <Typography variant={'h5'} component={'div'}
                                        sx={{fontFamily: 'Inter', fontSize: 22, fontWeight: '550', color: color}}>
                                {amount.toLocaleString("en-IN")} ₹
                            </Typography>
                        )
                    }
                </CardContent>
            </Card>
        </>
    );

    console.log("Log 2: Dashboard component has finished rendering");
    if (error) {
        console.error("Log 3: An error occurred in the Dashboard component:", error);
    }

    if (loading) {
        console.log("Log 4: Component is loading state...");
    }
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', mt: 0}}>
                {/*<Typography sx={{*/}
                {/*    position: 'fixed',*/}
                {/*    top: 17,*/}
                {/*    left: 50,*/}
                {/*    right: 0,*/}
                {/*    backgroundColor: '#fff',*/}
                {/*    zIndex: 1000,*/}
                {/*    fontWeight: 'bold',*/}
                {/*    fontSize: 34,*/}
                {/*    textAlign: 'left',*/}
                {/*    width: '100%',*/}
                {/*}}>*/}
                {/*    Dashboard*/}
                {/*</Typography>*/}

                <ThemeProvider theme={theme}>
                    <Box sx={{position: 'fixed', top: 25, right: 32}}>
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
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(223, 168, 18, 0.69) !important',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(223, 168, 18, 0.69) !important',
                                            }
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
                    <Typography sx={{
                        position: 'relative',
                        textAlign: 'center',
                        mb: 2,
                        top: '-60px',
                        color: 'grey',
                        fontWeight: 'medium',
                        fontFamily: "Inter"
                    }}>
                        Data for: {selectedDate.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                    </Typography>

                    <Grid container spacing={3} sx={{position: 'relative', top: '-30px'}}>
                        <Grid item xs={12} sm={6} md={3} lg={4}>
                            <DashboardCard title={'Total Business'} amount={summaryData.totalBusiness}
                                           color={'rgba(243,203,69)'}/>
                        </Grid>


                        <Grid item xs={12} sm={6} md={3} lg={4}>
                            <DashboardCard title={'Cash Collected'} amount={summaryData.cashCollected}
                                           color={'rgba(243,203,69)'}/>
                        </Grid>


                        <Grid item xs={12} sm={6} md={3} lg={4}>
                            <DashboardCard title={'Online Collected'} amount={summaryData.onlineCollected}
                                           color={'rgba(243,203,69)'}/>
                        </Grid>

                        
                        <Grid item xs={12} sm={6} md={3} lg={4}>
                            <DashboardCard title={'Total Profit'} amount={summaryData.totalProfit}
                                           color={`rgba(243, 203, 69)`}/>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </LocalizationProvider>
    );
}

export default DashBoard;
