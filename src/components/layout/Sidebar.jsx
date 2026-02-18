import { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Award,
  Briefcase,
  ShieldCheck,
  CalendarCheck,
  CalendarOff,
  Wallet,
  Settings,
} from "lucide-react";

const { Sider } = Layout;

const menuItems = [
  {
    key: "/",
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
  },
  {
    key: "/employees",
    icon: <Users size={18} />,
    label: "Employees",
  },
  {
    key: "/attendance",
    icon: <CalendarCheck size={18} />,
    label: "Attendance",
  },
  {
    key: "/leave",
    icon: <CalendarOff size={18} />,
    label: "Leave Management",
  },
  {
    key: "/payroll",
    icon: <Wallet size={18} />,
    label: "Payroll",
  },
  {
    key: "settings",
    icon: <Settings size={18} />,
    label: "Settings",
    children: [
      {
        key: "/departments",
        icon: <Building2 size={16} />,
        label: "Departments",
      },
      {
        key: "/designations",
        icon: <Award size={16} />,
        label: "Designations",
      },
      {
        key: "/employment-types",
        icon: <Briefcase size={16} />,
        label: "Employment Types",
      },
      {
        key: "/job-statuses",
        icon: <ShieldCheck size={16} />,
        label: "Job Statuses",
      },
    ],
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname === "/" ? "/" : location.pathname;

  const handleMenuClick = ({ key }) => {
    if (key !== "settings") {
      navigate(key);
      if (mobileOpen) setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 99,
            display: "block",
          }}
        />
      )}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        collapsedWidth={72}
        theme="dark"
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
        style={{
          background: "linear-gradient(180deg, #001529 0%, #000c17 100%)",
          height: "100vh",
          position: "fixed",
          left: mobileOpen ? 0 : undefined,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: "auto",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "0 16px",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #0EA5E9, #0284c7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: "#fff",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(14, 165, 233, 0.4)",
            }}
          >
            E
          </div>
          {!collapsed && (
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                letterSpacing: "0.5px",
              }}
            >
              ESSPL
            </span>
          )}
        </div>

        {/* Divider label */}
        {!collapsed && (
          <div
            style={{
              padding: "16px 24px 8px",
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Main Menu
          </div>
        )}

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={[
            location.pathname.match(
              /^\/(departments|designations|employment-types|job-statuses)/,
            )
              ? "settings"
              : "",
          ]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderInlineEnd: "none",
            background: "transparent",
            marginTop: collapsed ? 8 : 0,
          }}
        />

        {/* Bottom branding */}
        {!collapsed && (
          <div
            style={{
              position: "absolute",
              bottom: 60,
              left: 0,
              right: 0,
              textAlign: "center",
              padding: "16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.5px",
              }}
            >
              &copy; 2026 ESSPL
            </span>
          </div>
        )}
      </Sider>
    </>
  );
}
