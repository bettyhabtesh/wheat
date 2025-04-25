import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Container, Title, Badge, Pagination } from "@mantine/core";
import "../App.css";
import {
  fetchApprovalRequests,
  approveExpertRequest,
  rejectExpertRequest,
} from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";

const Approvals = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const rowsPerPage = 8;

  useEffect(() => {
    const getExperts = async () => {
      try {
        const data = await fetchApprovalRequests();
        setExperts(data);
      } catch (error) {
        console.error("Failed to load expert approvals");
      } finally {
        setLoading(false);
      }
    };
    getExperts();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveExpertRequest(id);
      setExperts((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: "approved", is_approved: true } : e
        )
      );
    } catch (error) {
      alert("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectExpertRequest(id);
      setExperts((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      alert("Rejection failed");
    }
  };

  const totalPages = Math.ceil(experts.length / rowsPerPage);
  const paginatedExperts = experts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) {
    return (
      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <LoadingSpinner />  {/* Using the custom loading spinner */}
      </Container>
    );
  }

  return (
    <Container className="approvals-container">
      <Title order={2} mb="md" className="expert-title">Expert Approvals</Title>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Document</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedExperts.map((expert) => (
              <TableRow key={expert.id}>
                <TableCell>{expert.user_name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/view-certificate/${expert.id}`)}
                  >
                    View Certificate
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge color={expert.is_approved ? "green" : "gray"}>
                    {expert.is_approved ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {expert.is_approved === false && (
                    <div className="action-buttons">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(expert.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(expert.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
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
      />
    </Container>
  );
};

export default Approvals;
