import { useEffect, useState } from "react";

function Employee({ value, onChange }) {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch("/employees");

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data = await response.json();
        setEmployees(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees: ", error);
        setError(error.message);
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  function handleEmployeeChange(event) {
    const selectedEmployee = event.target.value;
    onChange(selectedEmployee);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading employees:{error}</div>;

  return (
    <div className="employee-container">
      <label>Serviced By </label>
      <select id="employeeSelect" value={value} onChange={handleEmployeeChange}>
        <option value="">Select an employee</option>
        {employees.map((currentEmployee) => (
          <option
            key={currentEmployee.employeeId}
            value={currentEmployee.employeeId}
          >
            {currentEmployee.employeeName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Employee;
