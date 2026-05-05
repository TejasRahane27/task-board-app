import React, { useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import useApi from "../hooks/useApi";
import { useTheme } from "../context/ThemeContext"; 

import {
  Folder,
  ClipboardList,
  CheckCircle,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const { data, request } = useApi(api.get);
  const { theme } = useTheme(); 

  useEffect(() => {
    request("/dashboard");
  }, []);

  if (!data) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  const status = data.tasksByStatus || {};

  const total =
    (status.todo || 0) +
    (status.inProgress || 0) +
    (status.done || 0);

  return (
    <Layout>
      <div style={container}>
        <h2 style={{ marginBottom: "20px" }}>📊 Dashboard</h2>

        <div style={cardContainer}>
          <Card title="Projects" value={data.totalProjects || 0} color="#6366f1" icon={Folder} />
          <Card title="Tasks" value={data.totalTasks} color="#3b82f6" icon={ClipboardList} />
          <Card title="Completed" value={status.done || 0} color="#22c55e" icon={CheckCircle} />
          <Card title="Overdue" value={data.overdueCount} color="#ef4444" icon={Clock} />
        </div>

        <div style={gridContainer}>

          
          <div
            style={{
              ...sectionCard,
              background: theme === "dark" ? "#1e293b" : "white",
              color: theme === "dark" ? "white" : "black"
            }}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            <h4>Status Breakdown</h4>

            <StatusBar label="Todo" value={status.todo || 0} total={total} color="#3b82f6" theme={theme} />
            <StatusBar label="In Progress" value={status.inProgress || 0} total={total} color="#f59e0b" theme={theme} />
            <StatusBar label="Done" value={status.done || 0} total={total} color="#22c55e" theme={theme} />
          </div>

          
          <div
            style={{
              ...sectionCard,
              background: theme === "dark" ? "#1e293b" : "white",
              color: theme === "dark" ? "white" : "black"
            }}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            <h4>Upcoming Tasks</h4>

            {data.upcomingTasks?.length === 0 ? (
              <p>No upcoming tasks</p>
            ) : (
              data.upcomingTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    ...taskStyle,
                    background: theme === "dark" ? "#334155" : "#f8fafc",
                    color: theme === "dark" ? "white" : "black"
                  }}
                >
                  <b>{t.title}</b>
                  <p>{t.description}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;



const Card = ({ title, value, color, icon: Icon }) => {
  const { theme } = useTheme(); // ✅ ADD

  return (
    <div
      style={{
        ...cardStyle,
        borderTop: `4px solid ${color}`,
        background: theme === "dark"
          ? "#1e293b"
          : "linear-gradient(135deg, #ffffff, #f8fafc)",
        color: theme === "dark" ? "white" : "black"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}
      >
        <Icon size={18} />
        <h5 style={{ margin: 0 }}>{title}</h5>
      </div>

      <h2 style={{ marginTop: "10px" }}>{value}</h2>
    </div>
  );
};



const StatusBar = ({ label, value, total, color, theme }) => {
  return (
    <div style={{ marginBottom: "15px" }}>
      <p style={{
        marginBottom: "5px",
        color: theme === "dark" ? "white" : "black"
      }}>
        {label} ({value})
      </p>

      <div style={progressBg}>
        <div
          style={{
            ...progressFill,
            background: color,
            width: `${total ? (value / total) * 100 : 0}%`
          }}
        />
      </div>
    </div>
  );
};



const hoverIn = (e) => {
  e.currentTarget.style.transform = "translateY(-5px)";
  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)";
};

const hoverOut = (e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
};



const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%"
};

const cardContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px"
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "20px",
  marginTop: "30px"
};

const sectionCard = {
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  transition: "0.3s",
  cursor: "pointer"
};

const cardStyle = {
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "0.3s",
  textAlign: "center"
};

const progressBg = {
  background: "#e5e7eb",
  height: "10px",
  borderRadius: "5px"
};

const progressFill = {
  height: "10px",
  borderRadius: "5px"
};

const taskStyle = {
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  transition: "0.2s"
};