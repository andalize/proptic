"use client";
import React from "react";
import { useParams } from "next/navigation";
import ReceptionistDashBoard from "./(receptionist)/receptionist-dashboard";

export default function Home() {
  const { role } = useParams<{ role: string }>();

  const dashboard: Record<string, () => React.JSX.Element> = {
    receptionist: ReceptionistDashBoard,
   
  };

  return <main className="min-h-screen"> {dashboard[role]?.()} </main>;
}
