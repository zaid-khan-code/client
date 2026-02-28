import { useEffect, useMemo, useState } from "react";
import {
  createEmployee,
  deleteEmployeeById,
  getAllEmployee,
  UpdateEmployee,
  getEmployeeId,
} from ".././services/employee";
import { Link } from "react-router-dom";

const departmentOptions = [
  { id: "1", label: "Human Resources" },
  { id: "2", label: "Accounts" },
  { id: "3", label: "Operations" },
  { id: "4", label: "Engineering" },
];

const designationOptions = [
  { id: "1", label: "Manager" },
  { id: "2", label: "Supervisor" },
  { id: "3", label: "Officer" },
  { id: "4", label: "Associate" },
];

const employmentTypeOptions = [
  { id: "1", label: "Full-Time" },
  { id: "2", label: "Part-Time" },
  { id: "3", label: "Contract" },
  { id: "4", label: "Intern" },
];

const jobStatusOptions = [
  { id: "1", label: "Active" },
  { id: "2", label: "On Hold" },
  { id: "3", label: "Resigned" },
  { id: "4", label: "Terminated" },
];

function getLabelById(options, id) {
  const item = options.find((option) => String(option.id) === String(id));
  return item ? item.label : id || "-";
}

function getIdByLabel(options, label) {
  if (!label) {
    return "";
  }
  const item = options.find(
    (option) => option.label.toLowerCase() === String(label).toLowerCase(),
  );
  return item ? String(item.id) : "";
}

