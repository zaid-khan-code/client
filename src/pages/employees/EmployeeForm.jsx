import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Typography,
  message,
  Steps,
  Space,
  Avatar,
  Progress,
  Divider,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  User,
  Phone,
  Briefcase,
  CreditCard,
  MapPin,
  Calendar,
  Building2,
  Award,
  ShieldCheck,
  Hash,
  UserCircle,
  Users as UsersIcon,
  BadgeCheck,
  Landmark,
  Siren,
  CheckCircle,
} from "lucide-react";
import dayjs from "dayjs";
import {
  getEmployeeById,
  createEmployee,
  updateEmployee,
  getExtraEmployeeById,
  createExtraEmployee,
  updateExtraEmployee,
} from "../../api/employeeApi";

const { Title, Text } = Typography;

export default function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [departments] = useState([
    { id: 1, name: "Engineering" },
    { id: 2, name: "HR" },
    { id: 3, name: "Finance" },
    { id: 4, name: "Marketing" },
    { id: 5, name: "Operations" },
    { id: 6, name: "Sales" },
  ]);
  const [designations] = useState([
    { id: 1, title: "Software Engineer" },
    { id: 2, title: "Senior Engineer" },
    { id: 3, title: "Team Lead" },
    { id: 4, title: "Manager" },
    { id: 5, title: "HR Executive" },
  ]);
  const [employmentTypes] = useState([
    { id: 1, type_name: "Full-Time" },
    { id: 2, type_name: "Part-Time" },
    { id: 3, type_name: "Contract" },
    { id: 4, type_name: "Intern" },
  ]);
  const [jobStatuses] = useState([
    { id: 1, status_name: "Active" },
    { id: 2, status_name: "On Leave" },
    { id: 3, status_name: "Resigned" },
    { id: 4, status_name: "Terminated" },
  ]);

  useEffect(() => {
    if (isEdit) fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    setFetching(true);
    try {
      const [empRes, extraRes] = await Promise.allSettled([
        getEmployeeById(id),
        getExtraEmployeeById(id),
      ]);
      const empData = empRes.status === "fulfilled" ? empRes.value.data : {};
      const extraData =
        extraRes.status === "fulfilled" ? extraRes.value.data : {};
      form.setFieldsValue({
        ...empData,
        ...extraData,
        date_of_birth: extraData?.date_of_birth
          ? dayjs(extraData.date_of_birth)
          : null,
        date_of_joining: extraData?.date_of_joining
          ? dayjs(extraData.date_of_joining)
          : null,
        date_of_exit: extraData?.date_of_exit
          ? dayjs(extraData.date_of_exit)
          : null,
      });
    } catch {
      message.error("Failed to fetch employee data");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const employeeData = {
        employee_id: values.employee_id,
        name: values.name,
        father_name: values.father_name,
        cnic: values.cnic,
      };
      const extraData = {
        employee_id: values.employee_id,
        contact_1: values.contact_1,
        contact_2: values.contact_2,
        emergence_contact_1: values.emergence_contact_1,
        emergence_contact_2: values.emergence_contact_2,
        bank_name: values.bank_name,
        bank_acc_num: values.bank_acc_num,
        perment_address: values.perment_address,
        postal_address: values.postal_address,
        date_of_birth: values.date_of_birth?.format("YYYY-MM-DD") ?? null,
      };
      if (isEdit) {
        await Promise.allSettled([
          updateEmployee(id, employeeData),
          updateExtraEmployee(id, extraData),
        ]);
        message.success("Employee updated successfully");
      } else {
        await createEmployee(employeeData);
        try {
          await createExtraEmployee(extraData);
        } catch {
          /* extra info optional */
        }
        message.success("Employee created successfully");
      }
      navigate("/employees");
    } catch (err) {
      message.error(
        isEdit ? "Failed to update employee" : "Failed to create employee",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStep = async () => {
    const stepFields = [
      ["employee_id", "name", "father_name", "cnic", "date_of_birth"],
      ["contact_1"],
      [],
    ];
    try {
      await form.validateFields(stepFields[currentStep]);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = async () => {
    if (await validateCurrentStep()) setCurrentStep(currentStep + 1);
  };

  const steps = [
    {
      title: "Personal",
      description: "Basic details",
      icon: <User size={18} />,
      color: "#0EA5E9",
    },
    {
      title: "Contact & Bank",
      description: "Reach & finance",
      icon: <Phone size={18} />,
      color: "#8b5cf6",
    },
    {
      title: "Job Details",
      description: "Work info",
      icon: <Briefcase size={18} />,
      color: "#22c55e",
    },
  ];

  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  const SectionHeader = ({ icon, title, subtitle, color }) => (
    <div className="form-section-header">
      <div
        className="form-section-icon"
        style={{ background: `${color}15`, color }}
      >
        {icon}
      </div>
      <div>
        <Text
          strong
          style={{ fontSize: 16, display: "block", lineHeight: 1.3 }}
        >
          {title}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {subtitle}
        </Text>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="form-page-header">
        <Space size={16} align="center">
          <Button
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate("/employees")}
            className="form-back-btn"
          />
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
              {isEdit ? "Edit Employee" : "Add New Employee"}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {isEdit
                ? "Update employee information"
                : "Fill in the details to register a new employee"}
            </Text>
          </div>
        </Space>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
            Step {currentStep + 1} of {steps.length}
          </Text>
          <Progress
            percent={progressPercent}
            size="small"
            style={{ width: 120, margin: 0 }}
            strokeColor="#0EA5E9"
            showInfo={false}
          />
        </div>
      </div>

      {/* Steps Card */}
      <Card
        bordered={false}
        bodyStyle={{ padding: "20px 32px" }}
        style={{ marginBottom: 16 }}
      >
        <Steps
          current={currentStep}
          onChange={async (step) => {
            if (step < currentStep) setCurrentStep(step);
            else if (step === currentStep + 1) handleNext();
          }}
          items={steps.map((s, i) => ({
            title: (
              <span style={{ fontWeight: currentStep === i ? 600 : 400 }}>
                {s.title}
              </span>
            ),
            description: <span style={{ fontSize: 11 }}>{s.description}</span>,
            icon: (
              <Avatar
                size={36}
                style={{
                  background: currentStep >= i ? s.color : "#f1f5f9",
                  color: currentStep >= i ? "#fff" : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                {currentStep > i ? <CheckCircle size={18} /> : s.icon}
              </Avatar>
            ),
          }))}
        />
      </Card>

      {/* Form Card */}
      <Card bordered={false} loading={fetching} bodyStyle={{ padding: 32 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          scrollToFirstError
          requiredMark={(label, { required }) => (
            <>
              {label}
              {required && (
                <span style={{ color: "#f43f5e", marginLeft: 4 }}>*</span>
              )}
            </>
          )}
        >
          {/* Step 1 */}
          <div
            className="form-step"
            style={{ display: currentStep === 0 ? "block" : "none" }}
          >
            <SectionHeader
              icon={<UserCircle size={20} />}
              title="Personal Information"
              subtitle="Employee identity and basic details"
              color="#0EA5E9"
            />
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Employee ID"
                  name="employee_id"
                  rules={[
                    { required: true, message: "Employee ID is required" },
                    { max: 10, message: "Max 10 characters" },
                  ]}
                  tooltip="Unique identifier for the employee"
                >
                  <Input
                    prefix={<Hash size={15} style={{ color: "#94a3b8" }} />}
                    placeholder="e.g., EMP001"
                    disabled={isEdit}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: "Name is required" }]}
                >
                  <Input
                    prefix={<User size={15} style={{ color: "#94a3b8" }} />}
                    placeholder="Enter full name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Father's Name"
                  name="father_name"
                  rules={[
                    { required: true, message: "Father's name is required" },
                  ]}
                >
                  <Input
                    prefix={
                      <UsersIcon size={15} style={{ color: "#94a3b8" }} />
                    }
                    placeholder="Enter father's name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="CNIC Number"
                  name="cnic"
                  rules={[
                    { required: true, message: "CNIC is required" },
                    {
                      pattern: /^\d{5}-\d{7}-\d$/,
                      message: "Format: 12345-1234567-1",
                    },
                  ]}
                  tooltip="National Identity Card Number"
                >
                  <Input
                    prefix={
                      <CreditCard size={15} style={{ color: "#94a3b8" }} />
                    }
                    placeholder="12345-1234567-1"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Date of Birth"
                  name="date_of_birth"
                  rules={[
                    { required: true, message: "Date of birth is required" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select date of birth"
                    format="DD/MM/YYYY"
                    suffixIcon={<Calendar size={15} color="#94a3b8" />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Step 2 */}
          <div
            className="form-step"
            style={{ display: currentStep === 1 ? "block" : "none" }}
          >
            <SectionHeader
              icon={<Phone size={20} />}
              title="Contact Information"
              subtitle="Phone numbers and emergency contacts"
              color="#8b5cf6"
            />
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Primary Contact"
                  name="contact_1"
                  rules={[
                    { required: true, message: "Contact number is required" },
                  ]}
                >
                  <Input
                    prefix={<Phone size={15} style={{ color: "#94a3b8" }} />}
                    placeholder="03XX-XXXXXXX"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Secondary Contact" name="contact_2">
                  <Input
                    prefix={<Phone size={15} style={{ color: "#94a3b8" }} />}
                    placeholder="Optional"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Emergency Contact 1"
                  name="emergence_contact_1"
                >
                  <Input
                    prefix={<Siren size={15} style={{ color: "#94a3b8" }} />}
                    placeholder="Emergency number"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Emergency Contact 2"
                  name="emergence_contact_2"
                >
                  <Input
                    prefix={<Siren size={15} style={{ color: "#94a3b8" }} />}
                    placeholder="Optional"
                  />
                </Form.Item>
              </Col>
            </Row>

            <SectionHeader
              icon={<Landmark size={20} />}
              title="Bank Details"
              subtitle="Salary account information"
              color="#f59e0b"
            />
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Bank Name" name="bank_name">
                  <Input
                    prefix={<Landmark size={15} style={{ color: "#94a3b8" }} />}
                    placeholder="e.g., HBL, MCB, UBL"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Account Number" name="bank_acc_num">
                  <Input
                    prefix={
                      <CreditCard size={15} style={{ color: "#94a3b8" }} />
                    }
                    placeholder="Account number"
                  />
                </Form.Item>
              </Col>
            </Row>

            <SectionHeader
              icon={<MapPin size={20} />}
              title="Address"
              subtitle="Residential and postal address"
              color="#22c55e"
            />
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item label="Permanent Address" name="perment_address">
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter permanent residential address"
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Postal Address" name="postal_address">
                  <Input.TextArea
                    rows={3}
                    placeholder="Postal/mailing address"
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Step 3 */}
          <div
            className="form-step"
            style={{ display: currentStep === 2 ? "block" : "none" }}
          >
            <SectionHeader
              icon={<BadgeCheck size={20} />}
              title="Job Information"
              subtitle="Department, designation, and employment details"
              color="#22c55e"
            />
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Department" name="department_id">
                  <Select
                    placeholder="Select department"
                    suffixIcon={<Building2 size={15} color="#94a3b8" />}
                    showSearch
                    optionFilterProp="children"
                  >
                    {departments.map((d) => (
                      <Select.Option key={d.id} value={d.id}>
                        {d.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Designation" name="designation_id">
                  <Select
                    placeholder="Select designation"
                    suffixIcon={<Award size={15} color="#94a3b8" />}
                    showSearch
                    optionFilterProp="children"
                  >
                    {designations.map((d) => (
                      <Select.Option key={d.id} value={d.id}>
                        {d.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Employment Type" name="employment_type_id">
                  <Select
                    placeholder="Select type"
                    suffixIcon={<Briefcase size={15} color="#94a3b8" />}
                  >
                    {employmentTypes.map((t) => (
                      <Select.Option key={t.id} value={t.id}>
                        {t.type_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Job Status" name="job_status_id">
                  <Select
                    placeholder="Select status"
                    suffixIcon={<ShieldCheck size={15} color="#94a3b8" />}
                  >
                    {jobStatuses.map((s) => (
                      <Select.Option key={s.id} value={s.id}>
                        {s.status_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Date of Joining" name="date_of_joining">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select joining date"
                    format="DD/MM/YYYY"
                    suffixIcon={<Calendar size={15} color="#94a3b8" />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Date of Exit" name="date_of_exit">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select exit date (if any)"
                    format="DD/MM/YYYY"
                    suffixIcon={<Calendar size={15} color="#94a3b8" />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Navigation */}
          <Divider style={{ margin: "28px 0 20px" }} />
          <Row justify="space-between" align="middle">
            <Col>
              {currentStep > 0 && (
                <Button
                  size="large"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  icon={<ArrowLeft size={16} />}
                  className="form-nav-btn"
                >
                  Previous
                </Button>
              )}
            </Col>
            <Col>
              <Space size={12}>
                <Button
                  onClick={() => navigate("/employees")}
                  className="form-nav-btn"
                >
                  Cancel
                </Button>
                {currentStep < 2 ? (
                  <Button
                    type="primary"
                    onClick={handleNext}
                    className="form-nav-btn form-continue-btn"
                  >
                    Continue
                    <ArrowRight size={16} style={{ marginLeft: 6 }} />
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<Save size={16} />}
                    className="form-nav-btn form-save-btn"
                  >
                    {isEdit ? "Update Employee" : "Save Employee"}
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
