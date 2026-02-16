import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [employee, setEmployee] = useState([]);

  // Form state for creating or editing employee
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [empFname, setEmpFname] = useState("");
  const [empCnic, setEmpCnic] = useState("");

  // To track the employee being edited
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch all employees
  async function fetchdata() {
    try {
      let data = await fetch("http://localhost:3000/api/employees");
      let convert = await data.json();
      setEmployee(convert.data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  }

  useEffect(() => {
    fetchdata();
  }, []);

  // Create new employee
  async function createEmployee(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: empId,
          name: empName,
          father_name: empFname,
          cnic: empCnic,
        }),
      });

      const result = await response.json();
      console.log(result);

      // Clear form after submit
      setEmpId("");
      setEmpName("");
      setEmpFname("");
      setEmpCnic("");

      // Refresh employee list
      fetchdata();
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  }

  // Update existing employee
  async function updateEmployee(e) {
    e.preventDefault();

    if (!editingEmployee) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/employees/${editingEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: empId,
            name: empName,
            father_name: empFname,
            cnic: empCnic,
          }),
        },
      );

      const result = await response.json();
      console.log(result);

      // Clear form and stop editing
      setEmpId("");
      setEmpName("");
      setEmpFname("");
      setEmpCnic("");
      setEditingEmployee(null);

      // Refresh employee list
      fetchdata();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  }

  // Delete employee
  async function deleteEmployee(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/employees/${id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();
      console.log(result);

      // Refresh employee list
      fetchdata();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }

  // Select employee to edit
  function editEmployee(emp) {
    setEmpId(emp.employee_id);
    setEmpName(emp.name);
    setEmpFname(emp.father_name);
    setEmpCnic(emp.cnic);
    setEditingEmployee(emp);
  }

  return (
    <div>
      <h1>{editingEmployee ? "Update Employee" : "Create Employee"}</h1>

      <form onSubmit={editingEmployee ? updateEmployee : createEmployee}>
        <input
          type="text"
          placeholder="Employee ID"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={empName}
          onChange={(e) => setEmpName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Father's Name"
          value={empFname}
          onChange={(e) => setEmpFname(e.target.value)}
        />
        <input
          type="text"
          placeholder="CNIC"
          value={empCnic}
          onChange={(e) => setEmpCnic(e.target.value)}
        />
        <button type="submit">
          {editingEmployee ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      <h2>Employees List</h2>

      <ul>
        {employee.map((emp) => (
          <li key={emp.id}>
            {emp.name} - {emp.cnic}{" "}
            <button onClick={() => editEmployee(emp)}>Edit</button>
            <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
