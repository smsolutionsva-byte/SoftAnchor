"use client";

import CheckInGate from "@/components/checkin/CheckInGate";
import MainDashboard from "@/components/dashboard/MainDashboard";

/**
 * Root route — renders the dashboard directly.
 * The /dashboard route is also available as a separate route.
 * Auth is handled at the layout level via AuthGate.
 */
const Home = () => {
  return (
    <CheckInGate>
      <MainDashboard />
    </CheckInGate>
  );
};

export default Home;
