import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./tailwind.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Browse from "./components/Browse";
import Arrived from "./components/Arrived";
import Clients from "./components/Clients";
import AsideMenu from "./components/AsideMenu";
import Footer from "./components/Footer";
import Offline from "./components/Offline";
import Splash from "./pages/Splash";
import PageProfile from "./pages/PageProfile";
import Details from "./pages/DetailPage";

// Komponen App
function App() {
  const [items, setItems] = React.useState([]);
  const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine);
  const [isLoading, setIsLoading] = React.useState(true);

  // Event listener for online/offline status
  function handleOfflineStatus() {
    setOfflineStatus(!navigator.onLine);
  }

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch("https://bwacharity.fly.dev/items", {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const { nodes } = await response.json();
        setItems(nodes);

        const script = document.createElement("script");
        script.src = "/carousel.js";
        script.async = false;
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Menangani kesalahan pengambilan data dari API di sini
      }
    })();

    handleOfflineStatus();
    window.addEventListener("online", handleOfflineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener("online", handleOfflineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
    };
  }, [offlineStatus]);

  return (
    <>
      {isLoading === true ? (
        <Splash />
      ) : (
        <>
          {offlineStatus && <Offline />}
          <Header mode="light" />
          <Hero />
          <Browse />
          <Arrived items={items} />
          <Clients />
          <AsideMenu />
          <Footer />
        </>
      )}
    </>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<App />} />
        <Route path="/profile" exact element={<PageProfile />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}
