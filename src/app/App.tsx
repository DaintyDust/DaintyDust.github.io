import "./styles/app.css";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index/Index";
import LinkTree from "@/pages/LinkTree/LinkTree";
// import Snake from "@/pages/Snake/Snake";
import NotFound from "@/pages/NotFound/NotFound";
import externalRedirects from "./redirects";
// import { locales } from "@/shared/locales";

function ExternalRedirect({ to }: { to: string }) {
  window.location.href = to;
  return null;
}

function App() {
  // const localeKeys = Object.keys(locales) as Array<keyof typeof locales>;

  return (
    <Routes>
      <Route path="/" element={<Index lang="en" />} />
      <Route path="/nl" element={<Index lang="nl" />} />

      {/* {localeKeys.map((lang) => (
        <Route key={lang} path={`/${lang}`} element={<Index lang={lang} />} />
      ))} */}

      <Route path="/linktree" element={<LinkTree />} />
      {/* <Route path="/snake" element={<Snake />} /> */}
      {Object.entries(externalRedirects).map(([path, url]) => (
        <Route key={path} path={path} element={<ExternalRedirect to={url} />} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
