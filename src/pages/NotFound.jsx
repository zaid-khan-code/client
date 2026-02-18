import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

const { Title, Text } = Typography;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        <SearchX size={56} color="#0EA5E9" strokeWidth={1.5} />
      </div>

      <Title
        level={1}
        style={{
          fontSize: 72,
          fontWeight: 800,
          margin: 0,
          background: "linear-gradient(135deg, #0EA5E9, #0284c7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </Title>

      <Title level={3} style={{ margin: "8px 0 12px", fontWeight: 600 }}>
        Page Not Found
      </Title>

      <Text
        type="secondary"
        style={{ fontSize: 16, maxWidth: 420, marginBottom: 32 }}
      >
        The page you're looking for doesn't exist or has been moved. Let's get
        you back on track.
      </Text>

      <Button
        type="primary"
        size="large"
        icon={<Home size={18} />}
        onClick={() => navigate("/")}
        style={{
          height: 48,
          paddingInline: 32,
          borderRadius: 12,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
