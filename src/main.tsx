import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import App from "./app/App.tsx";

const theme = createTheme({
  primaryColor: "blue",
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </BrowserRouter>,
);
