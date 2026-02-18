import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Tabs,
  Popconfirm,
  message,
  Badge,
} from "antd";
import {
  CalendarOff,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Hash,
  User,
  FileText,
} from "lucide-react";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const mockLeaves = [
  {
    key: 1,
    employee_id: "EMP001",
    name: "Ahmed Khan",
    type: "Annual",
    from: "2026-02-20",
    to: "2026-02-22",
    days: 3,
    reason: "Family vacation",
    status: "Pending",
    applied_on: "2026-02-15",
  },
  {
    key: 2,
    employee_id: "EMP002",
    name: "Sara Ali",
    type: "Sick",
    from: "2026-02-17",
    to: "2026-02-17",
    days: 1,
    reason: "Not feeling well",
    status: "Approved",
    applied_on: "2026-02-16",
  },
  {
    key: 3,
    employee_id: "EMP003",
    name: "Usman Raza",
    type: "Casual",
    from: "2026-02-18",
    to: "2026-02-19",
    days: 2,
    reason: "Personal work",
    status: "Rejected",
    applied_on: "2026-02-14",
  },
  {
    key: 4,
    employee_id: "EMP005",
    name: "Bilal Hussain",
    type: "Annual",
    from: "2026-03-01",
    to: "2026-03-05",
    days: 5,
    reason: "Travel plans",
    status: "Pending",
    applied_on: "2026-02-16",
  },
  {
    key: 5,
    employee_id: "EMP007",
    name: "Hassan Malik",
    type: "Sick",
    from: "2026-02-15",
    to: "2026-02-16",
    days: 2,
    reason: "Flu",
    status: "Approved",
    applied_on: "2026-02-14",
  },
];

const leaveTypeColors = {
  Annual: "blue",
  Sick: "red",
  Casual: "orange",
  Maternity: "pink",
  Paternity: "cyan",
};

const statusConfig = {
  Pending: { color: "warning", icon: <Clock size={14} /> },
  Approved: { color: "success", icon: <CheckCircle size={14} /> },
  Rejected: { color: "error", icon: <XCircle size={14} /> },
};

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState(mockLeaves);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("all");

  const pendingCount = leaves.filter((l) => l.status === "Pending").length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "Rejected").length;

  const filteredLeaves =
    activeTab === "all"
      ? leaves
      : leaves.filter((l) => l.status.toLowerCase() === activeTab);

  const handleApprove = (key) => {
    setLeaves((prev) =>
      prev.map((l) => (l.key === key ? { ...l, status: "Approved" } : l)),
    );
    message.success("Leave approved");
  };

  const handleReject = (key) => {
    setLeaves((prev) =>
      prev.map((l) => (l.key === key ? { ...l, status: "Rejected" } : l)),
    );
    message.error("Leave rejected");
  };

  const handleApply = (values) => {
    const newLeave = {
      key: Date.now(),
      employee_id: values.employee_id,
      name: values.employee_name,
      type: values.leave_type,
      from: values.dates[0].format("YYYY-MM-DD"),
      to: values.dates[1].format("YYYY-MM-DD"),
      days: values.dates[1].diff(values.dates[0], "day") + 1,
      reason: values.reason,
      status: "Pending",
      applied_on: dayjs().format("YYYY-MM-DD"),
    };
    setLeaves((prev) => [newLeave, ...prev]);
    setModalOpen(false);
    form.resetFields();
    message.success("Leave application submitted");
  };

  const columns = [
    {
      title: "Employee",
      key: "employee",
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.employee_id}
          </Text>
        </div>
      ),
    },
    {
      title: "Leave Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={leaveTypeColors[type] || "default"}>{type}</Tag>
      ),
      filters: Object.keys(leaveTypeColors).map((t) => ({
        text: t,
        value: t,
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      render: (text) => dayjs(text).format("DD MMM YYYY"),
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      render: (text) => dayjs(text).format("DD MMM YYYY"),
    },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
      render: (days) => <Tag>{days} day(s)</Tag>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const cfg = statusConfig[status];
        return (
          <Tag color={cfg?.color} icon={cfg?.icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) =>
        record.status === "Pending" ? (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<CheckCircle size={14} />}
              onClick={() => handleApprove(record.key)}
            >
              Approve
            </Button>
            <Popconfirm
              title="Reject this leave?"
              onConfirm={() => handleReject(record.key)}
            >
              <Button size="small" danger icon={<XCircle size={14} />}>
                Reject
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ];

  const tabItems = [
    {
      key: "all",
      label: (
        <Badge count={leaves.length} size="small" offset={[10, 0]}>
          All
        </Badge>
      ),
    },
    {
      key: "pending",
      label: (
        <Badge
          count={pendingCount}
          size="small"
          offset={[10, 0]}
          color="orange"
        >
          Pending
        </Badge>
      ),
    },
    {
      key: "approved",
      label: (
        <Badge
          count={approvedCount}
          size="small"
          offset={[10, 0]}
          color="green"
        >
          Approved
        </Badge>
      ),
    },
    {
      key: "rejected",
      label: (
        <Badge count={rejectedCount} size="small" offset={[10, 0]} color="red">
          Rejected
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <CalendarOff size={24} color="#0EA5E9" />
            <Title level={3} style={{ margin: 0 }}>
              Leave Management
            </Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setModalOpen(true)}
            size="large"
          >
            Apply Leave
          </Button>
        </Col>
      </Row>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={8}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="Pending"
              value={pendingCount}
              valueStyle={{ color: "#faad14" }}
              prefix={<Clock size={18} />}
            />
          </Card>
        </Col>
        <Col xs={8}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="Approved"
              value={approvedCount}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircle size={18} />}
            />
          </Card>
        </Col>
        <Col xs={8}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="Rejected"
              value={rejectedCount}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<XCircle size={18} />}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={columns}
          dataSource={filteredLeaves}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Apply Leave Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#e0f2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0EA5E9",
              }}
            >
              <CalendarOff size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                Apply for Leave
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>
                Submit a new leave application
              </div>
            </div>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApply}
          style={{ marginTop: 20 }}
          size="large"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Employee ID"
                name="employee_id"
                rules={[{ required: true, message: "Employee ID is required" }]}
              >
                <Input
                  prefix={<Hash size={15} style={{ color: "#94a3b8" }} />}
                  placeholder="EMP001"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Employee Name"
                name="employee_name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input
                  prefix={<User size={15} style={{ color: "#94a3b8" }} />}
                  placeholder="Full name"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Leave Type"
            name="leave_type"
            rules={[{ required: true, message: "Select a leave type" }]}
          >
            <Select
              placeholder="Select leave type"
              suffixIcon={<CalendarOff size={15} color="#94a3b8" />}
              options={Object.keys(leaveTypeColors).map((t) => ({
                label: t,
                value: t,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Leave Dates"
            name="dates"
            rules={[{ required: true, message: "Select leave dates" }]}
          >
            <RangePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              suffixIcon={<Calendar size={15} color="#94a3b8" />}
            />
          </Form.Item>
          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: "Provide a reason" }]}
          >
            <TextArea
              rows={3}
              placeholder="Briefly describe the reason for leave..."
              style={{ resize: "none" }}
            />
          </Form.Item>
          <Row justify="end" style={{ marginTop: 8 }}>
            <Space size={10}>
              <Button
                onClick={() => setModalOpen(false)}
                style={{ borderRadius: 8, height: 40, paddingInline: 20 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  borderRadius: 8,
                  height: 40,
                  paddingInline: 24,
                  fontWeight: 600,
                }}
              >
                Submit Application
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
