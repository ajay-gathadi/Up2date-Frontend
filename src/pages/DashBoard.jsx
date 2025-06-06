import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

function DashBoard() {
  const [totalBusiness, setTotalBusiness] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalBusiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/dashboard/total-business-forDate");
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} - ${await response.text}`
          );
        }
        const data = await response.json();
        console.log(data);

        setTotalBusiness(data);
      } catch (e) {
        console.error("Error fetching total business:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalBusiness();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: "100%", md: "33.33%", lg: "25%" }}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Total Business
              </Typography>
              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Error fetching data: {error}
                </Alert>
              )}
              {!loading && !error && (
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: "bold", color: "success.main" }}
                >
                  {totalBusiness.toLocaleString("en-IN")} INR
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashBoard;
