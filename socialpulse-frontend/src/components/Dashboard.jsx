import React, { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, VStack, Button, HStack, Text, Spinner, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/");
  }, [navigate, token]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/analytics", {
          headers: {
            Authorization: `Bearer ${token}`, // pass JWT in headers
          },
        });
        setAnalytics(response.data); // assuming backend returns an array like mockData
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        toast({
          title: "Failed to fetch analytics",
          description: error.response?.data?.message || error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token, toast]);

  const labels = analytics.map((a) => a.date);
  const likesData = analytics.map((a) => a.likes);
  const commentsData = analytics.map((a) => a.comments);
  const sharesData = analytics.map((a) => a.shares);

  const engagementData = {
    labels,
    datasets: [
      {
        label: "Likes",
        data: likesData,
        borderColor: "#4f46e5",
        backgroundColor: "#4f46e580",
        tension: 0.3,
      },
      {
        label: "Comments",
        data: commentsData,
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b80",
        tension: 0.3,
      },
      {
        label: "Shares",
        data: sharesData,
        borderColor: "#10b981",
        backgroundColor: "#10b98180",
        tension: 0.3,
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <Box p={6} minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        <HStack justifyContent="space-between">
          <Box>
            <Heading size="lg">SocialPulse Analytics Dashboard</Heading>
            {user && <Text>Welcome, {user.name}!</Text>}
          </Box>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box bg="white" p={6} rounded="xl" shadow="md" height="350px">
            <Heading size="md" mb={4}>
              Engagement Overview
            </Heading>
            <Line data={engagementData} options={{ maintainAspectRatio: false }} />
          </Box>

          <Box bg="white" p={6} rounded="xl" shadow="md" height="350px">
            <Heading size="md" mb={4}>
              Likes Breakdown
            </Heading>
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: "Likes per Post",
                    data: likesData,
                    backgroundColor: "#4f46e5",
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default Dashboard;
