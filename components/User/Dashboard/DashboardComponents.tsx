"use client";
import React from "react";
import DashboardResumen from "./DashboardResumen";
import VirtualizedTable from "./DashboardCitas";

export default function DashboardComponents() {
  return (
    <section className="flex flex-col xl:flex-row mx-3 md:mx-5 gap-6 md:gap-8 lg:gap-10">
      <div className="w-full xl:w-auto xl:flex-shrink-0">
        <DashboardResumen/>
      </div>
      <div className="w-full xl:flex-1 min-w-0">
        <VirtualizedTable/>
      </div>
    </section>
  );
}
