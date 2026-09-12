import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDemoAccount } from "./hooks/useContracts";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Faucet from "./pages/Faucet";
import Mint from "./pages/Mint";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import Redeem from "./pages/Redeem";
import Activity from "./pages/Activity";
import RiskMonitor from "./pages/RiskMonitor";

function ProtectedRoutes() {
  const { isConnected } = useDemoAccount();
  if (!isConnected) return <Navigate to="/" replace />;
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/faucet" element={<Faucet />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/send" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/risk" element={<RiskMonitor />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
