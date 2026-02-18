import {
  Layout,
  Breadcrumb,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Tooltip,
} from "antd";
import { useLocation, Link } from "react-router-dom";
import {
  UserCircle,
  Bell,
  Menu as MenuIcon,
  Maximize2,
  Search,
} from "lucide-react";

const { Header } = Layout;

const breadcrumbMap = {
  "/": "Dashboard",
  "/employees": "Employees",
  "/employees/add": "Add Employee",
  "/attendance": "Attendance",
  "/leave": "Leave Management",
  "/payroll": "Payroll",
  "/departments": "Departments",
  "/designations": "Designations",
  "/employment-types": "Employment Types",
  "/job-statuses": "Job Statuses",
};

const userMenuItems = [
  { key: "profile", label: "Profile" },
  { key: "settings", label: "Settings" },
  { type: "divider" },
  { key: "logout", label: "Logout", danger: true },
];

export default function TopHeader({ onMenuToggle }) {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const items = [{ title: <Link to="/">Home</Link> }];

    if (paths.length === 0) {
      items.push({ title: "Dashboard" });
    } else {
      let accum = "";
      paths.forEach((segment) => {
        accum += "/" + segment;
        const label = breadcrumbMap[accum] || segment;
        items.push({ title: <Link to={accum}>{label}</Link> });
      });
    }
    return items;
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e2e8f0",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Space align="center" size={16}>
        <MenuIcon
          size={20}
          style={{ cursor: "pointer", color: "#64748b" }}
          onClick={onMenuToggle}
          className="menu-toggle-btn"
        />
        <Breadcrumb items={getBreadcrumbs()} />
      </Space>

      <Space size={12}>
        <Tooltip title="Fullscreen">
          <Maximize2
            size={18}
            style={{ cursor: "pointer", color: "#64748b" }}
            onClick={handleFullscreen}
          />
        </Tooltip>
        <Tooltip title="Notifications">
          <Badge count={3} size="small" offset={[-2, 2]}>
            <Bell
              size={18}
              style={{ cursor: "pointer", color: "#64748b" }}
              className="notification-bell"
            />
          </Badge>
        </Tooltip>
        <div
          style={{
            width: 1,
            height: 24,
            background: "#e2e8f0",
            margin: "0 4px",
          }}
        />
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              size={34}
              style={{
                background: "linear-gradient(135deg, #0EA5E9, #0284c7)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              A
            </Avatar>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
                Admin
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                Administrator
              </div>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
