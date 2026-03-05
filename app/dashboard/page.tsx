"use client";

import CheckInGate from "@/components/checkin/CheckInGate";
import MainDashboard from "@/components/dashboard/MainDashboard";

export default function DashboardPage() {
  return (
    <CheckInGate>
      <MainDashboard />
    </CheckInGate>
  );
}
