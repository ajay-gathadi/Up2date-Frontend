import {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Add, Edit, PersonRemove} from "@mui/icons-material";

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
    })
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const response = await fetch("/employees");
                if (!response.ok) {
                    throw new Error("Failed to fetch employees");
                }
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    if (loading) {
        return <Container sx={{display: 'flex', justifyContent: 'center', mt: 5}}><CircularProgress/></Container>
    }

    if (error) {
        return <Container><Alert severity={'error'}>{error}</Alert></Container>
    }

    const handleAddEmployee = async () => {
        try {
            setSubmitting(true);
            const response = await fetch('/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        employeeName: formData.name,
                        gender: formData.gender,
                        isWorking: true
                    }
                )
            });
            if (!response.ok) {
                throw new Error('Failed to add employee');
            }

            const newEmployee = await response.json();

            setEmployees(previousEmployees => [...previousEmployees, newEmployee]);

            setFormData({name: '', gender: ''});
            setOpenModal(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    const handleOpenModal = () => {
        setFormData({name: '', gender: ''});
        setOpenModal(true);
    }

    return (
        <Container maxWidth={'lg'} sx={{mt: 4, mb: 4}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Button variant={'contained'} startIcon={<Add/>} onClick={handleOpenModal}>
                    Add Employee
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align={'right'}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.length > 0 ? (
                            employees.map((currentEmployee) => (
                                <TableRow key={currentEmployee.employeeId}>
                                    <TableCell>{currentEmployee.employeeId}</TableCell>
                                    <TableCell>{currentEmployee.employeeName}</TableCell>
                                    <TableCell>{currentEmployee.gender}</TableCell>
                                    <TableCell>{currentEmployee.isWorking ? 'Active' : 'Inactive'}</TableCell>
                                    <TableCell align={'right'}>
                                        <IconButton size={'small'}><Edit/></IconButton>
                                        <IconButton size={'small'} color={'error'}><PersonRemove/></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align={'center'}>
                                    No Employees Found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth={'sm'} fullWidth={true}>
                <DialogTitle>
                    <Typography variant={'h4'}>Add New Employee</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{pt: 2}}>
                        <TextField
                            fullWidth={true}
                            label={'Employee Name'}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            margin={'normal'}
                            required={true}
                        />
                        <FormControl fullWidth={true} margin={'normal'} required={true}>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={formData.gender}
                                label={'Gender'}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            >
                                <MenuItem value={'Male'}>Male</MenuItem>
                                <MenuItem value={'Female'}>Female</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant={'contained'}
                        onClick={handleAddEmployee}
                        disabled={submitting || !formData.name || !formData.gender}
                    >
                        {submitting ? <CircularProgress size={20}/> : 'Add Employee'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
export default EmployeeManagement;
