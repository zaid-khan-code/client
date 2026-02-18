import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Input,
  DatePicker,
  Modal,
  Descriptions,
  Divider,
} from "antd";
import {
  Wallet,
  Search,
  Download,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const mockPayroll = [
  {
    key: 1,
    employee_id: "EMP001",
    name: "Ahmed Khan",
    department: "Engineering",
    designation: "Senior Engineer",
    basic_salary: 120000,
    allowances: 15000,
    deductions: 8500,
    net_salary: 126500,
    status: "Paid",
    pay_date: "2026-01-31",
  },
  {
    key: 2,
    employee_id: "EMP002",
    name: "Sara Ali",
    department: "HR",
    designation: "HR Manager",
    basic_salary: 100000,
    allowances: 12000,
    deductions: 7000,
    net_salary: 105000,
    status: "Paid",
    pay_date: "2026-01-31",
  },
  {
    key: 3,
    employee_id: "EMP003",
    name: "Usman Raza",
    department: "Finance",
    designation: "Accountant",
    basic_salary: 85000,
    allowances: 10000,
    deductions: 5500,
    net_salary: 89500,
    status: "Pending",
    pay_date: null,
  },
  {
    key: 4,
    employee_id: "EMP004",
    name: "Fatima Noor",
    department: "Marketing",
    designation: "Marketing Lead",
    basic_salary: 95000,
    allowances: 11000,
    deductions: 6200,
    net_salary: 99800,
    status: "Pending",
    pay_date: null,
  },
  {
    key: 5,
    employee_id: "EMP005",
    name: "Bilal Hussain",
    department: "Engineering",
    designation: "Software Engineer",
    basic_salary: 90000,
    allowances: 10000,
    deductions: 6000,
    net_salary: 94000,
    status: "Paid",
    pay_date: "2026-01-31",
  },
  {
    key: 6,
    employee_id: "EMP006",
    name: "Ayesha Siddiqui",
    department: "Operations",
    designation: "Operations Manager",
    basic_salary: 110000,
    allowances: 14000,
    deductions: 7800,
    net_salary: 116200,
    status: "Processing",
    pay_date: null,
  },
  {
    key: 7,
    employee_id: "EMP007",
    name: "Hassan Malik",
    department: "Sales",
    designation: "Sales Executive",
    basic_salary: 70000,
    allowances: 8000,
    deductions: 4500,
    net_salary: 73500,
    status: "Paid",
    pay_date: "2026-01-31",
  },
];

const formatCurrency = (amount) =>
  `PKR ${amount?.toLocaleString("en-PK") || 0}`;

export default function Payroll() {
  const [data] = useState(mockPayroll);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [detailModal, setDetailModal] = useState(null);

  const filteredData = data.filter((item) => {
    const matchSearch =
      !searchText ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.employee_id.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPayroll = data.reduce((sum, d) => sum + d.net_salary, 0);
  const paidTotal = data
    .filter((d) => d.status === "Paid")
    .reduce((sum, d) => sum + d.net_salary, 0);
  const pendingTotal = data
    .filter((d) => d.status !== "Paid")
    .reduce((sum, d) => sum + d.net_salary, 0);

  const statusColors = {
    Paid: "green",
    Pending: "orange",
    Processing: "blue",
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
            {record.employee_id} &middot; {record.department}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Basic Salary",
      dataIndex: "basic_salary",
      key: "basic_salary",
      render: (val) => formatCurrency(val),
      sorter: (a, b) => a.basic_salary - b.basic_salary,
    },
    {
      title: "Allowances",
      dataIndex: "allowances",
      key: "allowances",
      render: (val) => (
        <Text style={{ color: "#52c41a" }}>+ {formatCurrency(val)}</Text>
      ),
    },
    {
      title: "Deductions",
      dataIndex: "deductions",
      key: "deductions",
      render: (val) => (
        <Text style={{ color: "#ff4d4f" }}>- {formatCurrency(val)}</Text>
      ),
    },
    {
      title: "Net Salary",
      dataIndex: "net_salary",
      key: "net_salary",
      render: (val) => (
        <Text strong style={{ color: "#0EA5E9" }}>
          {formatCurrency(val)}
        </Text>
      ),
      sorter: (a, b) => a.net_salary - b.net_salary,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<Eye size={16} />}
          onClick={() => setDetailModal(record)}
        />
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Wallet size={24} color="#0EA5E9" />
            <Title level={3} style={{ margin: 0 }}>
              Payroll
            </Title>
          </Space>
        </Col>
        <Col>
          <Space>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={setSelectedMonth}
              format="MMMM YYYY"
              size="large"
            />
            <Button icon={<Download size={14} />} size="large">
              Export
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="Total Payroll"
              value={totalPayroll}
              prefix={<DollarSign size={18} />}
              formatter={(val) => `PKR ${val.toLocaleString("en-PK")}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="Paid"
              value={paidTotal}
              valueStyle={{ color: "#52c41a" }}
              prefix={<TrendingUp size={18} />}
              formatter={(val) => `PKR ${val.toLocaleString("en-PK")}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic
              title="Pending"
              value={pendingTotal}
              valueStyle={{ color: "#faad14" }}
              prefix={<Users size={18} />}
              formatter={(val) => `PKR ${val.toLocaleString("en-PK")}`}
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
              options={[
                { label: "Paid", value: "Paid" },
                { label: "Pending", value: "Pending" },
                { label: "Processing", value: "Processing" },
              ]}
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
          scroll={{ x: 1100 }}
          summary={(pageData) => {
            const totalNet = pageData.reduce((sum, r) => sum + r.net_salary, 0);
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <Text strong>Page Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text strong style={{ color: "#0EA5E9" }}>
                    {formatCurrency(totalNet)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} colSpan={2} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>

      {/* Pay Slip Modal */}
      <Modal
        title="Pay Slip"
        open={!!detailModal}
        onCancel={() => setDetailModal(null)}
        footer={[
          <Button key="close" onClick={() => setDetailModal(null)}>
            Close
          </Button>,
          <Button key="print" type="primary" icon={<Download size={14} />}>
            Download PDF
          </Button>,
        ]}
        width={600}
      >
        {detailModal && (
          <>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Employee ID">
                {detailModal.employee_id}
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {detailModal.name}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {detailModal.department}
              </Descriptions.Item>
              <Descriptions.Item label="Designation">
                {detailModal.designation}
              </Descriptions.Item>
              <Descriptions.Item label="Pay Period">
                {selectedMonth.format("MMMM YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[detailModal.status]}>
                  {detailModal.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Basic Salary">
                {formatCurrency(detailModal.basic_salary)}
              </Descriptions.Item>
              <Descriptions.Item label="Allowances">
                <Text style={{ color: "#52c41a" }}>
                  + {formatCurrency(detailModal.allowances)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Deductions">
                <Text style={{ color: "#ff4d4f" }}>
                  - {formatCurrency(detailModal.deductions)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Net Salary">
                <Title level={4} style={{ margin: 0, color: "#0EA5E9" }}>
                  {formatCurrency(detailModal.net_salary)}
                </Title>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
}
