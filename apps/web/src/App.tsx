import { useEffect, useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { StudioPage } from "./pages/StudioPage";

function normalizePath(pathname: string) {
  return pathname.startsWith("/studio") ? "/studio" : "/";
}

export function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextPath: "/" | "/studio") {
    if (window.location.pathname !== nextPath) window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return path === "/studio"
    ? <StudioPage onNavigate={navigate} />
    : <LandingPage onNavigate={navigate} />;
}
