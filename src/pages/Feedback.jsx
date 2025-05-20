import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Container, Title, Pagination } from "@mantine/core";
import LoadingSpinner from "../components/LoadingSpinner";
import "../App.css";
import { fetchFeedbackList } from "../services/authService";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchFeedbackList();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, []);

  const paginatedFeedbacks = feedbacks.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(feedbacks.length / rowsPerPage);

  if (loading) {
    return (
      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container className="approvals-container">
      <Title order={2} mb="md" className="expert-title">
        Feedbacks
      </Title>

      <TableContainer component={Paper} className="approvals-table">
        <Table>
       <TableHead>
  <TableRow>
    <TableCell>Name</TableCell>
    <TableCell>Rating</TableCell>
    <TableCell>Comment</TableCell>
    <TableCell>AI Accuracy</TableCell>
    <TableCell>Date</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {paginatedFeedbacks.map((fb) => (
    <TableRow key={fb.id}>
      <TableCell>{fb.user_name}</TableCell>
      <TableCell>{fb.rating}</TableCell>
      <TableCell>{fb.comments}</TableCell>
      <TableCell>
        {fb.ai_detection_accuracy ? "Accurate" : "Not Accurate"}
      </TableCell>
      <TableCell>
        {new Date(fb.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>

      <Pagination
        total={totalPages}
        value={page}
        onChange={setPage}
        mt="md"
        size="sm"
        color="blue"
        className="approvals-pagination"
      />
    </Container>
  );
};

export default Feedbacks;