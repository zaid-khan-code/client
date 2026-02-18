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
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import {
  getJobStatuses,
  createJobStatus,
  updateJobStatus,
  deleteJobStatus,
} from "../../api/settingsApi";

const { Title } = Typography;

export default function JobStatuses() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getJobStatuses();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setStatuses(data);
    } catch {
      setStatuses([
        { id: 1, status_name: "Active" },
        { id: 2, status_name: "On Leave" },
        { id: 3, status_name: "Resigned" },
        { id: 4, status_name: "Terminated" },
        { id: 5, status_name: "Probation" },
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
    form.setFieldsValue({ status_name: record.status_name });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteJobStatus(id);
      message.success("Job status deleted");
      fetchData();
    } catch {
      message.error("Failed to delete");
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateJobStatus(editingRecord.id, values);
        message.success("Job status updated");
      } else {
        await createJobStatus(values);
        message.success("Job status created");
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

  const statusColorMap = {
    Active: "green",
    "On Leave": "orange",
    Resigned: "red",
    Terminated: "volcano",
    Probation: "blue",
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Status Name",
      dataIndex: "status_name",
      key: "status_name",
      sorter: (a, b) => a.status_name.localeCompare(b.status_name),
      render: (text) => (
        <Tag color={statusColorMap[text] || "default"}>{text}</Tag>
      ),
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
            title="Delete this job status?"
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
            <ShieldCheck size={24} color="#0EA5E9" />
            <Title level={3} style={{ margin: 0 }}>
              Job Statuses
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
            Add Status
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Table
          columns={columns}
          dataSource={statuses}
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
                background: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f59e0b",
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {editingRecord ? "Edit Job Status" : "New Job Status"}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>
                {editingRecord
                  ? "Update job status details"
                  : "Add a new job status category"}
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
            label="Status Name"
            name="status_name"
            rules={[
              { required: true, message: "Status name is required" },
              { max: 50, message: "Max 50 characters" },
            ]}
          >
            <Input
              prefix={<ShieldCheck size={15} style={{ color: "#94a3b8" }} />}
              placeholder="e.g., Active, On Leave, Probation"
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
                {editingRecord ? "Update Status" : "Create Status"}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
