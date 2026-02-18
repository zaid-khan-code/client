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
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import {
  getEmploymentTypes,
  createEmploymentType,
  updateEmploymentType,
  deleteEmploymentType,
} from "../../api/settingsApi";

const { Title } = Typography;

export default function EmploymentTypes() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getEmploymentTypes();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setTypes(data);
    } catch {
      setTypes([
        { id: 1, type_name: "Full-Time" },
        { id: 2, type_name: "Part-Time" },
        { id: 3, type_name: "Contract" },
        { id: 4, type_name: "Intern" },
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
    form.setFieldsValue({ type_name: record.type_name });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmploymentType(id);
      message.success("Employment type deleted");
      fetchData();
    } catch {
      message.error("Failed to delete");
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateEmploymentType(editingRecord.id, values);
        message.success("Employment type updated");
      } else {
        await createEmploymentType(values);
        message.success("Employment type created");
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
      title: "Employment Type",
      dataIndex: "type_name",
      key: "type_name",
      sorter: (a, b) => a.type_name.localeCompare(b.type_name),
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
            title="Delete this employment type?"
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
            <Briefcase size={24} color="#0EA5E9" />
            <Title level={3} style={{ margin: 0 }}>
              Employment Types
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
            Add Type
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Table
          columns={columns}
          dataSource={types}
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
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22c55e",
              }}
            >
              <Briefcase size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {editingRecord ? "Edit Employment Type" : "New Employment Type"}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>
                {editingRecord
                  ? "Update employment type details"
                  : "Add a new employment type"}
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
            label="Type Name"
            name="type_name"
            rules={[
              { required: true, message: "Type name is required" },
              { max: 50, message: "Max 50 characters" },
            ]}
          >
            <Input
              prefix={<Briefcase size={15} style={{ color: "#94a3b8" }} />}
              placeholder="e.g., Full-Time, Part-Time, Contract"
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
                {editingRecord ? "Update Type" : "Create Type"}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
