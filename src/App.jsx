import { useEffect, useState } from "react";
import "./App.css";
import { getAllEmployee } from "./services/employee";

function App() {
  const [employeeId, setEmployeeId] = useState("");
  const [empName, setName] = useState("");
  const [empFatherName, setFather_name] = useState("");
  const [empCNIC, setCnic] = useState("");
  const [dateOfBirth, setDate] = useState("");
  const [employees, setEmployees] = useState("");

  function submitData(e) {
    e.preventDefault();
    console.log(e);
    if (!employeeId && !empName && !empFatherName && !empCNIC && !dateOfBirth) {
      return true;
    } else {
      sendData();
    }
  }
  async function sendData() {
    const newUser = {
      employee_id: employeeId.trim(),
      name: empName.trim(),
      father_name: empFatherName.trim(),
      cnic: empCNIC.trim(),
      date_of_birth: dateOfBirth.trim(),
    };
    try {
      const response = await fetch("http://localhost:3000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const result = await response.json();
      console.log(result);
      setCnic("");
      setEmployeeId("");
      setFather_name("");
      setName("");
      setDate("");
    } catch (error) {
      throw new Error(`ERROR sending Data ${error}`);
    }
  }

  async function fetchEmployee() {
    try {
      fetch("http://localhost:3000/api/employees")
        .then((response) => response.json())
        .then((data) => setEmployees(data));
    } catch (error) {}
  }

  useEffect(() => {
    // fetchEmployee();
    getAllEmployee();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-10 px-5 flex justify-center items-center">
        <form onSubmit={submitData} className="form-container">
          <h1 className="form-title">Employee Form</h1>
          <label htmlFor="empNum" className="form-group">
            <h3 className="form-label">Employee Number</h3>
            <input
              type="text"
              name="empNum"
              id="empNum"
              placeholder="EMP001"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              pattern="^EMP\d{3}$"
              title="Employee number should be in the format EMPxxx where 'x' is a digit."
              className="form-input"
              required
            />
          </label>
          <label htmlFor="empName" className="form-group">
            <h3 className="form-label">Employee Name</h3>
            <input
              type="text"
              name="empName"
              id="empName"
              placeholder="Zaid khan"
              value={empName}
              onChange={(e) => setName(e.target.value)}
              pattern="^[a-zA-Z\s\-']+$"
              title="Employee name should contain only letters, spaces, hyphens, and apostrophes."
              className="form-input"
              required
            />
          </label>
          <label htmlFor="empFName" className="form-group">
            <h3 className="form-label">Employee Father Name</h3>
            <input
              type="text"
              name="empFName"
              id="empFName"
              placeholder="Asif khan"
              value={empFatherName}
              onChange={(e) => setFather_name(e.target.value)}
              pattern="^[a-zA-Z\s\-']+$"
              title="Father name should contain only letters, spaces, hyphens, and apostrophes."
              className="form-input"
              required
            />
          </label>
          <label htmlFor="empCnic" className="form-group">
            <h3 className="form-label">Employee CNIC</h3>
            <input
              type="text"
              name="empCnic"
              id="empCnic"
              placeholder="42000-2416284-5"
              value={empCNIC}
              onChange={(e) => setCnic(e.target.value)}
              pattern="^\d{5}-\d{7}-\d{2}$"
              title="CNIC should be in the format XXXXX-XXXXXXX-XX where 'X' is a digit."
              className="form-input"
              required
            />
          </label>
          <label htmlFor="empBD" className="form-group">
            <h3 className="form-label">Employee Date Of Birth</h3>
            <input
              type="date"
              name="empBD"
              id="empBD"
              value={dateOfBirth}
              onChange={(e) => setDate(e.target.value)}
              title="CNIC should be in the format XXXXX-XXXXXXX-XX where 'X' is a digit."
              className="form-input"
              required
            />
          </label>
          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
        <section className="table-container" aria-label="Employee data table">
          <h2 className="table-title">Employee Data</h2>
          <div className="table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Father Name</th>
                  <th>CNIC</th>
                  <th>Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td className="table-empty" colSpan="5">
                      No employee data available.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr
                      key={employee.employee_id || employee.id || employee.cnic}
                    >
                      <td>{employee.employee_id || "-"}</td>
                      <td>{employee.name || "-"}</td>
                      <td>{employee.father_name || "-"}</td>
                      <td>{employee.cnic || "-"}</td>
                      <td>{employee.date_of_birth || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
