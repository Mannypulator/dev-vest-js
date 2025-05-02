export const revalidate = 60; // Revalidate every 60 seconds

import Hero from "@/components/Hero";
import NavTabs from "@/components/NavTabs";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyListings from "@/components/PropertyListings";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <PropertyFilters />
      <NavTabs />
      <PropertyListings title={true} seeAllLink={true} />
    </>
  );
}
