import React from "react";
import "./tailwind.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Browse from "./components/Browse";
import Arrived from "./components/Arrived";
import Clients from "./components/Clients";
import AsideMenu from "./components/AsideMenu";
import Footer from "./components/Footer";
import Offline from "./components/Offline";

function App() {
  const [items, setItems] = React.useState([]);
  const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine);

  // Event listener for online/offline status
  function handleOfflineStatus() {
    setOfflineStatus(!navigator.onLine);
  }

  React.useEffect(
    function () {
      (async function () {
        try {
          const response = await fetch("https://bwacharity.fly.dev/items", {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              // "x-api-key": process.env.REACT_APP_APIKEY,
            },
          });
          const { nodes } = await response.json();
          setItems(nodes);

          const script = document.createElement("script");
          script.src = "/carousel.js";
          script.async = false;
          document.body.appendChild(script);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      })();

      handleOfflineStatus();
      window.addEventListener("online", handleOfflineStatus);
      window.addEventListener("offline", handleOfflineStatus);

      return function () {
        window.removeEventListener("online", handleOfflineStatus);
        window.removeEventListener("offline", handleOfflineStatus);
      };
    },
    [offlineStatus]
  );

  return (
    <>
      {offlineStatus && <Offline />}
      <Header />
      <Hero />
      <Browse />
      <Arrived items={items} />
      <Clients />
      <AsideMenu />
      <Footer />
    </>
  );
}

export default App;
