import {useEffect, useState} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DateRangePicker} from "@mui/x-date-pickers-pro/DateRangePicker";
import {
    Alert,
    Box,
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

function Reports() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeeCommissionData, setEmployeeCommissionData] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [dateRange, setDateRange] = useState([null, null]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        const fetchEmployeeCommission = async () => {
            if (activeTab === 0 && dateRange[0] && dateRange[1]) {
                setLoading(true);
                try {
                    const startDate = dateRange[0].toISOString().split('T')[0];
                    const endDate = dateRange[1].toISOString().split('T')[0];
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
            }
        };

        fetchEmployeeCommission();
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
                        <Tab label={'Employee Commission'}
                             sx={{
                                 outline: 'none !important',
                             }}/>
                        <Tab label={'Customer Details'}
                             sx={{
                                 outline: 'none !important',
                             }}/>
                    </Tabs>
                </Box>

                {error && <Alert severity={'error'} sx={{mt: 1}}>{error}</Alert>}

                {activeTab === 0 && (
                    <Box sx={{p: 1}}>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            <TableContainer component={Paper} sx={{mt: 1}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Employee Name</TableCell>
                                            <TableCell>Commission Amount</TableCell>
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
                        {activeTab === 1 && (
                            <Box sx={{p: 1}}>
                                <Typography>Customer Details</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </LocalizationProvider>
    );
}

export default Reports;