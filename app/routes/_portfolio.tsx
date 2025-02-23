import { Outlet } from "@remix-run/react";
import PortfolioLayout from "~/layouts/PortifolioLayout";

export default function PortfolioLayoutRoute() {
  return (
    <PortfolioLayout>
      <Outlet />
    </PortfolioLayout>
  );
}
