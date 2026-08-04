"use client";

import { useNav } from "@/lib/store";
import HomeScreen from "./screens/HomeScreen";
import BarsScreen from "./screens/BarsScreen";
import NutritionScreen from "./screens/NutritionScreen";
import AboutScreen from "./screens/AboutScreen";
import OrderingScreen from "./screens/OrderingScreen";
import WholesaleScreen from "./screens/WholesaleScreen";

/**
 * Temporary: preserves the pre-Tier-2 hash-driven screen switch so Task 2 is a
 * pure refactor with no behaviour change. Task 3 replaces this entirely with
 * real routes and deletes this file.
 */
export default function ScreenSwitch() {
  const { view } = useNav();
  return (
    <>
      {view === "home" && <HomeScreen key="home" />}
      {view === "bars" && <BarsScreen key="bars" />}
      {view === "nutrition" && <NutritionScreen key="nutrition" />}
      {view === "about" && <AboutScreen key="about" />}
      {view === "ordering" && <OrderingScreen key="ordering" />}
      {view === "wholesale" && <WholesaleScreen key="wholesale" />}
    </>
  );
}