function Job() {
  const [formEmpId, setFormEmpId] = useState("");
  const [formDepartmentId, setFormDepartmentId] = useState("");
  const [formDesignationId, setFormDesignationId] = useState("");
  const [formEmploymentTypeId, setFormEmploymentTypeId] = useState("");
  const [formJobStatusId, setFormJobStatusId] = useState("");
  const [formDateOfJoining, setFormDateOfJoining] = useState("");
  const [formDateOfExit, setFormDateOfExit] = useState("");
  const [update, setUpdate] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [id, setId] = useState(0);
  const [employeeId, setEmployeeId] = useState([]);

  const departmentLabelMap = useMemo(
    () =>
      departmentOptions.reduce((acc, option) => {
        acc[String(option.id)] = option.label;
        return acc;
      }, {}),
    [],
  );

  const designationLabelMap = useMemo(
    () =>
      designationOptions.reduce((acc, option) => {
        acc[String(option.id)] = option.label;
        return acc;
      }, {}),
    [],
  );

  const employmentTypeLabelMap = useMemo(
    () =>
      employmentTypeOptions.reduce((acc, option) => {
        acc[String(option.id)] = option.label;
        return acc;
      }, {}),
    [],
  );

  const jobStatusLabelMap = useMemo(
    () =>
      jobStatusOptions.reduce((acc, option) => {
        acc[String(option.id)] = option.label;
        return acc;
      }, {}),
    [],
  );

  async function fetchEmpIds() {
    try {
      const empId = await getEmployeeId();
      setEmployeeId(empId.data);
    } catch (error) {
      throw new Error("Error loading employee IDs");
    }
  }

  function clearForm() {
    setFormEmpId("");
    setFormDepartmentId("");
    setFormDesignationId("");
    setFormEmploymentTypeId("");
    setFormJobStatusId("");
    setFormDateOfJoining("");
    setFormDateOfExit("");
  }

  function getFormPayload() {
    return {
      employee_id: formEmpId.trim(),
      department_id: Number(formDepartmentId),
      designation_id: Number(formDesignationId),
      employment_type_id: Number(formEmploymentTypeId),
      job_status_id: Number(formJobStatusId),
      date_of_joining: formDateOfJoining.trim(),
      date_of_exit: formDateOfExit.trim() || null,
    };
  }

  function submitData(e) {
    e.preventDefault();
    if (
      !formEmpId.trim() ||
      !formDepartmentId.trim() ||
      !formDesignationId.trim() ||
      !formEmploymentTypeId.trim() ||
      !formJobStatusId.trim() ||
      !formDateOfJoining.trim()
    ) {
      return;
    }

    update ? sendUpdatedEmp() : sendData();
  }

  async function sendUpdatedEmp() {
    const updateUser = getFormPayload();

    try {
      await UpdateEmployee(id, updateUser);
      await fetchEmployee();
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
      await fetchEmployee();
      clearForm();
    } catch (error) {
      throw new Error(`ERROR sending Data ${error}`);
    }
  }

  async function deleteData(employeeRecordId) {
    try {
      await deleteEmployeeById(employeeRecordId);
      await fetchEmployee();
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

  function updateEmp(employee) {
    setId(employee.id);
    setUpdate(true);
    setFormEmpId(String(employee.employee_id ?? ""));
    setFormDepartmentId(
      String(
        employee.department_id ?? getIdByLabel(departmentOptions, employee.department),
      ),
    );
    setFormDesignationId(
      String(
        employee.designation_id ??
          getIdByLabel(designationOptions, employee.designation),
      ),
    );
    setFormEmploymentTypeId(
      String(
        employee.employment_type_id ??
          getIdByLabel(employmentTypeOptions, employee.employment_type),
      ),
    );
    setFormJobStatusId(
      String(
        employee.job_status_id ?? getIdByLabel(jobStatusOptions, employee.job_status),
      ),
    );
    setFormDateOfJoining(employee.date_of_joining ?? employee.joining_date ?? "");
    setFormDateOfExit(employee.date_of_exit ?? employee.end_date ?? "");
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

          <label htmlFor="departmentId" className="form-group">
            <h3 className="form-label">Department</h3>
            <select
              id="departmentId"
              name="departmentId"
              value={formDepartmentId}
              onChange={(e) => setFormDepartmentId(e.target.value)}
              className="form-input"
              required
            >
              <option value="" className="hidden">
                Select Department
              </option>
              {departmentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="designationId" className="form-group">
            <h3 className="form-label">Designation</h3>
            <select
              id="designationId"
              name="designationId"
              value={formDesignationId}
              onChange={(e) => setFormDesignationId(e.target.value)}
              className="form-input"
              required
            >
              <option value="" className="hidden">
                Select Designation
              </option>
              {designationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="employmentTypeId" className="form-group">
            <h3 className="form-label">Employment Type</h3>
            <select
              id="employmentTypeId"
              name="employmentTypeId"
              value={formEmploymentTypeId}
              onChange={(e) => setFormEmploymentTypeId(e.target.value)}
              className="form-input"
              required
            >
              <option value="" className="hidden">
                Select Employment Type
              </option>
              {employmentTypeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="jobStatusId" className="form-group">
            <h3 className="form-label">Job Status</h3>
            <select
              id="jobStatusId"
              name="jobStatusId"
              value={formJobStatusId}
              onChange={(e) => setFormJobStatusId(e.target.value)}
              className="form-input"
              required
            >
              <option value="" className="hidden">
                Select Job Status
              </option>
              {jobStatusOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="dateOfJoining" className="form-group">
            <h3 className="form-label">Date of Joining</h3>
            <input
              type="date"
              name="dateOfJoining"
              id="dateOfJoining"
              value={formDateOfJoining}
              onChange={(e) => setFormDateOfJoining(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="dateOfExit" className="form-group">
            <h3 className="form-label">Date of Exit</h3>
            <input
              type="date"
              name="dateOfExit"
              id="dateOfExit"
              value={formDateOfExit}
              onChange={(e) => setFormDateOfExit(e.target.value)}
              className="form-input"
            />
          </label>

          <button type="submit" className="form-button">
            {update ? "Update" : "Submit"}
          </button>
        </form>
        <section className="table-container" aria-label="Employee job data table">
          <h2 className="table-title">Employee Job Data</h2>
          <h2 className="table-title">
            <button onClick={() => fetchEmployee()}>Refresh Data</button>
          </h2>
          <div className="table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Employment Type</th>
                  <th>Job Status</th>
                  <th>Date of Joining</th>
                  <th>Date of Exit</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td className="table-empty" colSpan="10">
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
                      <td>{employee.id || "-"}</td>
                      <td>{employee.employee_id || "-"}</td>
                      <td>
                        {employee.department ||
                          departmentLabelMap[String(employee.department_id)] ||
                          "-"}
                      </td>
                      <td>
                        {employee.designation ||
                          designationLabelMap[String(employee.designation_id)] ||
                          "-"}
                      </td>
                      <td>
                        {employee.employment_type ||
                          employmentTypeLabelMap[String(employee.employment_type_id)] ||
                          "-"}
                      </td>
                      <td>
                        {employee.job_status ||
                          jobStatusLabelMap[String(employee.job_status_id)] ||
                          "-"}
                      </td>
                      <td>{employee.date_of_joining || employee.joining_date || "-"}</td>
                      <td>{employee.date_of_exit || employee.end_date || "-"}</td>
                      <td
                        onClick={() => {
                          deleteData(employee.id);
                        }}
                        className="bg-[#ff3232] text-white"
                      >
                        <button>Delete Employee</button>
                      </td>
                      <td
                        onClick={() => updateEmp(employee)}
                        className="bg-[#3aff3a] text-white"
                      >
                        <button>Update Employee</button>
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
