import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { NavigationItem } from "@/app/navigation/types";
import { NavLink } from "react-router-dom";
import { tokens } from "@/theme/tokens";

interface Props {
  item: NavigationItem;
  onClick?: () => void;
}

export function SidebarMenuItem({ item, onClick }: Props) {
  return (
    <ListItemButton
      component={NavLink}
      to={item.path}
      end={item.path === "/dashboard"}
      onClick={onClick}
      sx={{
        mx: 1.5,
        my: 0.5,
        px: 2,
        py: 1.25,
        borderRadius: tokens.borderRadius.sm,
        color: tokens.colors.secondary[600],
        transition: tokens.transitions.fast,
        "&:hover": {
          backgroundColor: tokens.colors.secondary[100],
          color: tokens.colors.secondary[900],
        },
        "&.active": {
          backgroundColor: tokens.colors.primary[50],
          color: tokens.colors.primary.main,
          fontWeight: 700,
          "& .MuiListItemIcon-root": {
            color: tokens.colors.primary.main,
          },
          "& .MuiTypography-root": {
            fontWeight: 700,
          },
        },
      }}
    >
      {item.icon ? (
        <ListItemIcon
          sx={{
            minWidth: 36,
            color: "inherit",
            "& svg": { fontSize: 20 },
          }}
        >
          {item.icon}
        </ListItemIcon>
      ) : null}
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      />
    </ListItemButton>
  );
}
