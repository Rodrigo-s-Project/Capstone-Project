export type COLOR_MODE = "DAY" | "NIGHT";

export type KEY_COLOR =
  | "--white"
  | "--black"
  | "--red-100"
  | "--red-200"
  | "--red-300"
  | "--red-400"
  | "--green-100"
  | "--green-200"
  | "--lavender-100"
  | "--lavender-200"
  | "--lavender-300"
  | "--lavender-400"
  | "--gray-100"
  | "--gray-200"
  | "--gray-300"
  | "--gray-400"
  | "--gray-500"
  | "--gray-600"
  | "--gray-700"
  | "--gray-800"
  | "--gray-900"
  | "--primary";

export const COLORS = {
  "--white": {
    DAY: "#FFF",
    NIGHT: "#000"
  },
  "--black": {
    DAY: "#000",
    NIGHT: "#FFF"
  },
  "--red-100": {
    DAY: "#E9ADAD",
    NIGHT: "#E9ADAD"
  },
  "--red-200": {
    DAY: "#FC5858",
    NIGHT: "#FC5858"
  },
  "--red-300": {
    DAY: "#D12828",
    NIGHT: "#D12828"
  },
  "--red-400": {
    DAY: "#5C1D05",
    NIGHT: "#5C1D05"
  },
  "--green-100": {
    DAY: "#A6D6AA",
    NIGHT: "#A6D6AA"
  },
  "--green-200": {
    DAY: "#26572A",
    NIGHT: "#26572A"
  },
  "--lavender-100": {
    DAY: "#490FEE",
    NIGHT: "#ECEEFF"
  },
  "--lavender-200": {
    DAY: "#4542F7",
    NIGHT: "#CCD4FF"
  },
  "--lavender-300": {
    DAY: "#6562FA",
    NIGHT: "#C4C3FD"
  },
  "--lavender-400": {
    DAY: "#908EFD",
    NIGHT: "#A9A7FE"
  },
  "--gray-100": {
    DAY: "#FFFFFF",
    NIGHT: "#212121"
  },
  "--gray-200": {
    DAY: "#F8FAFC",
    NIGHT: "#262626"
  },
  "--gray-300": {
    DAY: "#E3E8EF",
    NIGHT: "#2B2B2B"
  },
  "--gray-400": {
    DAY: "#E2E8F0",
    NIGHT: "#303030"
  },
  "--gray-500": {
    DAY: "#CBD5E0",
    NIGHT: "#7C7C7C"
  },
  "--gray-600": {
    DAY: "#A0AEC0",
    NIGHT: "#A6A6A6"
  },
  "--gray-700": {
    DAY: "#A2AEBE",
    NIGHT: "#C6C6C6"
  },
  "--gray-800": {
    DAY: "#748094",
    NIGHT: "#D7D7D7"
  },
  "--gray-900": {
    DAY: "#4C5566",
    NIGHT: "#F0F0F0"
  },
  "--primary": {
    DAY: "#FFFFFF",
    NIGHT: "#161616"
  }
};
