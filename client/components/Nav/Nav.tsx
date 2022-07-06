import LandingNav from "./Landing/LandingNav";
import DashboardNav from "./DashboardNav/DashboardNav";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Nav = () => {
  const router = useRouter();
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    setIsDashboard(router.pathname == "/dashboard");
  }, [router.pathname]);

  return (
    <>
      {isDashboard && <DashboardNav />}
      {!isDashboard && <LandingNav />}
    </>
  );
};

export default Nav;
