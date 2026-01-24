"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [view, setView] = useState<"phone" | "country">("phone");
  const [countryCode, setCountryCode] = useState("+971");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [chooseCompany, setChooseCompany] = useState("Choose company");
  const [addedNewCompany, setAddedNewCompany] = useState(false);

  // Handle Country Code Selection
  const handleSelect = (code: string) => {
    setCountryCode(code);
  };

  // Handle Company Selection
  const companySelect = (label: string) => {
    setChooseCompany(label);
  };

  // Phone Number error state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (!loginOpen) {
      const timeout = setTimeout(() => {
        setView("phone");
        setCountryCode("+971");
        setPhoneNumber("");
        setPhoneError("");
        setFullName("");
        setEmail("");
        setChooseCompany("Choose company");
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [loginOpen]);
  return (
    <section className="bg-[#dbd4d463] text-white rounded-t-[20px] lg:pt-10 pt-6 lg:pb-6 pb-4 px-4 lg:px-12">
      <footer className="container">
        {/* <div className="w-full flex gap-3 mb-5">
          <svg width="97" height="47" viewBox="0 0 97 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.48239 42.9933H15.6856V46.4332H0.399414C0.956074 45.552 1.46513 44.7409 1.92291 43.9999C2.39167 43.2662 2.90805 42.4329 3.48668 41.5002C4.06165 40.56 4.6586 39.6014 5.26653 38.6207C5.88179 37.64 6.47141 36.6814 7.0537 35.7486C7.62867 34.8084 8.15237 33.9752 8.61016 33.2415C8.89581 32.7806 9.19977 32.3014 9.51839 31.7889H1.05495V28.349H15.7076L6.47873 42.9933H6.48239Z" fill="#fff" />
            <path d="M25.5186 27.6411H25.3208L17.2163 46.4369H20.7064L22.175 42.8975H28.1334L29.5178 46.4369H33.6231L25.5186 27.6411ZM23.4128 39.9L25.2403 35.4942L26.9615 39.9H23.4128Z" fill="#fff" />
            <path d="M47.4848 38.3663C46.9684 37.7727 46.2982 37.286 45.4852 36.9063C46.0089 36.5855 46.4593 36.18 46.8146 35.6859C47.3639 34.9449 47.6349 34.0121 47.6349 32.8986C47.6349 31.387 47.0856 30.2588 45.9796 29.4993C44.8736 28.7324 43.3831 28.3527 41.5117 28.3527H36.2344V46.4369H42.2185C43.0132 46.4369 43.7822 46.3447 44.5367 46.1567C45.2838 45.9687 45.954 45.6627 46.5546 45.2497C47.1442 44.8294 47.6203 44.2838 47.9645 43.598C48.3161 42.9196 48.4882 42.0864 48.4882 41.1057C48.4882 40.0401 48.1586 39.1258 47.4884 38.3663H47.4848ZM39.7721 31.7889H41.6728C42.3759 31.7889 42.9363 31.9474 43.3464 32.2608C43.7639 32.5668 43.969 33.035 43.969 33.6544C43.969 34.2001 43.8042 34.6868 43.4673 35.1071C43.1377 35.5348 42.625 35.7523 41.9182 35.7523H39.7721V31.7926V31.7889ZM44.4598 42.2449C44.2144 42.5509 43.8775 42.7721 43.46 42.9122C43.0352 43.0523 42.5664 43.1187 42.0427 43.1187H39.7721V39.1922H41.7973C42.3064 39.1922 42.7898 39.2401 43.2476 39.3507C43.7163 39.4576 44.0899 39.6493 44.3865 39.9111C44.6832 40.1839 44.8297 40.5784 44.8297 41.1057C44.8297 41.5591 44.7051 41.9463 44.4598 42.2449Z" fill="#fff" />
            <path d="M55.5641 42.9933V39.0926H63.2768V35.6527H55.5641V31.7926H64.2766V28.3527H52.0264V46.4369H64.6208V42.997H55.5641V42.9933Z" fill="#fff" />
            <path d="M71.8165 42.9933V39.0926H79.5365V35.6527H71.8165V31.7926H80.5363V28.3527H68.2861V46.4369H80.8732V42.997H71.8165V42.9933Z" fill="#fff" />
            <path d="M88.0731 42.9933V28.349H84.5317V46.4332H96.5146V42.9933H88.0731Z" fill="#fff" />
            <path d="M38.4352 19.9318C29.2576 15.5961 18.3771 14.3388 8.78937 17.9594C8.2144 18.1806 7.55886 18.4681 7.14137 18.7004H0C2.80894 16.5141 13.7224 8.0158 18.3844 4.39527L11.2174 1.72964C12.415 1.89924 22.303 3.70213 22.303 3.70213C22.303 3.70213 16.9745 8.90434 12.7922 13.1553C21.7391 12.3885 30.9276 15.091 38.4315 19.9355L38.4352 19.9318Z" fill="#fff" />
            <path d="M59.3282 7.73187C56.8892 8.16693 54.3952 8.35496 51.9085 8.23698C49.9126 6.59262 47.653 5.20635 45.4117 4.04498C42.2732 2.72876 38.9039 2.2384 35.476 2.21259H35.3259C31.0447 2.20153 26.694 2.91679 22.6143 3.66892C30.25 1.1692 38.578 -1.3342 46.6495 0.815259C51.2456 2.38956 55.7575 4.37311 59.3282 7.73187Z" fill="#fff" />
            <path d="M95.4747 19.6221H89.3405C88.8974 19.0728 88.3993 18.5455 87.8536 18.0699C80.1776 11.2787 68.8283 11.9829 59.2808 13.229C51.2752 14.1987 42.343 11.9423 36.9229 5.68564C42.9546 10.9985 51.3301 12.2741 58.8707 10.6076L62.7673 9.76703C69.5681 8.35864 76.6618 7.96414 83.4699 9.90345C88.4506 11.3819 93.292 14.689 95.4747 19.6221Z" fill="#fff" />
          </svg>
        </div> */}
        <div className="lg:text-[40px] text-[30px] font-[400] text-[#053E54]">Logo</div>
        {/* Top Section */}
        {/* <div className="grid grid-cols-2 grid-rows-[auto_auto] lg:grid-cols-[25%_25%_50%] lg:grid-rows-1 pb-8 border-b border-dashed border-[#FFFFFF33]">
          
          <div className="flex flex-col gap-3">
            <Link href={`/buy-direct`} className="lg:text-[16px] text-[12px] font-[500]">Buy Direct</Link>
            
            <Link href={`/contact-us`} className="lg:text-[16px] text-[12px] font-[500]">Contact us</Link>
          </div>

         
          <div className="flex flex-col gap-3">
            <Link href={`/faq`} className="lg:text-[16px] text-[12px] font-[500]">FAQs</Link>
            <Link href={`/about-us`} className="lg:text-[16px] text-[12px] font-[500]">About Us</Link>
          </div>

         
          <div className="hidden lg:flex flex-row lg:flex-col justify-center items-start lg:items-end text-right">
            <p className="lg:text-[19px] text-[#FFFFFFB2] font-[500]">
              Don’t hesitate, Let us do it!
            </p>
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setLoginOpen(true)}>
              <h3 className="lg:text-[47px] font-[700]">Connect with us</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0 0 40 30" fill="none">
                <path d="M1.5 15H38.5M38.5 15L23.9242 1.5M38.5 15L23.9242 28.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div> */}

        {/* <div className="flex lg:hidden flex-col justify-center items-start lg:items-end text-right py-4 border-b border-dashed border-[#FFFFFF33]">
          <p className="lg:text-[19px] text-[14px] text-[#FFFFFFB2] font-[500]">
            Don’t hesitate, Let us do it!
          </p>
          <div className="flex items-center gap-4" onClick={() => setLoginOpen(true)}>
            <h3 className="lg:text-[47px] text-[24px] font-[700]">Connect with us</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="13" viewBox="0 0 40 30" fill="none">
              <path d="M1.5 15H38.5M38.5 15L23.9242 1.5M38.5 15L23.9242 28.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div> */}


        {/* Bottom Section */}
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-4 pt-6">
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <Link href={`/terms-and-conditions`} className="lg:text-[16px] text-[12px] font-[400] text-[#053E54]">Terms & Conditions</Link>
            <span className="lg:text-[16px] text-[12px] font-[400] text-[#053E54]">|</span>
            <Link href={`/privacy-and-policy`} className="lg:text-[16px] text-[12px] font-[400] text-[#053E54]">Privacy & Policy</Link>
            <span className="lg:text-[16px] text-[12px] font-[400] text-[#053E54]">|</span>
            <Link href={`/cookie-policy`} className="lg:text-[16px] text-[12px] font-[400] text-[#053E54]">Cookie Policy</Link>
            <p className="text-[12px] font-[400] text-[#FFFFFFB2] lg:hidden ">
              © 2026 | BlendRas Portable Juicer
            </p>
          </div>

          <p className="lg:text-[16px] lg:inline-block hidden text-[#053E54] font-[400]">
            © 2026 | BlendRas Portable Juicer
          </p>

          <div className="flex gap-3">
            <Link href={``}>
              <Image src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/linkedin.svg`} width={27} height={27} alt="Map Icon" />
            </Link>
            <Link href={``}>
              <Image src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/twitter.svg`} width={27} height={27} alt="Map Icon" />
            </Link>
            <Link href={``}>
              <Image src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/instagram.svg`} width={27} height={27} alt="Map Icon" />
            </Link>
            <Link href={``}>
              <Image src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/whatsapp.svg`} width={27} height={27} alt="Map Icon" />
            </Link>
          </div>

        </div>
      </footer>
    </section>
  );
}
