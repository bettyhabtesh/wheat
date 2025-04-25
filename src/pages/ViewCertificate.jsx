import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Title, ActionIcon, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import "../App.css";
import { fetchApprovalRequests } from "../services/authService";  
import LoadingSpinner from "../components/LoadingSpinner"; 

const ViewCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificateUrl, setCertificateUrl] = useState("");
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const data = await fetchApprovalRequests();
        const expert = data.find((e) => e.id === parseInt(id)); // find expert by ID
        if (expert) {
          setCertificateUrl(expert.certificate);  // Set the certificate URL
        }
      } catch (error) {
        console.error("Error fetching certificate data:", error);
      } finally {
        setLoading(false);  // Stop loading when done
      }
    };
    fetchCertificate();
  }, [id]);

  return (
    <Container className="view-certificate-container">
      <div className="back-button" onClick={() => navigate("/approvals")}>
        <ActionIcon size="lg" variant="light">
          <IconArrowLeft size={24} />
        </ActionIcon>
      </div>
      <Title order={2} mb="md">View Certificate</Title>

      {loading ? (
        <LoadingSpinner /> 
      ) : certificateUrl ? (
        <iframe
          src={certificateUrl}
          width="100%"
          height="500px"
          title="Certificate"
        />
      ) : (
        <Text>No certificate found.</Text>
      )}
    </Container>
  );
};

export default ViewCertificate;
