import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeForm from "./pages/employees/EmployeeForm";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import Attendance from "./pages/attendance/Attendance";
import LeaveManagement from "./pages/leave/LeaveManagement";
import Payroll from "./pages/payroll/Payroll";
import Departments from "./pages/settings/Departments";
import Designations from "./pages/settings/Designations";
import EmploymentTypes from "./pages/settings/EmploymentTypes";
import JobStatuses from "./pages/settings/JobStatuses";
import NotFound from "./pages/NotFound";

const theme = {
  token: {
    colorPrimary: "#0EA5E9",
    colorInfo: "#0EA5E9",
    borderRadius: 8,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f0f5ff",
  },
  components: {
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 36,
    },
    Table: {
      borderRadiusLG: 12,
    },
    Input: {
      borderRadius: 8,
    },
    Select: {
      borderRadius: 8,
    },
    Modal: {
      borderRadiusLG: 16,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/add" element={<EmployeeForm />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<LeaveManagement />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/designations" element={<Designations />} />
            <Route path="/employment-types" element={<EmploymentTypes />} />
            <Route path="/job-statuses" element={<JobStatuses />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
