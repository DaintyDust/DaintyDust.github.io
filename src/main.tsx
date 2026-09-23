import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@gfazioli/mantine-compare/styles.css";
import "@mantine/lightbox/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { Lightbox } from "@mantine/lightbox";
import App from "./app/App.tsx";

const theme = createTheme({
  primaryColor: "blue",
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Lightbox.Provider loop withZoom withThumbnails withSlideTransition transitionProps={{ transition: "pop" as any, duration: 400 }} />
      <App />
    </MantineProvider>
  </BrowserRouter>,
);
