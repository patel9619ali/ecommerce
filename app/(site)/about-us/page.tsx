import AboutUsBanner from "@/components/AboutUs/AboutUsBanner";
import AboutUsCards from "@/components/AboutUs/AboutUsCards";
import { BreadcrumbType } from "@/types/breadcrumbType";
import { BreadcrumbWithCustomSeparator } from "@/components/Breadcrumb/Breadcrumb";
import AboutMission from "@/components/AboutUs/AboutMission";
import AboutCTA from "@/components/AboutUs/AboutCTA";

const breadcrumbItems: BreadcrumbType[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us' },
]

export default function AboutUs() {

  return (
    <section className="py-4 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
      <div className="container mx-auto">
        <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
        <AboutUsBanner/>
      </div>
      <AboutUsCards />
      <AboutMission/>
      <AboutCTA/>
    </section>
  );
};