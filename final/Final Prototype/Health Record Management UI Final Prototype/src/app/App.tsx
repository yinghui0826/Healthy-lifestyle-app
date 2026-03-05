import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { HealthProvider } from "./context/HealthContext";
import { Login } from "./pages/Login";

function AppInner() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  return (
    <HealthProvider username={user.username}>
      <RouterProvider router={router} />
    </HealthProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
