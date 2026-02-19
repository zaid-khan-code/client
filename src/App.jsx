import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [employee_id, setEmployee_id] = useState("");
  const [name, setName] = useState("");
  const [father_name, setFather_name] = useState("");
  const [cnic, setCnic] = useState("");

  function submitData(e) {
    e.preventDefault();
    console.log(e);
    if (!employee_id && !name && !father_name && !cnic) {
      return true;
    } else {
    }
  }
  async function sendData() {
    const newUser = { employee_id, name, father_name, cnic };
  }

  async function fetchEmployee() {
    try {
      fetch("http://localhost:3000/api/employees")
        .then((response) => response.json())
        .then((data) => console.log(data));
    } catch (error) {}
  }

  useEffect(() => {
    fetchEmployee();
  }, []);
  return (
    <>
      <div>
        <form>
          <h1>Employee Form</h1>
          <label htmlFor="empNum">
            <h3>Empolyee Number</h3>
            <input
              type="text"
              name="empNum"
              id="empNum"
              placeholder="EMP001"
              value={employee_id}
              onChange={(e) => setEmployee_id(e.target.value)}
              pattern="^EMP\d{3}$"  
              title="Employee number should be in the format EMPxxx where 'x' is a digit."
              required
            />
          </label>
          <label htmlFor="empName">
            <h3>Empolyee Name</h3>
            <input
              type="text"
              name="empName"
              id="empName"
              placeholder="Zaid khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor="empFName">
            <h3>Empolyee Father Name</h3>
            <input
              type="text"
              name="empFName"
              id="empFName"
              placeholder="Asif khan"
              value={father_name}
              onChange={(e) => setFather_name(e.target.value)}
            />
          </label>
          <label htmlFor="empCnic">
            <h3>Empolyee CNIC</h3>
            <input
              type="text"
              name="empCnic"
              id="empCnic"
              placeholder="123456-1234567-21"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
            />
          </label>
          <button onClick={submitData}>Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;
