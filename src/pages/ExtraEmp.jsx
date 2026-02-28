import { useEffect, useState } from "react";
import { getEmployeeId, getAllEmployee } from ".././services/employee";
import {
  createExtraEmployee,
  getAllExtraEmployee,
  UpdateExtraEmployee,
} from ".././services/extraEmp";
import { Link } from "react-router-dom";

function ExtraEmp() {
  const [formEmpId, setFormEmpId] = useState("");
  const [formContact1, setFormContact1] = useState("");
  const [formContact2, setFormContact2] = useState("");
  const [formEmgContact1, setFormEmgContact1] = useState("");
  const [formEmgContact2, setFormEmgContact2] = useState("");
  const [formBankName, setFormBankName] = useState("");
  const [formBankAccNum, setFormBankAccNum] = useState("");
  const [formPostalAddress, setFormPostalAddress] = useState("");
  const [formPerAddress, setFormPerAddress] = useState("");
  const [update, setUpdate] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [id, setId] = useState(0);
  const [employeeId, setEmployeeId] = useState([]);
  console.log(id);
  console.log(update);

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
    setFormContact1("");
    setFormContact2("");
    setFormEmgContact1("");
    setFormEmgContact2("");
    setFormBankName("");
    setFormBankAccNum("");
    setFormPostalAddress("");
    setFormPerAddress("");
  }

  function getFormPayload() {
    return {
      employee_id: formEmpId.trim(),
      contact_1: formContact1.trim(),
      contact_2: formContact2.trim(),
      emergence_contact_1: formEmgContact1.trim(),
      emergence_contact_2: formEmgContact2.trim(),
      bank_name: formBankName.trim(),
      bank_acc_num: formBankAccNum.trim(),
      postal_address: formPostalAddress.trim(),
      perment_address: formPerAddress.trim(),
    };
  }

  function submitData(e) {
    e.preventDefault();
    if (
      !formEmpId.trim() ||
      !formContact1.trim() ||
      !formContact2.trim() ||
      !formEmgContact1.trim() ||
      !formEmgContact2.trim() ||
      !formBankName.trim() ||
      !formBankAccNum.trim() ||
      !formPostalAddress.trim() ||
      !formPerAddress.trim()
    ) {
      return;
    }

    update ? sendUpdatedEmp() : sendData();
  }

  async function sendUpdatedEmp() {
    const updateUser = {
      id: id,
      employee_id: formEmpId.trim(),
      contact_1: formContact1.trim(),
      contact_2: formContact2.trim(),
      emergence_contact_1: formEmgContact1.trim(),
      emergence_contact_2: formEmgContact2.trim(),
      bank_name: formBankName.trim(),
      bank_acc_num: formBankAccNum.trim(),
      postal_address: formPostalAddress.trim(),
      perment_address: formPerAddress.trim(),
    };
    console.log(updateUser);

    try {
      await UpdateExtraEmployee(updateUser);
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
      await createExtraEmployee(newUser);
      fetchEmployee();
      clearForm();
    } catch (error) {
      throw new Error(`ERROR sending Data ${error}`);
    }
  }

  // async function deleteData(id) {
  //   // try {
  //   //   await deleteEmployeeById(id);
  //   //   fetchEmployee();
  //   // } catch (error) {
  //   //   throw new Error(`ERROR sending Data ${error}`);
  //   // }
  // }

  async function fetchEmployee() {
    try {
      const getEmp = await getAllExtraEmployee();
      setEmployees(getEmp.data);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(employees);

  async function updateEmp(employee) {
    setId(employee.id);
    setUpdate(true);
    setFormEmpId(employee.employee_id ?? "");
    setFormContact1(employee.contact_1 ?? "");
    setFormContact2(employee.contact_2 ?? "");
    setFormEmgContact1(employee.emergence_contact_1 ?? "");
    setFormEmgContact2(employee.emergence_contact_2 ?? "");
    setFormBankName(employee.bank_name ?? "");
    setFormBankAccNum(employee.bank_acc_num ?? "");
    setFormPostalAddress(employee.postal_address ?? "");
    setFormPerAddress(employee.perment_address ?? "");
  }

  useEffect(() => {
    fetchEmployee();
    fetchEmpIds();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-10 px-5 flex justify-center items-center">
        <form onSubmit={submitData} className="form-container">
          <h1 className="form-title">Employee Form</h1>
          <h1 className="form-title">
            <Link to="/jobs">Go to the Employee Job Form</Link>
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

          <label htmlFor="contact1" className="form-group">
            <h3 className="form-label">Contact 1</h3>
            <input
              type="tel"
              name="contact1"
              id="contact1"
              placeholder="03001234567"
              value={formContact1}
              onChange={(e) => setFormContact1(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="contact2" className="form-group">
            <h3 className="form-label">Contact 2</h3>
            <input
              type="tel"
              name="contact2"
              id="contact2"
              placeholder="03111234567"
              value={formContact2}
              onChange={(e) => setFormContact2(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="emgContact1" className="form-group">
            <h3 className="form-label">Emergency Contact 1</h3>
            <input
              type="tel"
              name="emgContact1"
              id="emgContact1"
              placeholder="03221234567"
              value={formEmgContact1}
              onChange={(e) => setFormEmgContact1(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="emgContact2" className="form-group">
            <h3 className="form-label">Emergency Contact 2</h3>
            <input
              type="tel"
              name="emgContact2"
              id="emgContact2"
              placeholder="03331234567"
              value={formEmgContact2}
              onChange={(e) => setFormEmgContact2(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label htmlFor="bankName" className="form-group">
            <h3 className="form-label">Bank Name</h3>
            <input
              type="text"
              name="bankName"
              id="bankName"
              placeholder="HBL"
              value={formBankName}
              onChange={(e) => setFormBankName(e.target.value)}
              className="form-input"
            />
          </label>

          <label htmlFor="bankAccNum" className="form-group">
            <h3 className="form-label">Bank Account Number</h3>
            <input
              type="text"
              name="bankAccNum"
              id="bankAccNum"
              placeholder="PK00ABCD1234567890123456"
              value={formBankAccNum}
              onChange={(e) => setFormBankAccNum(e.target.value)}
              className="form-input"
            />
          </label>

          <label htmlFor="postalAddress" className="form-group">
            <h3 className="form-label">Postal Address</h3>
            <textarea
              name="postalAddress"
              id="postalAddress"
              placeholder="House #, Street, City"
              value={formPostalAddress}
              onChange={(e) => setFormPostalAddress(e.target.value)}
              className="form-input"
              rows={3}
              required
            />
          </label>

          <label htmlFor="perAddress" className="form-group">
            <h3 className="form-label">Permanent Address</h3>
            <textarea
              name="perAddress"
              id="perAddress"
              placeholder="House #, Street, City"
              value={formPerAddress}
              onChange={(e) => setFormPerAddress(e.target.value)}
              className="form-input"
              rows={3}
              required
            />
          </label>

          <button type="submit" className="form-button">
            {update ? "Update" : "Submit"}
          </button>
        </form>
        <section className="table-container" aria-label="Employee data table">
          <h2 className="table-title">Employee Data</h2>
          <h2 className="table-title">
            <button onClick={() => fetchEmployee()}>Refresh Data </button>
          </h2>
          <div className="table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Father Name</th>
                  <th>CNIC</th>
                  <th>Date of Birth</th>
                  <th>Contact 1</th>
                  <th>Contact 2</th>
                  <th>Bank Name</th>
                  <th>Bank Account Number</th>
                  <th>Prement Addres</th>
                  <th>Postal Addres</th>
                  <th>Extra Id</th>
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
                      <td>{employee.name || "-"}</td>
                      <td>{employee.father_name || "-"}</td>
                      <td>{employee.cnic || "-"}</td>
                      <td>{employee.date_of_birth || "-"}</td>
                      <td>{employee.contact_1 || "-"}</td>
                      <td>{employee.contact_2 || "-"}</td>
                      <td>{employee.bank_name || "-"}</td>
                      <td>{employee.bank_acc_num || "-"}</td>
                      <td>{employee.perment_address || "-"}</td>
                      <td>{employee.postal_address || "-"}</td>
                      <td>{employee.id || "-"}</td>

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

export default ExtraEmp;
