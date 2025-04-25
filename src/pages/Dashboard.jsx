import React, { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Paper,
  SimpleGrid,
  Center,
  Group,
  Card,
  Divider,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconUsers,
  IconPlant,
  IconFileSearch,
  IconCheck,
} from "@tabler/icons-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { fetchUserStats } from "../services/authService";
import "../App.css";
import LoadingSpinner from "../components/LoadingSpinner";

// Icons for stats
const icons = {
  "Total Users": IconUsers,
  Farmers: IconPlant,
  Researchers: IconFileSearch,
  Experts: IconCheck,
};

// Colors for Pie Chart
const COLORS = ["#4caf50", "#ff9800", "#2196f3"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchUserStats();
        setStats(data);
      } catch (err) {
        showNotification({
          title: "Error",
          message: "Failed to load user statistics.",
          color: "red",
        });
      }
    };
    loadStats();
  }, []);

  if (!stats) {
    return <LoadingSpinner />;
  }
  
  

  const totalUsers = stats.total_users || 0;
  const farmers = stats.role_counts?.farmer || 0;
  const researchers = stats.role_counts?.researcher || 0;
  const experts = stats.role_counts?.expert || 0; 
  

  const statCards = [
    {
      label: "Total Users",
      stats: totalUsers,
      color: "blue",
      icon: "Total Users",
    },
    {
      label: "Farmers",
      stats: farmers,
      color: "teal",
      icon: "Farmers",
    },
    {
      label: "Researchers",
      stats: researchers,
      color: "yellow",
      icon: "Researchers",
    },
    {
      label: "Experts",
      stats: experts,
      color: "red",
      icon: "Experts",
    },
  ];

  const userDistribution = [
    { name: "Farmers", value: farmers },
    { name: "Researchers", value: researchers },
    { name: "Experts", value: experts },
  ];

  const barData = [
    { name: "Farmers", count: farmers },
    { name: "Researchers", count: researchers },
    { name: "Experts", count: experts },
  ];

  return (
    <Container size="xl" py="lg" className="container">
      <Title order={2} className="dashboard-title">Dashboard</Title>

      <SimpleGrid cols={4} spacing="lg" className="stats-grid">
        {statCards.map((stat) => {
          const IconComponent = icons[stat.icon];
          return (
            <Paper key={stat.label} withBorder radius="md" p="md" className="stat-card">
              <Center>
                <IconComponent size={40} stroke={2} color={stat.color} />
              </Center>
              <Text align="center" mt={10}>{stat.label}</Text>
              <Text align="center" style={{ color: stat.color, fontSize: 32, fontWeight: "bold" }}>
                {stat.stats}
              </Text>
            </Paper>
          );
        })}
      </SimpleGrid>

      <Divider my="xl" />

      <SimpleGrid cols={2} spacing="lg" className="charts-grid">
        <Card className="chart-card">
          <Title order={3} align="center">User Distribution</Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
                dataKey="value"
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="chart-card">
          <Title order={3} align="center">User Breakdown</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default Dashboard;
