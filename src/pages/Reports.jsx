import {useEffect, useState} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DateRangePicker} from "@mui/x-date-pickers-pro/DateRangePicker";
import {
    Alert,
    Box,
    CircularProgress,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from "@mui/material";
import {format} from "date-fns";

function Reports() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeeCommissionData, setEmployeeCommissionData] = useState([]);
    const [customerSummaryData, setCustomerSummaryData] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [dateRange, setDateRange] = useState([null, null]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    useEffect(() => {

        if (!dateRange[0] || !dateRange[1]) {
            return;
        }

        const startDate = format(dateRange[0], 'yyyy-MM-dd');
        const endDate = format(dateRange[1], 'yyyy-MM-dd');

        const fetchEmployeeCommission = async () => {
            setLoading(true);
            setError(null);
            setEmployeeCommissionData([]);
            try {

                const response = await fetch(`/dashboard/employee-commissions?startDate=${startDate}&endDate=${endDate}`);

                if (response.ok) {
                    const data = await response.json();
                    setEmployeeCommissionData(data);
                    setError(null);
                } else {
                    const errorText = await response.text();
                    console.error("Failed to fetch employee commission data:", response.status, errorText);
                    setError(`Server responded with status ${response.status}: ${errorText}`);
                }
            } catch (error) {
                console.error("Error fetching employee commission data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }

        };

        const fetchCustomerSummary = async () => {
            setLoading(true);
            setCustomerSummaryData([]);
            setError(null);

            try {
                const response = await fetch(`/dashboard/customer-summary?startDate=${startDate}&endDate=${endDate}`);
                if (response.ok) {
                    const data = await response.json();
                    setCustomerSummaryData(data);
                    setError(null);
                } else {
                    const errorText = await response.text();
                    console.error("Failed to fetch customer summary data:", response.status, errorText);
                    setError(`Server responded with status ${response.status}: ${errorText}`);
                }
            } catch (error) {
                setError('An error occurred while fetching customer summary data: ' + error.message);
            } finally {
                setLoading(false);
            }
        }

        if (activeTab === 0) {
            fetchCustomerSummary();
        } else if (activeTab === 1) {
            fetchEmployeeCommission();
        }
    }, [dateRange, activeTab]);

    return (
        <LocalizationProvider locale="en" dateAdapter={AdapterDateFns}>
            <Box sx={{p: 1}}>
                <Typography variant={'h5'} component={'h3'} sx={{fontWeight: 'bold', fontFamily: 'Inter', mb: 2}}>
                    Reports
                </Typography>

                <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}}>
                    <DateRangePicker
                        localeText={{start: 'Start Date', end: 'End Date'}}
                        value={dateRange}
                        onChange={(newValue) => setDateRange(newValue)}
                    />
                </Box>

                <Box sx={{width: '100%', mt: 1}}>
                    <Tabs value={activeTab} onChange={handleTabChange} centered={true}>
                        <Tab label={'Customer Details'}
                             sx={{
                                 outline: 'none !important',
                             }}/>
                        <Tab label={'Employee Commission'}
                             sx={{
                                 outline: 'none !important',
                             }}/>
                    </Tabs>
                </Box>

                {error && <Alert severity={'error'} sx={{mt: 1}}>{error}</Alert>}

                {activeTab === 0 && (
                    <Box sx={{p: 1}}>
                        {loading &&
                            <Box sx={{display: 'flex', justifyContent: 'center', my: 3}}><CircularProgress/></Box>
                        }
                        {error && <Alert severity={'error'} sx={{mt: 2}}>{error}</Alert>}
                        {!loading && !error && dateRange[0] && dateRange[1] && (
                            <TableContainer component={Paper} sx={{mt: 1}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Customer Name</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>Mobile Number</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>Total Visits</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>Total Amount</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>Services Taken</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>Last Visit Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customerSummaryData.length > 0 ? (
                                            customerSummaryData.map((currentCustomer, currentIndex) => (
                                                <TableRow key={`currentCustomer.mobileNumber-${currentIndex}`}>
                                                    <TableCell>{currentCustomer.customerName}</TableCell>
                                                    <TableCell>{currentCustomer.mobileNumber}</TableCell>
                                                    <TableCell>{currentCustomer.totalVisits}</TableCell>
                                                    <TableCell>₹{currentCustomer.totalAmount.toFixed(2)}</TableCell>
                                                    <TableCell
                                                        sx={{
                                                            maxWidth: '200px',
                                                            wordBreak: 'break-word',
                                                        }}
                                                        title={Array.isArray(currentCustomer.services) ? currentCustomer.services.join(', ') : currentCustomer.services || ''}
                                                    >
                                                        {Array.isArray(currentCustomer.services) ? currentCustomer.services.join(', ') : currentCustomer.services || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>{new Date(currentCustomer.lastVisitDate).toLocaleDateString('en-IN')}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    <Typography variant="body2" color="textSecondary">
                                                        No customer data available for the selected date range.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        )}
                    </Box>
                )}

                {activeTab === 1 && (
                    <Box sx={{p: 1}}>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            <TableContainer component={Paper} sx={{mt: 1}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Employee Name</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>Commission Amount</TableCell>
                                            {/*<TableCell>Date</TableCell>*/}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {employeeCommissionData.map((row) => (
                                            <TableRow key={row.employeeName}>
                                                <TableCell>{row.employeeName}</TableCell>
                                                <TableCell>{row.totalCommission}</TableCell>
                                                {/*<TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>*/}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                )}


            </Box>
        </LocalizationProvider>
    );
}

export default Reports;