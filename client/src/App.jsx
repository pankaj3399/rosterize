import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./Components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./context/AuthContext";
import { me } from "./api/Auth";
import Loader from "./Components/Loader/Loader";
import ProtectedRoute from "./Components/ProtectedRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import AboutUs from "./pages/LandingPage/AboutUs";
import ForgotPassword from "./pages/ForgotPassword";
import EnquiriesPage from "./pages/LandingPage/Enquries";

function App() {
  const { authData, setAuth, setLoading } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: () => me(),
    // staleTime: Infinity,
    cacheTime: 0,
    // don't call api on certain routes
    enabled: ![
      "/login",
      "/register",
      "/forgot-password",
      "/landing-page",
      "/about-us",
      "/enquiries",
    ].includes(window.location.pathname),
    retry: 0,
  });

  if (data) {
    console.log("User:", data);
    setAuth(data);
    setLoading(false);
  }
  if (error) {
    setLoading(false);
  }

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col">
      {authData && <Header />}
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/landing-page" element={<AboutUs />} />
          <Route path="/about-us" element={<LandingPage />} />
          <Route path="/enquiries" element={<EnquiriesPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
