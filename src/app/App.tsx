import "./styles/app.css";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Index from "@/pages/Index/Index";
import LinkTree from "@/pages/LinkTree/LinkTree";
import RobloxAccounts from "@/pages/RobloxAccounts/RobloxAccounts";
import NotFound from "@/pages/NotFound/NotFound";
import { resolveRedirect } from "./redirects";

function CatchAllRoute() {
  const { pathname } = useLocation();
  const destination = resolveRedirect(pathname);

  useEffect(() => {
    if (destination) {
      window.location.replace(destination);
    }
  }, [destination]);

  if (destination) {
    return null;
  }

  return <NotFound />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index lang="en" />} />
      <Route path="/nl" element={<Index lang="nl" />} />
      <Route path="/linktree" element={<LinkTree />} />
      <Route path="/robloxaccounts" element={<RobloxAccounts />} />
      <Route path="*" element={<CatchAllRoute />} />
    </Routes>
  );
}

export default App;
