import FAQ from "@/components/FAQ/FAQ";
import { BreadcrumbType } from "@/types/breadcrumbType";
import { BreadcrumbWithCustomSeparator } from "@/components/Breadcrumb/Breadcrumb";

const breadcrumbItems: BreadcrumbType[] = [
  { label: 'Home', href: '/' },
  { label: 'FAQ' },
]

export default function FaqPage() {

  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
      <div className="container mx-auto pt-4">
        <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
      </div>
      <FAQ className={{ wrapper: "hidden", alignMent: "center", widthHeading: "3xl", searchFunctionalityVisiblity: "block", modal: true }} />
    </section>
  );
};