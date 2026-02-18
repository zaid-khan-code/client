import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2, Download } from "lucide-react";
import { getEmployees, deleteEmployee } from "../../api/employeeApi";

const { Title } = Typography;

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
      });
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      const total = res.data?.total || data.length;
      setEmployees(data);
      setPagination((prev) => ({ ...prev, total }));
    } catch (err) {
      message.error("Failed to fetch employees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      message.success("Employee deleted successfully");
      fetchEmployees();
    } catch {
      message.error("Failed to delete employee");
    }
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
      sorter: (a, b) => a.employee_id?.localeCompare(b.employee_id),
      render: (text) => (
        <Tag color="blue" style={{ fontWeight: 600 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Father's Name",
      dataIndex: "father_name",
      key: "father_name",
    },
    {
      title: "CNIC",
      dataIndex: "cnic",
      key: "cnic",
      render: (text) => <span style={{ fontFamily: "monospace" }}>{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("en-PK") : "—",
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<Eye size={16} />}
              onClick={() =>
                navigate(`/employees/${record.employee_id || record.id}`)
              }
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<Pencil size={16} />}
              onClick={() =>
                navigate(`/employees/edit/${record.employee_id || record.id}`)
              }
            />
          </Tooltip>
          <Popconfirm
            title="Delete Employee"
            description="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record.employee_id || record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                danger
                icon={<Trash2 size={16} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Employees
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate("/employees/add")}
            size="large"
          >
            Add Employee
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Row
          gutter={[16, 16]}
          style={{ marginBottom: 16 }}
          justify="space-between"
        >
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by name, ID, or CNIC..."
              prefix={<Search size={16} color="#bfbfbf" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col>
            <Space>
              <Button icon={<Search size={14} />} onClick={handleSearch}>
                Search
              </Button>
              <Button icon={<Download size={14} />}>Export</Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          rowKey={(record) => record.employee_id || record.id}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} employees`,
            pageSizeOptions: ["10", "25", "50", "100"],
            onChange: (page, pageSize) =>
              setPagination({ ...pagination, current: page, pageSize }),
          }}
          scroll={{ x: 800 }}
          size="middle"
        />
      </Card>
    </div>
  );
}
