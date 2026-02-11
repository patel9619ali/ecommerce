import TableOfContents from "@/components/TableOfContent/TableOfContent";
import { BreadcrumbType } from "@/types/breadcrumbType";
import { BreadcrumbWithCustomSeparator } from "@/components/Breadcrumb/Breadcrumb";
export const revalidate = 3600;
const privacyandpolicies = [
  {

    "title": "1. Introduction",
    "content": "Zabeel Cars LLC (“Company”, “we”, “our”, “us”) values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect information provided by customers (“you”, “your”) when using our services, including bidding and direct sales of vehicles."
  },
  {

    "title": "2. Information We Collect",
    "content": [
      "Identification details: Full name, Emirates ID/passport, driver’s license.",
      "Contact information: Phone number, email, address.",
      "Payment details: Bank account, credit/debit card, transaction records.",
      "Business information: Trade license (for dealers).",
      "Usage data: Website/app activity, IP address, cookies."
    ]
  },
  {

    "title": "3. How We Use Your Information",
    "content": [
      "To verify identity and eligibility for bidding/sales.",
      "To process payments, transfers, and registrations.",
      "To communicate regarding auctions, purchases, and offers.",
      "To comply with UAE laws and regulatory requirements.",
      "To improve our services, website, and customer support.",
      "For marketing (only if you consent)."
    ]
  },
  {

    "title": "4. Sharing of Information",
    "content": [
      "Government authorities: RTA, customs, police, or other regulatory bodies.",
      "Service providers: Payment processors, IT support, logistics companies.",
      "Legal purposes: To comply with legal obligations or protect our rights.",
      "We do not sell or rent your personal data to third parties for commercial purposes."
    ]
  },
  {

    "title": "5. Data Retention",
    "content": [
      "We retain personal data only as long as necessary to fulfill the purposes described above.",
      "Transactional data may be retained longer where required by law (e.g., VAT, compliance)."
    ]
  },
  {

    "title": "6. Security Measures",
    "content": [
      "We implement reasonable technical and organizational safeguards to protect personal data from unauthorized access, misuse, alteration, or disclosure.",
      "However, no electronic system is 100% secure, and we cannot guarantee absolute protection."
    ]
  },
  {

    "title": "7. Cookies & Tracking",
    "content": [
      "Our website may use cookies and similar technologies to improve user experience.",
      "You can control cookies through your browser settings, but disabling them may affect website functionality."
    ]
  },
  {

    "title": "8. Your Rights",
    "content": [
      "Access and request a copy of your data.",
      "Request correction of inaccurate data.",
      "Withdraw consent for marketing communications.",
      "Request deletion of your data (subject to legal requirements)."
    ]
  },
  {

    "title": "9. Children’s Privacy",
    "content": "Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from minors."
  },
  {

    "title": "10. International Transfers",
    "content": "If we transfer your data outside the UAE, we will ensure appropriate safeguards are in place in compliance with applicable laws."
  },
  {

    "title": "11. Updates to this Policy",
    "content": "We may update this Privacy Policy from time to time. Updates will be effective once posted on our website or communicated through official channels."
  },
  {

    "title": "12. Contact Us",
    "content": [
      "Zabeel Cars LLC",
      "[Address Placeholder]",
      "Phone: +971-XXX-XXXX",
      "Email: privacy@zabeelcars.com"
    ]
  }
];

const breadcrumbItems: BreadcrumbType[] = [
  { label: 'Home', href: '/' },
  { label: 'Privacy Policy' },
]

export default function AboutUs() {

  return (
    <>
      <div className="flex sticky w-full top-[0px] sm:top-[0px] z-[50] bg-white md:hidden items-center gap-3 py-3 border-b border-[#C9C9C9] px-2">
        <a href="/bidding"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 9 15" fill="none">
          <path d="M8 14L1 7.5L8 1" stroke="#053E54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg></a>
        <div className="">
          <h2 className="text-[16px] font-bold text-[#053E54] uppercase">Privacy & Policy</h2>
          <p className="text-[12px] text-[#053E54]">Last updated: <span className="text-[12px] text-[#666666]">May 24, 2024</span></p>
        </div>
      </div>
      <section className="py-4 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
        <div className="container mx-auto">
          <BreadcrumbWithCustomSeparator className={`hidden lg:block`} items={breadcrumbItems} />
          <TableOfContents data={privacyandpolicies} className={`hidden md:block`} />
        </div>
      </section>
    </>
  );
};