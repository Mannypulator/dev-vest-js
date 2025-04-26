"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const NavTabs = () => {
  const tabs = [
    "All",
    "Apartment",
    "Condo",
    "House",
    "Cabin or Cottage",
    "Room",
    "Studio",
    "Other",
    "More",
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <nav className="bg-white py-2 pt-16">
      <div className="container mx-auto px-4 flex justify-around space-x-4 sm:space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            href="#"
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`whitespace-nowrap px-3 py-2 text-base sm:text-lg font-medium ${
              selectedTab === tab
                ? "text-[#E6B027] border-b-2 border-[#E6B027]"
                : "text-[#0E0E10]"
            }`}
          >
            {tab}
            {tab === "More" && (
              <ChevronDown size={18} className="inline ml-1 text-black" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavTabs;
