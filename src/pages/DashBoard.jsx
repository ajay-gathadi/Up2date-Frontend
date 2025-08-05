import {
    Alert,
    Box,
    Card,
    CardContent,
    Container,
    FormControlLabel,
    Grid,
    Paper,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {usePremiumFilter} from "../hooks/usePremiumFilter";

const DashboardCard = ({title, amount, color = "rgba(243,203,69)"}) => (
    <>
        <Card sx={{height: '90px', width: '180px', display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flexGrow: 1}}>
                <Typography variant={'h4'}
                            sx={{
                                fontFamily: 'Inter', fontSize: 18,
                                fontWeight: '570', whiteSpace: 'nowrap'
                            }}
                            color="black"
                            gutterBottom>
                    {title}
                </Typography>
                <Typography variant={'h5'} component={'div'}
                            sx={{
                                fontFamily: 'Inter', fontSize: 22,
                                fontWeight: '550', color: color
                            }}
                >
                    ₹ {amount.toLocaleString("en-IN")}
                </Typography>
            </CardContent>
        </Card>
    </>
);

function DashBoard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [summaryData, setSummaryData] = useState(({
        totalBusiness: 0,
        cashCollected: 0,
        onlineCollected: 0,
        totalProfit: 0,
    }));
    const [activeTab, setActiveTab] = useState(0);
    const [employeeCommissionData, setEmployeeCommissionData] = useState([]);
    const [customerDetailsData, setCustomerDetailsData] = useState([]);
    const [customerPage, setCustomerPage] = useState(0);
    const [customerRowsPerPage, setCustomerRowsPerPage] = useState(10);

    const {
        filterData: filteredCustomerDetails,
        showPremiumOnly,
        setShowPremiumOnly
    } = usePremiumFilter(customerDetailsData);

    useEffect(() => {
        const fetchDashboardSummary = async () => {
            if (!selectedDate) return;
            setLoading(true);
            setError(null);

            const formattedDate = selectedDate.toISOString().split("T")[0];

            try {
                const [summaryResponse, customerDetailsResponse, employeeCommissionResponse]
                    = await Promise.all([
                    fetch(`/dashboard/summary?date=${formattedDate}`),
                    fetch(`/dashboard/customer-details-for-date?date=${formattedDate}`),
                    fetch(`/dashboard/employee-commissions-for-date?date=${formattedDate}`)
                ]);

                if (!summaryResponse.ok || !customerDetailsResponse.ok || !employeeCommissionResponse.ok) {
                    throw new Error("Failed to get Dashboard data");
                }
                ;

                const [summary, customerDetails, employeeCommission]
                    = await Promise.all([
                    summaryResponse.json(),
                    customerDetailsResponse.json(),
                    employeeCommissionResponse.json()
                ]);

                setSummaryData(summary);
                setCustomerDetailsData(customerDetails);
                setEmployeeCommissionData(employeeCommission);
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

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    }

    const handleCustomerPageChange = (event, newPage) => {
        setCustomerPage(newPage);
    }

    const handleChangeCustomerRowsPerPage = (event) => {
        setCustomerRowsPerPage(parseInt(event.target.value, 10));
        setCustomerPage(0);
    }

    return (

        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{
                position: 'fixed',
                top: 20,
                left: 70,
                zIndex: (theme) => theme.zIndex.drawer
            }}>
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

            <Container maxWidth="false" sx={{flex: 1, mb: 4, mt: 1}}>
                {
                    loading ? (
                        <Typography sx={{textAlign: 'center', mt: 4}}>Loading data...</Typography>
                    ) : error ? (
                        <Alert severity={'error'} sx={{mb: 2}}>
                            Error fetching the data: {error}
                        </Alert>
                    ) : (
                        <>
                            <Typography sx={{
                                position: 'relative',
                                textAlign: 'center',
                                mb: 2,
                                top: -5,
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

                            <Grid container spacing={3}
                                // sx={{position: 'relative', top: '-30px'}}
                                  justifyContent={'center'}
                            >
                                <Grid item xs={12} sm={6} md={3} lg={4}>
                                    <DashboardCard title={'Total Business'} amount={summaryData.totalBusiness}
                                                   color={'rgba(243,203,69)'}/>
                                </Grid>


                                <Grid item xs={12} sm={6} md={3} lg={4}>
                                    <DashboardCard title={'Cash Collected'} amount={summaryData.cashCollected}
                                                   color={'rgba(243,203,69)'}/>
                                </Grid>


                                <Grid item xs={12} sm={6} md={3} lg={4}>
                                    <DashboardCard title={'Online Collected'}
                                                   amount={summaryData.onlineCollected}
                                                   color={'rgba(243,203,69)'}/>
                                </Grid>


                                <Grid item xs={12} sm={6} md={3} lg={4}>
                                    <DashboardCard title={'Total Profit'} amount={summaryData.totalProfit}
                                        // color={`rgba(243, 203, 69)`}
                                                   color={'success.main'}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{width: '100%', mt: 3}}>
                                <Tabs value={activeTab} onChange={handleTabChange} centered={true}
                                      indicatorColor={'primary'}
                                      textColor={'primary'}>
                                    <Tab label={'Customer Details'}
                                         sx={{
                                             outline: 'none !important'
                                         }}
                                    />
                                    <Tab label="Employee Commission"
                                         sx={{
                                             outline: 'none !important',
                                         }}
                                    />
                                </Tabs>

                                {activeTab === 0 && (
                                    <Box sx={{p: 2}}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={showPremiumOnly}
                                                    onChange={(e) => setShowPremiumOnly(e.target.checked)}
                                                />
                                            }
                                            label={"Show Premium Customers"}
                                            sx={{mb: 0.5, display: 'flex', justifyContent: 'flex-end'}}
                                        />
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{
                                                        backgroundColor: `#72c2c9`,
                                                        '& .MuiTableCell-root': {
                                                            fontWeight: 'bold',
                                                            fontSize: '15px',
                                                            textAlign: 'center',
                                                            color: 'white'
                                                        }
                                                    }}>
                                                        <TableCell>Sr. No</TableCell>
                                                        <TableCell>Customer Name</TableCell>
                                                        <TableCell>Mobile Number</TableCell>
                                                        <TableCell>Services</TableCell>
                                                        <TableCell>Employee</TableCell>
                                                        <TableCell>Total Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody sx={{'& .MuiTableCell-root': {textAlign: 'center'}}}>
                                                    {filteredCustomerDetails.length > 0 ? (
                                                        filteredCustomerDetails
                                                            .slice(customerPage * customerRowsPerPage, customerPage * customerRowsPerPage + customerRowsPerPage)
                                                            .map((currentCustomer, currentIndex) => (
                                                                <TableRow key={currentIndex}>
                                                                    <TableCell>{filteredCustomerDetails.length - (customerPage * customerRowsPerPage + currentIndex)}</TableCell>
                                                                    <TableCell>{currentCustomer.customerName}</TableCell>
                                                                    <TableCell>{currentCustomer.mobileNumber}</TableCell>
                                                                    <TableCell sx={{
                                                                        maxWidth: '200px',
                                                                        wordBreak: 'break-word'
                                                                    }}>{currentCustomer.services}</TableCell>
                                                                    <TableCell>{currentCustomer.employeeName}</TableCell>
                                                                    <TableCell>₹{currentCustomer.totalAmount}</TableCell>
                                                                </TableRow>
                                                            ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={6} sx={{textAlign: 'center'}}>No
                                                                customer data for this date</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TablePagination
                                                            rowsPerPageOptions={[10, 20, 30, 50]}
                                                            colSpan={6}
                                                            count={filteredCustomerDetails.length}
                                                            rowsPerPage={customerRowsPerPage}
                                                            page={customerPage}
                                                            onPageChange={handleCustomerPageChange}
                                                            onRowsPerPageChange={handleChangeCustomerRowsPerPage}
                                                            labelRowsPerPage={'Rows per page'}
                                                            labelDisplayedRows={({
                                                                                     from,
                                                                                     to,
                                                                                     count
                                                                                 }) => `${from}-${to} of ${count}`}
                                                        />
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </TableContainer>
                                    </Box>

                                )}

                                {activeTab === 1 && (
                                    <Box sx={{p: 2}}>
                                        <TableContainer
                                            component={Paper}
                                            sx={{
                                                maxWidth: '500px',
                                                margin: '0 auto',
                                            }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow
                                                        sx={{
                                                            backgroundColor: `rgba(33, 103, 147, 0.64)`,
                                                            '& .MuiTableCell-root': {
                                                                fontWeight: 'bold',
                                                                fontSize: '15px',
                                                                textAlign: 'center',
                                                                color: 'white'
                                                            }
                                                        }}
                                                    >
                                                        <TableCell>Employee Name</TableCell>
                                                        <TableCell>Commission Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody sx={{'& .MuiTableCell-root': {textAlign: 'center'}}}>
                                                    {employeeCommissionData.length > 0 ? (
                                                        employeeCommissionData.map((currentEmployee, currentIndex) => (
                                                            <TableRow key={currentIndex}>
                                                                <TableCell>{currentEmployee.employeeName}</TableCell>
                                                                <TableCell>₹{currentEmployee.totalCommission}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={2} sx={{textAlign: 'center'}}>No
                                                                commission data for this date</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                )}
                            </Box>
                        </>
                    )
                }
            </Container>
        </LocalizationProvider>
    );
}

export default DashBoard;
