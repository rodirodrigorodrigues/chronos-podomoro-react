import { Route, useLocation } from "react-router";
import { Routes } from "react-router";
import { BrowserRouter } from "react-router";
import { Home } from "../../Pages/Home";
import { AboutPomodoro } from "../../components/AboutPomodoro";
import { NotFound } from "../../components/NotFound";
import { useEffect } from "react";

// Componente que não retorna nada, usado apenas para fazer um scroll to top.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-pomodoro" element={<AboutPomodoro />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}
