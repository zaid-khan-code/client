import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  DatePicker,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  message,
  Input,
} from "antd";
import {
  CalendarCheck,
  Clock,
  LogIn,
  LogOut,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";
import dayjs from "dayjs";

const { Title } = Typography;

// Mock attendance data
const mockAttendance = [
  {
    key: 1,
    employee_id: "EMP001",
    name: "Ahmed Khan",
    date: "2026-02-17",
    check_in: "09:02 AM",
    check_out: "06:05 PM",
    status: "Present",
    hours: "9h 03m",
  },
  {
    key: 2,
    employee_id: "EMP002",
    name: "Sara Ali",
    date: "2026-02-17",
    check_in: "08:55 AM",
    check_out: "05:30 PM",
    status: "Present",
    hours: "8h 35m",
  },
  {
    key: 3,
    employee_id: "EMP003",
    name: "Usman Raza",
    date: "2026-02-17",
    check_in: "10:15 AM",
    check_out: "06:00 PM",
    status: "Late",
    hours: "7h 45m",
  },
  {
    key: 4,
    employee_id: "EMP004",
    name: "Fatima Noor",
    date: "2026-02-17",
    check_in: null,
    check_out: null,
    status: "Absent",
    hours: "—",
  },
  {
    key: 5,
    employee_id: "EMP005",
    name: "Bilal Hussain",
    date: "2026-02-17",
    check_in: "09:00 AM",
    check_out: "01:00 PM",
    status: "Half Day",
    hours: "4h 00m",
  },
  {
    key: 6,
    employee_id: "EMP006",
    name: "Ayesha Siddiqui",
    date: "2026-02-17",
    check_in: null,
    check_out: null,
    status: "On Leave",
    hours: "—",
  },
  {
    key: 7,
    employee_id: "EMP007",
    name: "Hassan Malik",
    date: "2026-02-17",
    check_in: "08:45 AM",
    check_out: "05:50 PM",
    status: "Present",
    hours: "9h 05m",
  },
  {
    key: 8,
    employee_id: "EMP008",
    name: "Zainab Shah",
    date: "2026-02-17",
    check_in: "09:30 AM",
    check_out: null,
    status: "Present",
    hours: "In Progress",
  },
];

const statusColors = {
  Present: "green",
  Absent: "red",
  Late: "orange",
  "Half Day": "blue",
  "On Leave": "purple",
};

export default function Attendance() {
  const [data] = useState(mockAttendance);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const filteredData = data.filter((item) => {
    const matchSearch =
      !searchText ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.employee_id.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const presentCount = data.filter((d) => d.status === "Present").length;
  const absentCount = data.filter((d) => d.status === "Absent").length;
  const lateCount = data.filter((d) => d.status === "Late").length;
  const onLeaveCount = data.filter((d) => d.status === "On Leave").length;

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Check In",
      dataIndex: "check_in",
      key: "check_in",
      render: (text) =>
        text ? (
          <Space>
            <LogIn size={14} color="#52c41a" /> {text}
          </Space>
        ) : (
          <span style={{ color: "#bfbfbf" }}>—</span>
        ),
    },
    {
      title: "Check Out",
      dataIndex: "check_out",
      key: "check_out",
      render: (text) =>
        text ? (
          <Space>
            <LogOut size={14} color="#ff4d4f" /> {text}
          </Space>
        ) : (
          <span style={{ color: "#bfbfbf" }}>—</span>
        ),
    },
    {
      title: "Working Hours",
      dataIndex: "hours",
      key: "hours",
      render: (text) => (
        <Space>
          <Clock size={14} /> {text}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
      filters: Object.keys(statusColors).map((s) => ({
        text: s,
        value: s,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          {!record.check_in && record.status !== "On Leave" && (
            <Button
              size="small"
              type="primary"
              icon={<LogIn size={14} />}
              onClick={() => message.info("Check-in API not connected yet")}
            >
              Check In
            </Button>
          )}
          {record.check_in && !record.check_out && (
            <Button
              size="small"
              danger
              icon={<LogOut size={14} />}
              onClick={() => message.info("Check-out API not connected yet")}
            >
              Check Out
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <CalendarCheck size={24} color="#0EA5E9" />
            <Title level={3} style={{ margin: 0 }}>
              Attendance
            </Title>
          </Space>
        </Col>
        <Col>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            format="DD/MM/YYYY"
            size="large"
          />
        </Col>
      </Row>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="Present"
              value={presentCount}
              valueStyle={{ color: "#52c41a" }}
              prefix={<UserCheck size={18} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="Absent"
              value={absentCount}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<UserX size={18} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="Late"
              value={lateCount}
              valueStyle={{ color: "#faad14" }}
              prefix={<Clock size={18} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="On Leave"
              value={onLeaveCount}
              valueStyle={{ color: "#722ed1" }}
              prefix={<CalendarCheck size={18} />}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={10}>
            <Input
              placeholder="Search by name or ID..."
              prefix={<Search size={16} color="#bfbfbf" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: "100%" }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={Object.keys(statusColors).map((s) => ({
                label: s,
                value: s,
              }))}
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
          size="middle"
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}
