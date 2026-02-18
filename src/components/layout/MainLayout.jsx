import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

const { Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const siderWidth = collapsed ? 72 : 250;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Layout
        style={{
          marginLeft: siderWidth,
          background: "#f0f5ff",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <TopHeader
          onMenuToggle={() => {
            if (window.innerWidth < 992) {
              setMobileOpen(!mobileOpen);
            } else {
              setCollapsed(!collapsed);
            }
          }}
        />
        <Content
          style={{
            margin: 24,
            minHeight: "calc(100vh - 112px)",
          }}
        >
          <div className="page-animate">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
