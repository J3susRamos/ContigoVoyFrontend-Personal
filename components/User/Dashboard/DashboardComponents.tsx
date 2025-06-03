"use client";
import React from "react";
import DashboardResumen from "./DashboardResumen";
import VirtualizedTable from "./DashboardCitas";

export default function DashboardComponents() {
  return (
    <section className="flex flex-col md:flex-row mx-5   gap-10 ">
      <DashboardResumen/>
      <VirtualizedTable/>
    </section>
  );
}
