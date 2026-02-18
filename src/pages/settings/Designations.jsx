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
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
} from "../../api/settingsApi";

const { Title } = Typography;

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDesignations();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setDesignations(data);
    } catch {
      setDesignations([
        { id: 1, title: "Software Engineer" },
        { id: 2, title: "Senior Software Engineer" },
        { id: 3, title: "Team Lead" },
        { id: 4, title: "Project Manager" },
        { id: 5, title: "HR Executive" },
        { id: 6, title: "Accountant" },
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
    form.setFieldsValue({ title: record.title });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDesignation(id);
      message.success("Designation deleted");
      fetchData();
    } catch {
      message.error("Failed to delete designation");
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateDesignation(editingRecord.id, values);
        message.success("Designation updated");
      } else {
        await createDesignation(values);
        message.success("Designation created");
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
      title: "Designation Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
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
            title="Delete this designation?"
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
            <Award size={24} color="#0EA5E9" />
            <Title level={3} style={{ margin: 0 }}>
              Designations
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
            Add Designation
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Table
          columns={columns}
          dataSource={designations}
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
                background: "#f3e8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b5cf6",
              }}
            >
              <Award size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {editingRecord ? "Edit Designation" : "New Designation"}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>
                {editingRecord
                  ? "Update designation details"
                  : "Add a new job designation"}
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
            label="Designation Title"
            name="title"
            rules={[
              { required: true, message: "Designation title is required" },
              { max: 50, message: "Max 50 characters" },
            ]}
          >
            <Input
              prefix={<Award size={15} style={{ color: "#94a3b8" }} />}
              placeholder="e.g., Software Engineer, Team Lead"
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
                {editingRecord ? "Update Designation" : "Create Designation"}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
