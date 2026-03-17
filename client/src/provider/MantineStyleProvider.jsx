import {
  ActionIcon,
  Badge,
  Button,
  Chip,
  Group,
  MantineProvider,
  Paper,
  Stack,
  Table,
  NavLink,
  createTheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const semanticColors = {
  light: {
    background: '#f8f9fa',
    surface: '#ffffff',
    border: '#dee2e6',
  },
  dark: {
    background: '#1a1b1e',
    surface: '#25262b',
    border: '#373A40',
  },
  landing: {
    heroOverlay: 'rgba(0, 0, 0, 0.5)',
    cardBackground: '#ffffff',
    iconBackground: '#DAF0EE',
    iconColor: '#25766E',
    moduleBackground: '#F3F4F6',
  }
};

const brand = [
  "#e3f5f8",
  "#d0e9ed",
  "#a6d2da",
  "#79b9c5",
  "#51a4b2",
  "#3695a6",
  "#238ba0",
  "#147a8f",
  "#0f4c5c", // index 8 matching the very dark teal prototype button
  "#083845",
];

const moduleGray = [
  '#F3F4F6',
  '#F3F4F6',
  '#F3F4F6',
  '#F3F4F6',
  '#F3F4F6',
  '#F3F4F6',
  '#F3F4F6',
  '#F3F4F6',
  '#F3F4F6',
  '#F3F4F6',
];

//******************************** Default Styling Source ********************************//
// This file acts as the "Design System Source of Truth".
// 1. We define colors/fonts here (e.g., 'primary', 'brand').
// 2. Mantine automatically converts these into CSS Variables (e.g., var(--mantine-color-brand-1)).
// 3. These variables are then available globally to be used in 'global.css' or any component.
//****************************************************************************************//
const theme = createTheme({
  primaryColor: "primary", //* Add the key name from colors property below.
  focusRing: "never",
  defaultRadius: "0",
  primaryShade: { light: 8, dark: 8 },
  respectReducedMotion: true,
  fontFamily: 'Open Sans, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    sizes: {
      h1: { fontSize: '40px', fontWeight: '700', lineHeight: '56px' },
      h2: { fontSize: '32px', fontWeight: '600', lineHeight: '40px' },
      h3: { fontSize: '24px', fontWeight: '600', lineHeight: '32px' },
    },
  },
  colors: {
    brand,
    moduleGray,
    primary: [
      "#e3f5f8",
      "#d0e9ed",
      "#a6d2da",
      "#79b9c5",
      "#51a4b2",
      "#3695a6",
      "#238ba0",
      "#147a8f",
      "#0f4c5c", // index 8
      "#083845", // index 9
    ],
    pinkish: [
      "#ffeaf3",
      "#fdd4e1",
      "#f4a7bf",
      "#ec779c",
      "#e64f7e",
      "#e3356b",
      "#e22762",
      "#c91a52",
      "#b41149",
      "#9f003e",
    ],
    option3: [
      "#FFFFFF", //white
      "#B1C9EF", //sky blue
      "#68E6E0", //aqua
      "#2898AE", //royal blue
      "#D9D9D9", //silver
      "#072E33", //navy blue
      "#daf0ee", //blue-green
      "#5aaea4", // medium turqoise
      "#B11322", //maroon
      "#5BEBEF", //light blue
      "#2ECC71", //lime green
      "#000000", // black
    ],
  },
  other: {
    lightBackground: semanticColors.light.background,
    lightSurface: semanticColors.light.surface,
    lightBorder: semanticColors.light.border,
    darkBackground: semanticColors.dark.background,
    darkSurface: semanticColors.dark.surface,
    darkBorder: semanticColors.dark.border,
    ...semanticColors.landing,
  },
  //******************************** Change the default Props of the component here ********************************/
  components: {
    Button: Button.extend({
      defaultProps: {
        variant: "filled",
        radius: "xl",
        color: "brand.8",
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "light",
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Chip: Chip.extend({
      defaultProps: {
        radius: "xs",
        size: "xs",
        variant: "outline",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: "lg",
        shadow: "sm",
      },
      styles: {
        root: {
          backgroundColor: "#ffffff",
        }
      }
    }),
    Group: Group.extend({
      defaultProps: {
        gap: "xs",
      },
    }),
    Stack: Stack.extend({
      defaultProps: {
        gap: "xs",
      },
    }),
    Table: Table.extend({
      styles: {
        th: { textAlign: "center", color: "white" },
      },
      defaultProps: {
        ta: "center",
      },
    }),
    NavLink: NavLink.extend({
      defaultProps: {
        p: 'xs',
      },
      styles: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
        },
      }
    }),
  },
});

//* Additional default settings can be change in the component's props here:
function MantineStyleProvider({ children }) {
  return (
    <MantineProvider
        theme={theme}
        defaultColorScheme="light"
        forceColorScheme="light"
    >
      <Notifications autoClose={2000} position="bottom-right" zIndex={1000} />
      {children}
    </MantineProvider>
  );
}

export default MantineStyleProvider;
