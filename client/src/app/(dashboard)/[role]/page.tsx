"use client";
import { useParams } from "next/navigation";
import ReceptionistDashBoard from "./(receptionist)/receptionist-dashboard";

export default function Home() {
  const { role } = useParams<{ role: string }>();

  const dashboard: Record<string, () => JSX.Element> = {
    receptionist: ReceptionistDashBoard,
   
  };

  return <main className="min-h-screen"> {dashboard[role]?.()} </main>;
}
