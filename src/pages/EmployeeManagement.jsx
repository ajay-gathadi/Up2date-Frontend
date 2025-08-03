import {useEffect, useMemo, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Edit, PersonAdd, PersonRemove} from "@mui/icons-material";

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        isWorking: true,
    })
    const [submitting, setSubmitting] = useState(false);

    const [editingEmployee, setEditingEmployee] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const sortedEmployees = useMemo(() => {
        return [...employees].sort((a, b) => {
            return Number(b.isWorking) - Number(a.isWorking);
        })
    }, [employees]);

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

    const handleFormSubmit = async () => {
        const isEditing = editingEmployee !== null;
        const url = isEditing ? `/employees/${editingEmployee.employeeId}` : `/employees`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            setSubmitting(true);
            const response = await fetch(url, {
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    employeeName: formData.name,
                    gender: formData.gender,
                    isWorking: formData.isWorking,
                })
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Failed to update employee' : 'Failed to add employee');
            }

            const savedEmployee = await response.json();

            if (isEditing) {
                setEmployees(employees.map(currentEmployee => currentEmployee.employeeId === savedEmployee.employeeId ? savedEmployee : currentEmployee));
            } else {
                setEmployees([...employees, savedEmployee]);
            }
            handleCloseModal();
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

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingEmployee(null);
        setFormData({name: '', gender: ''});
    }

    const handleAddClick = () => {
        setEditingEmployee(null);
        setFormData({name: '', gender: '', isWorking: true});
        setOpenModal(true);
    }

    const handleEditClick = (employee) => {
        setEditingEmployee(employee);
        setFormData({name: employee.employeeName, gender: employee.gender, isWorking: employee.isWorking});
        setOpenModal(true);
    }

    const handleDeleteClick = (employee) => {
        setDeleteTarget(employee);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        try {
            setSubmitting(true);
            const response = await fetch(`/employees/${deleteTarget.employeeId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }

            setEmployees(employees.map(currentEmployee => currentEmployee.employeeId === deleteTarget.employeeId ? {
                ...currentEmployee,
                isWorking: false
            } : currentEmployee));
            setDeleteTarget(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    if (loading) {
        return <Container sx={{display: 'flex', justifyContent: 'center', mt: 5}}><CircularProgress/></Container>
    }

    if (error) {
        return <Container><Alert severity={'error'}>{error}</Alert></Container>
    }

    return (
        <Container maxWidth={false} sx={{mt: 4, mb: 4, '& *:focus': {outline: 'none !important'}}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Button variant={'contained'} startIcon={<PersonAdd/>} onClick={handleAddClick}>
                    Add Employee
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: `rgba(223, 168, 18, 0.69)`,
                                '& .MuiTableCell-root': {
                                    fontWeight: 'bold',
                                    fontSize: '15px'
                                }
                            }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align={'right'}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedEmployees.length > 0 ? (
                            sortedEmployees
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((currentEmployee) => (
                                    <TableRow
                                        key={currentEmployee.employeeId}
                                        sx={{
                                            opacity: currentEmployee.isWorking ? 1 : 0.5, cursor: 'pointer',
                                            '& .MuiTableCell-root': {
                                                fontSize: '14px'
                                            }
                                        }}
                                    >
                                        <TableCell>{currentEmployee.employeeId}</TableCell>
                                        <TableCell>{currentEmployee.employeeName}</TableCell>
                                        <TableCell>{currentEmployee.gender}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={currentEmployee.isWorking ? 'Active' : 'Inactive'}
                                                color={currentEmployee.isWorking ? 'success' : 'error'}
                                                size={'small'}
                                            />
                                        </TableCell>
                                        <TableCell align={'right'}>
                                            <IconButton size={'small'}
                                                        onClick={() => handleEditClick(currentEmployee)}><Edit/></IconButton>
                                            <IconButton size={'small'} color={'error'}
                                                        onClick={() => handleDeleteClick(currentEmployee)}><PersonRemove/></IconButton>
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
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="td"
                    count={sortedEmployees.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth={'sm'} fullWidth={true}>
                <DialogTitle>
                    <Typography variant={'h4'}>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</Typography>
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
                        {editingEmployee && (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isWorking}
                                        onChange={(e) => setFormData({...formData, isWorking: e.target.checked})}
                                        color={'primary'}
                                    />
                                }
                                label={'Active'}
                                sx={{mt: 1}}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions color={'white'}>
                    <Button onClick={handleCloseModal} color={'black'}>
                        Cancel
                    </Button>
                    <Button
                        variant={'contained'}
                        onClick={handleFormSubmit}
                        disabled={submitting || !formData.name || !formData.gender}
                    >
                        {submitting ?
                            <CircularProgress size={20}/> : (editingEmployee ? 'Save Changes' : 'Add Employee')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} maxWidth={'xs'} fullWidth={true}>
                <DialogTitle>Confirm Delete!</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove <strong>{deleteTarget?.employeeName}</strong>?
                        This will mark them as inactive.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color={'error'} variant={'contained'} disabled={submitting}>
                        {submitting ? <CircularProgress size={20} color={'inherit'}/> : 'Confirm Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
export default EmployeeManagement;
