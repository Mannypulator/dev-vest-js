import Hero from "@/components/Hero";
import NavTabs from "@/components/NavTabs";
import PropertyFilters from "@/components/PropertyFilter";
import PropertyListings from "@/components/PropertyListings";

export default function Home() {
  return (
    <>
      <Hero />
      <PropertyFilters />
      <NavTabs />
      <PropertyListings title={true} seeAllLink={true} />
    </>
  );
}
