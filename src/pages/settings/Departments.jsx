import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Tooltip,
} from "antd";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/settingsApi";

const { Title } = Typography;

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDepartments();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setDepartments(data);
    } catch {
      // Use mock data if API not available
      setDepartments([
        { id: 1, name: "Engineering" },
        { id: 2, name: "Human Resources" },
        { id: 3, name: "Finance" },
        { id: 4, name: "Marketing" },
        { id: 5, name: "Operations" },
        { id: 6, name: "Sales" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({ name: record.name });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      message.success("Department deleted");
      fetchData();
    } catch {
      message.error("Failed to delete department");
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateDepartment(editingRecord.id, values);
        message.success("Department updated");
      } else {
        await createDepartment(values);
        message.success("Department created");
      }
      setModalOpen(false);
      form.resetFields();
      fetchData();
    } catch {
      message.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<Pencil size={16} />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this department?"
            onConfirm={() => handleDelete(record.id)}
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
          <Space>
            <Building2 size={24} color="#0EA5E9" />
            <Title level={3} style={{ margin: 0 }}>
              Departments
            </Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleAdd}
            size="large"
          >
            Add Department
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Table
          columns={columns}
          dataSource={departments}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          size="middle"
        />
      </Card>

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
              <Building2 size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {editingRecord ? "Edit Department" : "New Department"}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>
                {editingRecord
                  ? "Update department details"
                  : "Add a new department to the organization"}
              </div>
            </div>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        width={460}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
          size="large"
        >
          <Form.Item
            label="Department Name"
            name="name"
            rules={[
              { required: true, message: "Department name is required" },
              { max: 50, message: "Max 50 characters" },
            ]}
          >
            <Input
              prefix={<Building2 size={15} style={{ color: "#94a3b8" }} />}
              placeholder="e.g., Engineering, Marketing"
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
                loading={submitting}
                style={{
                  borderRadius: 8,
                  height: 40,
                  paddingInline: 24,
                  fontWeight: 600,
                }}
              >
                {editingRecord ? "Update Department" : "Create Department"}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
