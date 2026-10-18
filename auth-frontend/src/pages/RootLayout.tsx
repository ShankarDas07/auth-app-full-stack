import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
function RootLayout() {
  return (
    <div>
      <Toaster
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--card-foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />
      <Navbar />
      <Outlet />
    </div>
  );
}

export default RootLayout;
