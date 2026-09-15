import { useState, useEffect } from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { tokens } from "@/theme/tokens";

export interface AppSearchInputProps extends Omit<TextFieldProps, "onChange"> {
  onSearchChange?: (value: string) => void;
  debounceMs?: number;
  initialValue?: string;
}

export function AppSearchInput({
  onSearchChange,
  debounceMs = 300,
  initialValue = "",
  placeholder = "Search...",
  sx,
  ...props
}: AppSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearchChange]);

  const handleClear = () => {
    setSearchTerm("");
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <TextField
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: tokens.colors.secondary[400], fontSize: 20 }} />
          </InputAdornment>
        ),
        endAdornment: searchTerm ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear} edge="end">
              <ClearIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: tokens.borderRadius.sm,
          backgroundColor: "#ffffff",
        },
        ...sx,
      }}
      {...props}
    />
  );
}
