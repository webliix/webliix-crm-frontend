import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { useNavigate } from "react-router-dom";

export function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardHeader
        avatar={<BoltOutlinedIcon color="primary" />}
        title={<Typography variant="subtitle1" fontWeight="bold">Quick Actions</Typography>}
        subheader="Workflow shortcuts & instant generation"
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ pt: 2.5 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/leads/create")}
            sx={{ fontWeight: "bold" }}
          >
            Create Lead
          </Button>

          <Button
            variant="outlined"
            startIcon={<BusinessOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/customers")}
            sx={{ fontWeight: "bold" }}
          >
            Customer Hub
          </Button>

          <Button
            variant="outlined"
            startIcon={<AddTaskOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/projects")}
            sx={{ fontWeight: "bold" }}
          >
            Initiate Project
          </Button>

          <Button
            variant="outlined"
            startIcon={<ReceiptOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/invoices")}
            sx={{ fontWeight: "bold" }}
          >
            Invoices & Billing
          </Button>

          <Button
            variant="outlined"
            startIcon={<ReceiptOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/expenses")}
            sx={{ fontWeight: "bold" }}
          >
            Manage Expenses
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
