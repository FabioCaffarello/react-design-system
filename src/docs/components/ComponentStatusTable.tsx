import React from "react";

interface ComponentStatusTableProps {
  components: Array<{
    name: string;
    status: string;
    accessibility: string;
    tests: string;
    docs: boolean;
  }>;
}

export function ComponentStatusTable({
  components,
}: ComponentStatusTableProps): React.JSX.Element {
  const getStatusIcon = (status: string): React.JSX.Element | null => {
    switch (status) {
      case "Stable":
        return <span style={{ color: "#10b981", fontSize: "18px" }}>✅</span>;
      case "Beta":
        return <span style={{ color: "#f59e0b", fontSize: "18px" }}>🟡</span>;
      case "Deprecated":
        return <span style={{ color: "#ef4444", fontSize: "18px" }}>🔴</span>;
      case "Experimental":
        return <span style={{ color: "#f59e0b", fontSize: "18px" }}>⚠️</span>;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        overflowX: "auto",
        marginBottom: "32px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontWeight: "600",
                color: "#1f2937",
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Componente
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontWeight: "600",
                color: "#1f2937",
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontWeight: "600",
                color: "#1f2937",
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Acessibilidade
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontWeight: "600",
                color: "#1f2937",
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Testes
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              Documentação
            </th>
          </tr>
        </thead>
        <tbody>
          {components.map((component, index) => (
            <tr
              key={component.name}
              style={{
                borderBottom:
                  index < components.length - 1 ? "1px solid #e5e7eb" : "none",
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
              }}
            >
              <td
                style={{
                  padding: "12px 16px",
                  fontWeight: "500",
                  color: "#1f2937",
                  borderRight: "1px solid #e5e7eb",
                }}
              >
                {component.name}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  color: "#6b7280",
                  borderRight: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {getStatusIcon(component.status)}
                <span>{component.status}</span>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  color: "#6b7280",
                  borderRight: "1px solid #e5e7eb",
                }}
              >
                {component.accessibility}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  color: "#6b7280",
                  borderRight: "1px solid #e5e7eb",
                }}
              >
                {component.tests}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                {component.docs ? (
                  <span style={{ color: "#10b981", fontSize: "18px" }}>✅</span>
                ) : (
                  <span style={{ color: "#ef4444", fontSize: "18px" }}>❌</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
