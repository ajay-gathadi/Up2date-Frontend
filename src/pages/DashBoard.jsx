import {Alert, Box, Card, CardContent, Container, Grid, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import {Error} from "@mui/icons-material";

function DashBoard() {
    const [totalBusiness, setTotalBusiness] = useState(0);
    const [cashCollected, setCashCollected] = useState(0);
    const [onlineCollected, setOnlineCollected] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTotalBusiness = async () => {
        try {

            const response = await fetch("/dashboard/total-business-forDate");
            if (!response.ok) {
                throw new Error(
                    `HTTP error! status: ${response.status} - ${await response.text}`
                );
            }
            const data = await response.json();
            console.log("Total Business amount: ", data);
            setTotalBusiness(data);
        } catch (e) {
            console.error("Error fetching total business:", e);
            setError(e.message);
        }
    };

    const fetchCashCollected = async () => {
        try {
            const response = await fetch("/dashboard/cash-collected-forDate")
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error fetching cash collected:", errorText);
                console.error("Cash Collected Response Status:", response.status);
                throw new Error(`HTTP Error! status: ${response.status} - ${await response.text()}`);
            }
            const responseText = await response.text();
            console.log("Cash Collected Response Text:", responseText);

            let data;
            try {
                data = JSON.parse(responseText);
                console.log("Cash Collected Parsed JSON:", data);
            } catch (parseError) {
                console.error("Failed to parse JSON response:", parseError, " trying as nummber...");
                data = parseFloat(responseText) || 0;
                console.log("Cash Collected Parsed as Number:", data);
            }

            // const data = await response.json();
            // console.log("Cash Collected Data:", data);
            setCashCollected(data);
        } catch (e) {
            console.error("Error fetching cash collected:", e);
            throw e;
        }
    };

    const fetchOnlineCollected = async () => {
        try {
            const response = await fetch("/dashboard/online-collected-forDate");
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error fetching online collected:", errorText);
                console.error("Online Collected Response Status:", response.status);
                console.error(
                    "Online Collected Response Text: ",
                    await response.text()
                )
                throw new Error(`HTTP Error! status: ${response.status} - ${await response.text()}`);
            }

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
                console.log("Online Collected Parsed JSON:", data);
            } catch (parseError) {
                console.log("Failed to parse as JSON, trying as number...", parseError);
                data = parseFloat(responseText) || 0;
                console.log("Online Collected Parsed Number:", data);
            }

            // const data = await response.json();
            // console.log("Online Collected Data:", data);
            setOnlineCollected(data);
        } catch (e) {
            console.error("Error fetching online collected:", e);
            throw e;
        }
    };
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError(null);

                await Promise.all([
                    fetchTotalBusiness(),
                    fetchCashCollected(),
                    fetchOnlineCollected()
                ]);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAllData();
    }, []);

    const DashboardCard = ({title, amount, color = "rgba(243,203,69)"}) => (
        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flexGrow: 1}}>
                <Typography sx={{fontFamily: 'Inter', fontSize: 20, whiteSpace: 'nowrap'}} color="black" gutterBottom>
                    {title}
                </Typography>
                {loading && (
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100}}>
                        0 ₹
                    </Box>
                )}
                {error && (
                    <Alert severity={'error'} sx={{mt: 2}}>
                        Error fetching data: {error}
                    </Alert>
                )}
                {
                    !loading && !error && (
                        <Typography variant={'h4'} component={'div'} sx={{fontWeight: 'bold', color: color}}>
                            {amount.toLocaleString("en-IN")} ₹
                        </Typography>
                    )
                }
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', mt: 0}}>
            <Typography sx={{
                position: 'fixed',
                top: 30,
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                zIndex: 1000,
                fontWeight: 'bold',
                fontSize: 34,
                textAlign: 'center',
                width: '100%',
            }}>
                Dashboard
            </Typography>

            <Container maxWidth="lg" sx={{flex: 1, mb: 4, mt: 8}}>
                <Grid container spacing={3}>
                    <Grid size={{xs: "100%", md: "33.33%", lg: "25%"}}>
                        <DashboardCard title={'Total Business'} amount={totalBusiness} color={'rgba(243,203,69)'}/>
                    </Grid>

                    <Grid size={{xs: 12, md: 4, lg: 4}}>
                        <DashboardCard title={'Cash Collected'} amount={cashCollected} color={'rgba(243,203,69)'}/>
                    </Grid>

                    <Grid size={{xs: 12, md: 4, lg: 4}}>
                        <DashboardCard title={'Online Collected'} amount={onlineCollected} color={'rgba(243,203,69)'}/>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default DashBoard;
