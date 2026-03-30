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
  TextInput,
  PasswordInput,
  createTheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/form";

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
  "#eaf1ee",
  "#dce3e0",
  "#b8c5bf",
  "#92a79d",
  "#748e82",
  "#5a776a",
  "#4D6459", // index 6: Dark Olive (Primary)
  "#3a4c44",
  "#26322d",
  "#141a18",
];

const sage = [
  "#f1f6f4",
  "#e2ede9",
  "#c6d9d2",
  "#a8c5ba",
  "#9bb0a5", // index 4: Sage
  "#738d81",
  "#586d63",
  "#415049",
  "#2b3430",
  "#141917",
];

const beige = [
  "#fcfbf9",
  "#f7f4ed",
  "#efe9db",
  "#E9E2D0", // index 3: Warm Beige
  "#dec48b",
  "#d3ab5d",
  "#c9923a",
  "#aa7b31",
  "#8b6528",
  "#6b4f1f",
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
  primaryColor: "olive",
  focusRing: "never",
  defaultRadius: "32px", // Increased for administrative dashboard
  primaryShade: { light: 6, dark: 6 },
  respectReducedMotion: true,
  fontFamily: 'Open Sans, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    sizes: {
      h1: { fontSize: '40px', fontWeight: '800', lineHeight: '1.2' },
      h2: { fontSize: '32px', fontWeight: '800', lineHeight: '1.2' },
      h3: { fontSize: '20px', fontWeight: '800', lineHeight: '1.2' },
    },
  },
  colors: {
    brand,
    olive: brand,
    sage,
    beige,
    primary: brand,
    moduleGray,
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
        size: "md",
        fw: 700,
      },
    }),
    TextInput: TextInput.extend({
      styles: { 
        label: { marginBottom: '8px', fontSize: '13px', fontWeight: 600 } 
      },
    }),
    PasswordInput: PasswordInput.extend({
      styles: { 
        label: { marginBottom: '8px', fontSize: '13px', fontWeight: 600 } 
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "light",
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        radius: "sm",
        size: "sm",
        fw: 700,
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
        radius: "32px",
        shadow: "none",
        withBorder: false,
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
        table: {
          borderCollapse: 'separate',
          borderSpacing: '0 10px',
        },
        thead: {
          backgroundColor: 'transparent',
        },
        th: { 
          textAlign: "left", 
          color: "#adb5bd", 
          fontSize: '11px', 
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: 'none',
          padding: '16px 20px',
        },
        td: {
          borderBottom: 'none',
          padding: '12px 20px',
          verticalAlign: 'middle',
        },
        tr: {
          backgroundColor: '#fff',
        }
      },
      defaultProps: {
        verticalSpacing: "md",
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
    >
      <Notifications autoClose={2000} position="bottom-right" zIndex={1000} />
      {children}
    </MantineProvider>
  );
}

export default MantineStyleProvider;
