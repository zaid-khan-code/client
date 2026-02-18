import { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Typography,
  Tag,
  Button,
  Row,
  Col,
  Spin,
  Space,
  Tabs,
  message,
  Empty,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, User, Phone, Briefcase } from "lucide-react";
import { getEmployeeById, getExtraEmployeeById } from "../../api/employeeApi";

const { Title, Text } = Typography;

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [extraInfo, setExtraInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [empRes, extraRes] = await Promise.allSettled([
          getEmployeeById(id),
          getExtraEmployeeById(id),
        ]);

        if (empRes.status === "fulfilled") {
          const data = empRes.value.data?.data || empRes.value.data;
          setEmployee(data);
        }
        if (extraRes.status === "fulfilled") {
          const data = extraRes.value.data?.data || extraRes.value.data;
          setExtraInfo(data);
        }
      } catch {
        message.error("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div>
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate("/employees")}
          style={{ marginBottom: 16 }}
        >
          Back
        </Button>
        <Empty description="Employee not found" />
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tabItems = [
    {
      key: "basic",
      label: (
        <Space>
          <User size={16} /> Basic Info
        </Space>
      ),
      children: (
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
          <Descriptions.Item label="Employee ID">
            <Tag color="blue" style={{ fontWeight: 600 }}>
              {employee.employee_id}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Full Name">
            {employee.name}
          </Descriptions.Item>
          <Descriptions.Item label="Father's Name">
            {employee.father_name}
          </Descriptions.Item>
          <Descriptions.Item label="CNIC">
            <Text code>{employee.cnic}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {formatDate(extraInfo?.date_of_birth)}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatDate(employee.created_at)}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "contact",
      label: (
        <Space>
          <Phone size={16} /> Contact & Bank
        </Space>
      ),
      children: extraInfo ? (
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
          <Descriptions.Item label="Contact 1">
            {extraInfo.contact_1 || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Contact 2">
            {extraInfo.contact_2 || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Emergency Contact 1">
            {extraInfo.emergence_contact_1 || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Emergency Contact 2">
            {extraInfo.emergence_contact_2 || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Bank Name">
            {extraInfo.bank_name || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Account Number">
            {extraInfo.bank_acc_num || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Permanent Address" span={3}>
            {extraInfo.perment_address || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Postal Address" span={3}>
            {extraInfo.postal_address || "—"}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty description="No extra information available" />
      ),
    },
    {
      key: "job",
      label: (
        <Space>
          <Briefcase size={16} /> Job Info
        </Space>
      ),
      children: (
        <Empty description="Job information will display once job_info API is available" />
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Button
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate("/employees")}
            >
              Back
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Employee Details
            </Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<Pencil size={16} />}
            onClick={() => navigate(`/employees/edit/${id}`)}
          >
            Edit Employee
          </Button>
        </Col>
      </Row>

      {/* Profile Header */}
      <Card bordered={false} style={{ borderRadius: 8, marginBottom: 24 }}>
        <Row align="middle" gutter={24}>
          <Col>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#e6f4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                color: "#0EA5E9",
              }}
            >
              {employee.name?.charAt(0)?.toUpperCase()}
            </div>
          </Col>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              {employee.name}
            </Title>
            <Text type="secondary">
              ID: {employee.employee_id} &nbsp;|&nbsp; CNIC: {employee.cnic}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Tabs items={tabItems} defaultActiveKey="basic" />
      </Card>
    </div>
  );
}
