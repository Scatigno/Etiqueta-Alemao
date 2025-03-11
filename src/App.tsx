import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import OrderDetails from "./components/OrderDetails";
import routes from "tempo-routes";

function App() {
  // Use the routes hook at the component level
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pedido/:id" element={<OrderDetails />} />
        </Routes>
        {tempoRoutes}
      </>
    </Suspense>
  );
}

export default App;
