import LandingPage from "@/components/landing/LandingPage";
import AppBar from "@/components/landing/AppBar";

export default async function Home() {

  return (
    <div>
      <AppBar />
      <LandingPage />
    </div>
  );
}