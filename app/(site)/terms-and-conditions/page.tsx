import TableOfContents from "@/components/TableOfContent/TableOfContent";
import { BreadcrumbType } from "@/types/breadcrumbType";
import { BreadcrumbWithCustomSeparator } from "@/components/Breadcrumb/Breadcrumb";

const termsAndConditions = [
  {
    title: "1. Introduction",
    content: `These Terms and Conditions (“T&C”) govern all transactions carried out through Zabeel Cars LLC (“Company”), including vehicle bidding and direct sale...`
  },
  {
    title: "2. Eligibility",
    content: `
      <ul>
        <li>Customers must be at least 18 years old.</li>
        <li>Customers must present valid identification and trade license.</li>
        <li>The Company reserves the right to verify eligibility.</li>
      </ul>
    `
  },
  {
    title: "3. Bidding Terms",
    content: `
      Registration: Customers must register before participating...
      <br/><br/>
      Bidding Process: The Company sets a starting price and increments...
    `
  },
  {
    title: "4. Direct Sale Terms",
    content: `Vehicles listed for direct sale are available at fixed prices...`
  },
  {
    title: "5. Payments",
    content: `Payments must be made in AED...`
  },
  {
    title: "6. Vehicle Condition",
    content: `All vehicles are sold on an “as-is” basis...`
  },
  {
    title: "7. Transfer of Ownership",
    content: `Title and risk transfer to customer upon full payment...`
  },
  {
    title: "8. Warranties & Liabilities",
    content: `No warranty is provided unless stated otherwise...`
  },
  {
    title: "9. Cancellation & Refund Policy",
    content: `Deposits are non-refundable...`
  },
  {
    title: "10. Conduct & Compliance",
    content: `Customers must comply with UAE laws and RTA regulations...`
  },
  {
    title: "11. Dispute Resolution",
    content: `Disputes shall be referred to competent courts of Dubai...`
  },
  {
    title: "12. Amendments",
    content: `Zabeel Cars reserves the right to update these T&C...`
  },
  {
    title: "13. Contact Information",
    content: `
      Zabeel Cars LLC<br/>
      Phone: +971-XXX-XXXX<br/>
      Email: info@zabeelcars.com
    `
  }
];

const breadcrumbItems: BreadcrumbType[] = [
  { label: 'Home', href: '/' },
  { label: 'Terms and Conditions' },
]

export default function AboutUs() {

  return (
    <>
      <div className="flex sticky w-full top-[0px] sm:top-[0px] z-[50] bg-white md:hidden items-center gap-3 py-3 border-b border-[#C9C9C9] px-2">
        <a href="/bidding"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 9 15" fill="none">
          <path d="M8 14L1 7.5L8 1" stroke="#053E54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg></a>
        <div className="">
          <h2 className="text-[16px] font-bold text-[#053E54] uppercase">Terms & Conditions</h2>
          <p className="text-[12px] text-[#053E54]">Last updated: <span className="text-[12px] text-[#666666]">May 24, 2024</span></p>
        </div>
      </div>
      <section className="py-4 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
        <div className="container mx-auto">
          <BreadcrumbWithCustomSeparator className={`hidden lg:block`} items={breadcrumbItems} />
          <TableOfContents data={termsAndConditions} className={`hidden md:block`} />
        </div>
      </section>
    </>
  );
};