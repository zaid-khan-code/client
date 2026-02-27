import { useEffect, useState } from "react";
import {
  createEmployee,
  deleteEmployeeById,
  getAllEmployee,
  UpdateEmployee,
  getEmployeeId,
} from ".././services/employee";
import { Link } from "react-router-dom";

function Job() {
  const [formEmpId, setFormEmpId] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formDesignation, setFormDesignation] = useState("");
  const [formEmploymentType, setFormEmploymentType] = useState("");
  const [formShiftTiming, setFormShiftTiming] = useState("");
  const [formJoiningDate, setFormJoiningDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  // const [formBasicSalary, setFormBasicSalary] = useState("");
  const [formWorkLocation, setFormWorkLocation] = useState("");
  const [update, setUpdate] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [id, setId] = useState(0);
  const [employeeId, setEmployeeId] = useState([]);

  async function fetchEmpIds() {
    try {
      const empId = await getEmployeeId();
      setEmployeeId(empId.data);
    } catch (error) {
      throw new Error("error", error);
    }
  }

  function clearForm() {
    setFormEmpId("");
    setFormDepartment("");
    setFormDesignation("");
    setFormEmploymentType("");
    setFormShiftTiming("");
    setFormJoiningDate("");
    setFormEndDate("");
    setFormBasicSalary("");
    setFormWorkLocation("");
  }

  function getFormPayload() {
    return {
      employee_id: formEmpId.trim(),
      department: formDepartment.trim(),
      designation: formDesignation.trim(),
      employment_type: formEmploymentType.trim(),
      shift_timing: formShiftTiming.trim(),
      joining_date: formJoiningDate.trim(),
      end_date: formEndDate.trim(),
      basic_salary: formBasicSalary.trim(),
      work_location: formWorkLocation.trim(),
    };
  }

  function submitData(e) {
    e.preventDefault();
    if (
      !formEmpId.trim() ||
      !formDepartment.trim() ||
      !formDesignation.trim() ||
      !formEmploymentType.trim() ||
      !formShiftTiming.trim() ||
      !formJoiningDate.trim() ||
      !formEndDate.trim() ||
      !formBasicSalary.trim() ||
      !formWorkLocation.trim()
    ) {
      return;
    }

    update ? sendUpdatedEmp() : sendData();
  }

  async function sendUpdatedEmp() {
    const updateUser = getFormPayload();

    try {
      await UpdateEmployee(id, updateUser);
      fetchEmployee();
      clearForm();
    } catch (error) {
      throw new Error(`ERROR sending Data ${error}`);
    } finally {
      setUpdate(false);
    }
  }

  async function sendData() {
    const newUser = getFormPayload();

    try {
      await createEmployee(newUser);
      fetchEmployee();
      clearForm();
    } catch (error) {
      throw new Error(`ERROR sending Data ${error}`);
    }
  }

  async function deleteData(id) {
    try {
      await deleteEmployeeById(id);
      fetchEmployee();
    } catch (error) {
      throw new Error(`ERROR sending Data ${error}`);
    }
  }

  async function fetchEmployee() {
    try {
      const getEmp = await getAllEmployee();
      setEmployees(getEmp.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateEmp(employee) {
    setId(employee.id);
    setUpdate(true);
    setFormEmpId(employee.employee_id ?? "");
    setFormDepartment(employee.department ?? "");
    setFormDesignation(employee.designation ?? "");
    setFormEmploymentType(employee.employment_type ?? "");
    setFormShiftTiming(employee.shift_timing ?? "");
    setFormJoiningDate(employee.joining_date ?? "");
    setFormEndDate(employee.end_date ?? "");
    setFormBasicSalary(employee.basic_salary ?? "");
    setFormWorkLocation(employee.work_location ?? "");
  }

  useEffect(() => {
    fetchEmployee();
    fetchEmpIds();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-10 px-5 flex justify-center items-center">
        <form onSubmit={submitData} className="form-container">
          <h1 className="form-title">Employee Job Form</h1>
          <h1 className="form-title">
            <Link to="/extraemp">Go to Extra Employee Form</Link>
          </h1>

          <label htmlFor="empNum" className="form-group">
            <h3 className="form-label">Employee Number</h3>
            <select
              id="empNum"
              name="empNum"
              value={formEmpId}
              onChange={(e) => setFormEmpId(e.target.value)}
              className="form-input"
              required
            >
              <option value="" className="hidden">
                Select Employee Number
              </option>
              {employeeId.map(({ employee_id }) => (
                <option key={employee_id} value={employee_id}>
                  {employee_id}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="department" className="form-group">
            <h3 className="form-label">Department</h3>
            <input
              type="text"
              name="department"
              id="department"
              placeholder="Engineering"
              value={formDepartment}
              onChange={(e) => setFormDepartment(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="designation" className="form-group">
            <h3 className="form-label">Designation</h3>
            <input
              type="text"
              name="designation"
              id="designation"
              placeholder="Software Engineer"
              value={formDesignation}
              onChange={(e) => setFormDesignation(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="employmentType" className="form-group">
            <h3 className="form-label">Employment Type</h3>
            <select
              name="employmentType"
              id="employmentType"
              value={formEmploymentType}
              onChange={(e) => setFormEmploymentType(e.target.value)}
              className="form-input"
              required
            >
              <option value="" className="hidden">
                Select Employment Type
              </option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          </label>

          <label htmlFor="shiftTiming" className="form-group">
            <h3 className="form-label">Shift Timing</h3>
            <input
              type="text"
              name="shiftTiming"
              id="shiftTiming"
              placeholder="9:00 AM - 6:00 PM"
              value={formShiftTiming}
              onChange={(e) => setFormShiftTiming(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="joiningDate" className="form-group">
            <h3 className="form-label">Joining Date</h3>
            <input
              type="date"
              name="joiningDate"
              id="joiningDate"
              value={formJoiningDate}
              onChange={(e) => setFormJoiningDate(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="endDate" className="form-group">
            <h3 className="form-label">End Date</h3>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={formEndDate}
              onChange={(e) => setFormEndDate(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="basicSalary" className="form-group">
            <h3 className="form-label">Basic Salary</h3>
            <input
              type="number"
              name="basicSalary"
              id="basicSalary"
              placeholder="80000"
              value={formBasicSalary}
              onChange={(e) => setFormBasicSalary(e.target.value)}
              min="0"
              className="form-input"
              required
            />
          </label>

          <label htmlFor="workLocation" className="form-group">
            <h3 className="form-label">Work Location</h3>
            <input
              type="text"
              name="workLocation"
              id="workLocation"
              placeholder="Lahore Office"
              value={formWorkLocation}
              onChange={(e) => setFormWorkLocation(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <button type="submit" className="form-button">
            {update ? "Update" : "Submit"}
          </button>
        </form>
        <section className="table-container" aria-label="Employee job data table">
          <h2 className="table-title">Employee Job Data</h2>
          <h2 className="table-title">
            <button onClick={() => fetchEmployee()}>Refresh Data </button>
          </h2>
          <div className="table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Employment Type</th>
                  <th>Shift Timing</th>
                  <th>Joining Date</th>
                  <th>End Date</th>
                  <th>Basic Salary</th>
                  <th>Work Location</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td className="table-empty" colSpan="9">
                      No employee data available.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee, index) => (
                    <tr
                      key={
                        employee.employee_id ??
                        employee.id ??
                        employee.cnic ??
                        `employee-row-${index}`
                      }
                    >
                      <td>{employee.employee_id || "-"}</td>
                      <td>{employee.department || "-"}</td>
                      <td>{employee.designation || "-"}</td>
                      <td>{employee.employment_type || "-"}</td>
                      <td>{employee.shift_timing || "-"}</td>
                      <td>{employee.joining_date || "-"}</td>
                      <td>{employee.end_date || "-"}</td>
                      <td>{employee.basic_salary || "-"}</td>
                      <td>{employee.work_location || "-"}</td>
                      <td
                        onClick={() => {
                          deleteData(employee.id);
                        }}
                        className="bg-[#ff3232] text-white"
                      >
                        <button>Delete Employee </button>
                      </td>
                      <td
                        onClick={() => updateEmp(employee)}
                        className="bg-[#3aff3a] text-white"
                      >
                        <button>Update Employee </button>
                      </td>
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

export default Job;
