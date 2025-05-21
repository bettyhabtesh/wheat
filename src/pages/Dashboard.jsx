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
} from "recharts";
import { fetchUserStats } from "../services/authService";
import "../App.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchAverageRating } from "../services/authService"; 
import { IconStarFilled } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";


// Icons for stats
const icons = {
  "Total Users": IconUsers,
  Farmers: IconPlant,
  Researchers: IconFileSearch,
  Experts: IconCheck,
};

// Colors for Pie Chart
const COLORS = ["#006400", "#90EE90", "#579357"]; 

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const navigate = useNavigate(); 

 useEffect(() => {
  const loadStats = async () => {
    try {
      const [userStats, rating] = await Promise.all([
        fetchUserStats(),
        fetchAverageRating(),
      ]);
      setStats(userStats);
      setAverageRating(rating?.average_rating || 0);
    } catch (err) {
      showNotification({
        title: "Error",
        message: "Failed to load dashboard data.",
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
      color: "#006400", 
      icon: "Total Users",
    },
    {
      label: "Farmers",
      stats: farmers,
      color: "#006400",
      icon: "Farmers",
    },
    {
      label: "Researchers",
      stats: researchers,
      color: "#FFA500", 
      icon: "Researchers",
    },
    {
      label: "Experts",
      stats: experts,
      color: "#1E90FF", 
      icon: "Experts",
    },
  ];
  

  const userDistribution = [
    { name: "Farmers", value: farmers },
    { name: "Researchers", value: researchers },
    { name: "Experts", value: experts },
  ];

  return (
    <Container size="xl" py="lg" className="container">
      <Title order={2} className="dashboard-title">Dashboard</Title>

      <SimpleGrid cols={4} spacing="lg" className="stats-grid">
        {statCards.map((stat) => {
          const IconComponent = icons[stat.icon];
          return (
            <Paper key={stat.label} withBorder radius="md" p="md" className="stat-card">
  <div> <Center>
    
    <div className="icon-background">
      <IconComponent size={24} stroke={2} color="#006400" />
    </div>
  </Center>
  <Text align="center" className="stat-label">{stat.label}</Text>
  <Text align="center" className="stat-value" style={{ color: "#006400" }}>
    {stat.stats}
  </Text>
  </div>
</Paper>

          
          );
        })}
      </SimpleGrid>

      <Divider my="xl" />

      <SimpleGrid cols={2} spacing="lg" className="charts-grid">
        <Card className="chart-card">
          <Title order={3} align="center">User Breakdown</Title>
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

       <Card className="chart-card" withBorder radius="md" p="md">
          <Title order={3} align="center" mb="sm">
            Overall Rating
          </Title>
          <Center style={{ flexDirection: "column", minHeight: 200 }}>
            {averageRating ? (
              <>
                <Group spacing="xs" className="feedback-stars">
  {Array.from({ length: 5 }, (_, i) => (
    <IconStarFilled
      key={i}
      color={i < Math.round(averageRating) ? "#FFD700" : "#D3D3D3"}
    />
  ))}
</Group>
<Text className="feedback-rating">
  {averageRating.toFixed(1)} / 5.0
</Text>
<Button
  className="feedback-button"
  onClick={() => navigate("/feedback")}
>
  See Details
</Button>

              </>
            ) : (
              <Text size="sm" color="dimmed">
                No rating available
              </Text>
            )}
          </Center>
        </Card>

      </SimpleGrid>
    </Container>
  );
};

export default Dashboard;