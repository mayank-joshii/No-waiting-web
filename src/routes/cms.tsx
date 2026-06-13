import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/cms")({
  component: CmsLayout,
});

function CmsLayout() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const isLoginPage = pathname === "/cms/login" || pathname === "/cms/login/";
    if (isLoginPage) {
      setAuthorized(true);
      return;
    }

    const token = sessionStorage.getItem("admin_token");
    if (token !== "authenticated-admin-session") {
      setAuthorized(false);
      navigate({ to: "/cms/login" });
    } else {
      setAuthorized(true);
    }
  }, [navigate, pathname]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070707]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <Outlet />
    </div>
  );
}
