import { BreadcrumbType } from "@/types/breadcrumbType";
import { BreadcrumbWithCustomSeparator } from "@/components/Breadcrumb/Breadcrumb";
import TableOfContents from "@/components/TableOfContent/TableOfContent";

const cookiepolicy = [
  {

    "title": "1. What Are Cookies?",
    "content": "Cookies are small text files stored on your device when you visit a website. They help websites function properly, improve user experience, and provide insights into how the site is being used."
  },
  {

    "title": "2. How We Use Cookies",
    "content": [
      "Essential Cookies: To ensure the website functions properly (e.g., enabling navigation and secure login).",
      "Performance Cookies: To analyze how visitors use our website and improve site performance.",
      "Functional Cookies: To remember your preferences, such as language or region.",
      "Advertising Cookies: To deliver relevant ads and measure the effectiveness of our marketing campaigns."
    ]
  },
  {

    "title": "3. Third-Party Cookies",
    "content": [
      "Analytics providers (e.g., Google Analytics) to help us understand site traffic and performance.",
      "Advertising partners to display personalized ads based on your browsing activity."
    ]
  },
  {

    "title": "4. Managing Cookies",
    "content": [
      "You have the right to accept or reject cookies. You can manage cookie settings through your browser’s privacy controls. Please note that disabling certain cookies may affect website functionality.",
      "To learn how to manage cookies in your browser, visit:",
      "Google Chrome Support",
      "Mozilla Firefox Support",
      "Microsoft Edge Support"
    ]
  },
  {

    "title": "5. Updates to This Policy",
    "content": "We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated “Last updated” date."
  },
  {

    "title": "6. Contact Us",
    "content": [
      "Zabeel Cars",
      "[Insert Address]",
      "[Insert Email Address]",
      "[Insert Phone Number]"
    ]
  }
];

const breadcrumbItems: BreadcrumbType[] = [
  { label: 'Home', href: '/' },
  { label: 'Cookie Policy' },
]

export default function AboutUs() {
  return (
    <>
      <div className="flex sticky w-full top-[0px] sm:top-[0px] z-[50] bg-white md:hidden items-center gap-3 py-3 border-b border-[#C9C9C9] px-2">
        <a href="/bidding"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 9 15" fill="none">
          <path d="M8 14L1 7.5L8 1" stroke="#053E54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg></a>
        <div className="">
          <h2 className="text-[16px] font-bold text-[#053E54] uppercase">Cookie Policy</h2>
          <p className="text-[12px] text-[#053E54]">Last updated: <span className="text-[12px] text-[#666666]">May 24, 2024</span></p>
        </div>
      </div>
      <section className="py-4 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
        <div className="container mx-auto">
          <BreadcrumbWithCustomSeparator className={`hidden lg:block`} items={breadcrumbItems} />
          <TableOfContents data={cookiepolicy} className={`hidden md:block`} />
        </div>
      </section>
    </>
  );
};