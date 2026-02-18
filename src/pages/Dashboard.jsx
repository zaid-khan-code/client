import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Skeleton,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Plus,
  CalendarCheck,
  CalendarOff,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sun,
  CloudSun,
  Moon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { getEmployees } from "../api/employeeApi";

const { Title, Text } = Typography;

// Mock data for charts (will be replaced with real API data later)
const departmentData = [
  { name: "Engineering", count: 45 },
  { name: "HR", count: 12 },
  { name: "Finance", count: 18 },
  { name: "Marketing", count: 22 },
  { name: "Operations", count: 30 },
  { name: "Sales", count: 25 },
];

const monthlyHiringData = [
  { month: "Jan", hired: 5, exited: 2 },
  { month: "Feb", hired: 8, exited: 1 },
  { month: "Mar", hired: 3, exited: 3 },
  { month: "Apr", hired: 12, exited: 2 },
  { month: "May", hired: 6, exited: 4 },
  { month: "Jun", hired: 9, exited: 1 },
  { month: "Jul", hired: 7, exited: 2 },
  { month: "Aug", hired: 4, exited: 3 },
  { month: "Sep", hired: 10, exited: 1 },
  { month: "Oct", hired: 8, exited: 2 },
  { month: "Nov", hired: 6, exited: 5 },
  { month: "Dec", hired: 11, exited: 3 },
];

const attendanceTrendData = [
  { day: "Mon", present: 140, absent: 12 },
  { day: "Tue", present: 138, absent: 14 },
  { day: "Wed", present: 145, absent: 7 },
  { day: "Thu", present: 130, absent: 22 },
  { day: "Fri", present: 125, absent: 27 },
];

const recentActivities = [
  {
    key: 1,
    action: "New employee added",
    name: "Ahmed Khan",
    time: "2 hours ago",
    type: "success",
  },
  {
    key: 2,
    action: "Leave approved",
    name: "Sara Ali",
    time: "3 hours ago",
    type: "processing",
  },
  {
    key: 3,
    action: "Attendance marked",
    name: "Usman Raza",
    time: "5 hours ago",
    type: "default",
  },
  {
    key: 4,
    action: "Employee exited",
    name: "Fatima Noor",
    time: "1 day ago",
    type: "error",
  },
  {
    key: 5,
    action: "Salary processed",
    name: "Zaid Ahmed",
    time: "2 days ago",
    type: "warning",
  },
];

const activityColumns = [
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text, record) => <Tag color={record.type}>{text}</Tag>,
  },
  { title: "Employee", dataIndex: "name", key: "name" },
  { title: "Time", dataIndex: "time", key: "time" },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", icon: <Sun size={28} /> };
  if (hour < 17)
    return { text: "Good Afternoon", icon: <CloudSun size={28} /> };
  return { text: "Good Evening", icon: <Moon size={28} /> };
};

const formatDate = () => {
  return new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const greeting = getGreeting();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEmployees();
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setTotalEmployees(data.length);
      } catch {
        setTotalEmployees(152); // fallback mock value
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: <Users size={24} />,
      color: "#e0f2fe",
      iconColor: "#0EA5E9",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Active Employees",
      value: Math.round(totalEmployees * 0.88) || 134,
      icon: <UserCheck size={24} />,
      color: "#dcfce7",
      iconColor: "#22c55e",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "On Leave Today",
      value: 8,
      icon: <UserX size={24} />,
      color: "#fef3c7",
      iconColor: "#f59e0b",
      trend: "-2",
      trendUp: false,
    },
    {
      title: "Departments",
      value: 6,
      icon: <Building2 size={24} />,
      color: "#f3e8ff",
      iconColor: "#8b5cf6",
      trend: "",
      trendUp: false,
    },
  ];

  const quickActions = [
    { label: "Add Employee", icon: <Plus size={16} />, path: "/employees/add" },
    {
      label: "Mark Attendance",
      icon: <CalendarCheck size={16} />,
      path: "/attendance",
    },
    { label: "Apply Leave", icon: <CalendarOff size={16} />, path: "/leave" },
    { label: "View Payroll", icon: <Wallet size={16} />, path: "/payroll" },
  ];

  return (
    <div>
      {/* Welcome Bar */}
      <div className="welcome-bar" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle" wrap>
          <Col>
            <Space size={12} align="center" style={{ marginBottom: 8 }}>
              {greeting.icon}
              <div>
                <Title
                  level={3}
                  style={{ margin: 0, color: "#fff", fontWeight: 700 }}
                >
                  {greeting.text}, Admin
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
                  {formatDate()} &nbsp;|&nbsp;{" "}
                  {currentTime.toLocaleTimeString("en-PK", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space size={8} wrap>
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  className="quick-action-btn"
                  icon={action.icon}
                  onClick={() => navigate(action.path)}
                  size="middle"
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          </Col>
        </Row>
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            {loading ? (
              <Card bordered={false}>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            ) : (
              <Card
                bordered={false}
                className="stat-card count-animate"
                style={{
                  background: "#fff",
                  animationDelay: `${index * 0.1}s`,
                }}
                bodyStyle={{ padding: "20px 24px" }}
              >
                <Row justify="space-between" align="top">
                  <Col>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      {card.title}
                    </Text>
                    <Space align="baseline" size={8}>
                      <span
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#1e293b",
                          lineHeight: 1,
                        }}
                      >
                        {card.value}
                      </span>
                      {card.trend && (
                        <Tag
                          color={card.trendUp ? "green" : "orange"}
                          style={{
                            fontSize: 11,
                            borderRadius: 20,
                            padding: "0 8px",
                          }}
                        >
                          {card.trendUp && <ArrowUpRight size={11} />}{" "}
                          {card.trend}
                        </Tag>
                      )}
                    </Space>
                  </Col>
                  <Col>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        backgroundColor: card.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: card.iconColor,
                      }}
                    >
                      {card.icon}
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>
        ))}
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card
            title={
              <Text strong style={{ fontSize: 15 }}>
                Monthly Hiring vs Exit Trends
              </Text>
            }
            bordered={false}
            className="chart-card"
            style={{ animationDelay: "0.2s" }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyHiringData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="hired"
                  fill="#0EA5E9"
                  name="Hired"
                  radius={[6, 6, 0, 0]}
                  animationBegin={200}
                  animationDuration={800}
                />
                <Bar
                  dataKey="exited"
                  fill="#f43f5e"
                  name="Exited"
                  radius={[6, 6, 0, 0]}
                  animationBegin={400}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Text strong style={{ fontSize: 15 }}>
                Employees by Department
              </Text>
            }
            bordered={false}
            className="chart-card"
            style={{ animationDelay: "0.4s" }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#0EA5E9"
                  radius={[0, 6, 6, 0]}
                  animationBegin={400}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Text strong style={{ fontSize: 15 }}>
                Weekly Attendance Overview
              </Text>
            }
            bordered={false}
            className="chart-card"
            style={{ animationDelay: "0.5s" }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="present"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#dcfce7"
                  name="Present"
                  animationBegin={500}
                  animationDuration={1000}
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  stackId="1"
                  stroke="#f43f5e"
                  fill="#ffe4e6"
                  name="Absent"
                  animationBegin={600}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Text strong style={{ fontSize: 15 }}>
                Recent Activity
              </Text>
            }
            bordered={false}
          >
            <Table
              columns={activityColumns}
              dataSource={recentActivities}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
