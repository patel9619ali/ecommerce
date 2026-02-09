"use client";
import React,{useState,useMemo} from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SearchFunctionalityFAQ from "./SearchFunctionalityFAQ";
let notFoundFAQ = (
  <svg xmlns="http://www.w3.org/2000/svg" width="125" height="91" viewBox="0 0 125 91" fill="none">
    <g clipPath="url(#clip0_778_18044)">
    <path d="M121.233 46.537L123.411 59.9832L110.704 57.9837C105.54 61.3957 99.3149 63.3873 92.6148 63.3873C91.3797 63.3873 90.162 63.3198 88.9625 63.1875C90.5902 58.4814 91.4718 53.4406 91.4718 48.1974C91.4718 31.8465 82.8921 17.4584 69.8984 9.10903C75.7439 3.47503 83.765 0 92.6148 0C110.499 0 124.997 14.1893 124.997 31.6932C124.997 37.0556 123.635 42.1078 121.233 46.5361V46.537Z" fill="#000"/>
    <path d="M5.08283 68.2438L2.13927 86.4041L19.3012 83.7045C26.2766 88.3116 34.6834 91.0015 43.7321 91.0015C67.8842 91.0015 87.4642 71.838 87.4642 48.198C87.4642 24.5589 67.8842 5.39453 43.7321 5.39453C19.58 5.39453 0 24.558 0 48.1971C0 55.4398 1.83788 62.2629 5.08283 68.243V68.2438Z" fill="#057C72"/>
    <path d="M45.7451 60.8203H41.9087C41.0149 60.8203 40.3253 60.0238 40.4478 59.1301C41.1044 54.3153 44.484 50.8841 47.5031 47.8209C50.7281 44.5474 53.5135 41.7208 53.5135 37.6105C53.5135 32.1491 49.1091 27.7067 43.6962 27.7067C38.7202 27.7067 34.598 31.4604 33.9631 36.3076C33.8658 37.0515 33.2439 37.6113 32.5004 37.6113H28.7022C27.8336 37.6113 27.1501 36.8578 27.2335 35.986C28.0464 27.5455 35.1191 20.9258 43.6953 20.9258C52.8152 20.9258 60.2353 28.4112 60.2353 37.6113C60.2353 40.7604 59.332 43.6791 57.4733 46.5355C55.9681 48.8496 54.0877 50.7571 52.2706 52.6023C49.8526 55.0566 47.7185 57.2226 47.1843 59.6549C47.0349 60.3357 46.4374 60.8211 45.7451 60.8211V60.8203Z" fill="white"/>
    <path d="M43.697 75.4684C46.1531 75.4684 48.1441 73.4599 48.1441 70.9823C48.1441 68.5046 46.1531 66.4961 43.697 66.4961C41.241 66.4961 39.25 68.5046 39.25 70.9823C39.25 73.4599 41.241 75.4684 43.697 75.4684Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_778_18044">
    <rect width="125" height="91" fill="white"/>
    </clipPath>
    </defs>
</svg>
)
type FAQProps = {
  className?: {
    wrapper?: string;
    alignMent?: string;
    widthHeading?: string;
    searchFunctionalityVisiblity?: string;
    modal?: boolean;
  };
  count?: number;
};
export const faqTabs = [
  {
    id: "GeneralQuestion",
    label: "General Questions",
    items: [
      {
        question: "What is a portable juicer?",
        answer:
          "A portable juicer is a compact, rechargeable blending device designed to make fresh juices, smoothies, and shakes anywhere—at home, office, gym, or while traveling.",
      },
      {
        question: "What can I make with a portable juicer?",
        answer:
          "You can make fruit juices, smoothies, protein shakes, milkshakes, baby food, and soft fruit blends. It is best suited for soft fruits and pre-cut ingredients.",
      },
      {
        question: "Is a portable juicer safe to use?",
        answer:
          "Yes. Most portable juicers include built-in safety features such as automatic shut-off and blade protection, ensuring safe operation when used as instructed.",
      },
      {
        question: "Who is a portable juicer ideal for?",
        answer:
          "Portable juicers are ideal for fitness enthusiasts, travelers, office workers, students, and anyone who wants fresh juice on the go.",
      },
    ],
  },

  {
    id: "UsageCare",
    label: "Usage & Care",
    items: [
      {
        question: "How do I use the portable juicer?",
        answer:
          "Simply add chopped fruits and liquid, close the lid securely, and press the power button. The juicer will blend automatically in a few seconds.",
      },
      {
        question: "Can it blend ice or hard fruits?",
        answer:
          "Portable juicers can handle small ice cubes and soft fruits. For best results, avoid hard vegetables or large ice chunks unless specified by the manufacturer.",
      },
      {
        question: "How do I clean the portable juicer?",
        answer:
          "Add water and a drop of mild dish soap, run the blender for a few seconds, then rinse thoroughly. The cup can also be cleaned manually.",
      },
      {
        question: "Is the juicer dishwasher safe?",
        answer:
          "The blending cup may be dishwasher safe, but the motor base should never be submerged in water or placed in a dishwasher.",
      },
    ],
  },

  {
    id: "BatteryCharging",
    label: "Battery & Charging",
    items: [
      {
        question: "How is the portable juicer charged?",
        answer:
          "The portable juicer is charged via a USB cable and can be connected to a power adapter, laptop, or power bank.",
      },
      {
        question: "How long does the battery last?",
        answer:
          "A full charge typically allows multiple blending cycles, depending on usage and ingredients.",
      },
      {
        question: "How long does it take to fully charge?",
        answer:
          "Charging usually takes around 2–3 hours, depending on the power source.",
      },
      {
        question: "Can I use the juicer while charging?",
        answer:
          "For safety reasons, most portable juicers do not operate while charging.",
      },
    ],
  },

  {
    id: "WarrantySupport",
    label: "Warranty & Support",
    items: [
      {
        question: "Does the portable juicer come with a warranty?",
        answer:
          "Yes. The portable juicer comes with a limited manufacturer warranty covering manufacturing defects.",
      },
      {
        question: "What is not covered under warranty?",
        answer:
          "Damage caused by misuse, accidental drops, water damage to the motor, or unauthorized repairs is not covered under warranty.",
      },
      {
        question: "What should I do if my juicer is not working?",
        answer:
          "Ensure the device is fully charged, the lid is properly locked, and ingredients are not overloaded. If the issue persists, contact customer support.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          "You can reach our customer support team through the contact details provided on our website for assistance and warranty claims.",
      },
    ],
  },
];
export default function FAQ({ className = {}, count }: FAQProps) {
    const defaultTab = faqTabs[0].id;
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [searchTerm, setSearchTerm] = useState("");
    const globalFilteredFaq = useMemo(() => {
    if (!searchTerm.trim()) return null;

    const results: {
      tab: string;
      question: string;
      answer: string;
    }[] = [];

    faqTabs.forEach((tab) => {
      tab.items.forEach((item) => {
        if (item.question.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            tab: tab.label,
            question: item.question,
            answer: item.answer,
          });
        }
      });
    });

    return results;
  }, [searchTerm]);
    const activeTabData = faqTabs.find((tab) => tab.id === activeTab);
    return (
        <section className="bg-[#fff] py-10">
            <div className="container mx-auto">
                <div className={`flex flex-col items-${className.alignMent} lg:gap-2 gap-2 flex-wrap lg:mb-4 mb-4`}>
                    <h2 className={`text-center block w-full mb-1 text-[19px] sm:text-[37px] font-bold relative z-[2] font-bold lg:text-${className.alignMent} text-gradient`}>FAQs.</h2>
                      <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                        Check out the common questions or doubts
                      </p>
                </div>
                <SearchFunctionalityFAQ className={`${className.searchFunctionalityVisiblity}`} onSearch={(value) => setSearchTerm(value)}/>
                <Tabs defaultValue="GeneralQuestion" orientation="vertical" className={`grid ${!searchTerm ? "lg:grid-cols-[35%_65%]" : "lg:grid-cols-[75%] grid-cols-[100%] !justify-center"}`} onValueChange={(val) => { setActiveTab(val); setSearchTerm(""); }}>
                    {!searchTerm && (
                        <TabsList className={`flex flex-row lg:flex-col items-stretch *:justify-start border-b-2 border-[#C9C9C9] lg:border-b-0 lg:border-r-2 lg:border-[#C9C9C9] overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto rounded-none`}>
                            {faqTabs.map((tab) => (
                                <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="font-[500] data-[state=active]:font-[700] lg:text-[23px] text-[14px] data-[state=active]:text-[#000] text-[#666666] data-[state=active]:bg-transparent relative before:content-[''] before:absolute before:rounded-none before:opacity-0 data-[state=active]:before:opacity-100 before:transition-opacity before:duration-300 before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-[100%] before:border-b-[3px] before:border-[#000] lg:before:left-0 lg:before:top-1/2 lg:before:-translate-y-1/2 lg:before:translate-x-0 lg:before:h-3/4 lg:before:w-auto lg:before:border-b-0 lg:before:border-l-[3px] lg:mr-3 lg:pr-0 lg:ps-3 mr-3 pr-0 ps-0 hover:text-[#000] hover:font-bold"
                                >
                                {tab.label}
                                </TabsTrigger>
                            ))}
                            <p className="lg:flex hidden font-[700] text-[23px] text-[#000] uppercase mt-3 mb-2">Looking for more?</p>
                            {!className.modal ? <Link href={`/faq`} className="lg:flex hidden uppercase font-[600] text-[19px] rounded-[56px] bg-[#000] px-4 py-2 text-[#fff] w-max">Visit FAQs Page</Link> : 
                            <>
                                
                            </>
                            }
                        </TabsList>
                    )}
                    <div className={`grow ${!searchTerm ? "" : ""}  lg:ps-16 ps-0`}>
                    {searchTerm && (
                        <Accordion type="single" collapsible className="w-full">
                            {globalFilteredFaq && globalFilteredFaq.length > 0 ? (
                            globalFilteredFaq.map((item, i) => (
                                <AccordionItem key={i} value={`search-${i}`} className="cursor-pointer border-b-[2px] border-b-[#C9C9C9] last:border-b-0">
                                  <div onClick={(e) => {const clicked = e.target as HTMLElement;
                        if (clicked.closest('button')) return;
                        const btn = (e.currentTarget as HTMLElement).querySelector('button');
                        if (btn) (btn as HTMLButtonElement).click();}} className="cursor-pointer relative flex lg:flex-row flex-row-reverse items-start w-full before:content-[''] lg:before:w-[33px] before:w-[27px] lg:before:h-[33px] before:h-[27px] before:border-[2px] before:border-[#66666650] before:rounded-[10px] before:flex-shrink-0 before:transition-all before:duration-300 after:content-['+'] after:absolute lg:after:left-[8px] lg:after:top-[12px] lg:after:text-[25px] after:text-[19px] after:text-[#66666650] after:w-[16px] after:text-center after:transition-all after:duration-300 has-[[data-state=open]]:before:bg-[#C8FFFA] has-[[data-state=open]]:before:border-[#057C72] has-[[data-state=open]]:after:content-['−'] has-[[data-state=open]]:after:text-[#057C72] lg:py-4 py-2  after:right-[5px] lg:after:top-[9px] after:top-[7px] text-[19px]">
                                    <div className="lg:ms-5 flex-1 ms-0">
                                      <AccordionTrigger className="text-[#000] font-[500] data-[state=open]:font-[700] text-start lg:text-[23px] lg:p-0 pt-0 pb-0 justify-start flex-1 text-[14px] [&>svg]:hidden">
                                          {item.question}
                                          
                                      </AccordionTrigger>
                                      <AccordionContent className="text-[#666666] font-[400] lg:text-[18px] text-[12px] pb-0 pt-2">
                                          {item.answer}
                                      </AccordionContent>
                                    </div>
                                  </div>
                                </AccordionItem>
                            ))
                            ) : (
                            <div className="flex items-center justify-center gap-4 mt-5 flex-col">
                              {notFoundFAQ}
                              <p className="text-center text-[23px] font-[700] leading-[30px] text-[#000]">Sorry We Couldn’t Find That</p>
                              <p className="text-center text-[18px] font-[400] leading-[28px] text-[#666666]">Sorry, We couldn’t find that. Seems you are asking something we don’t have in our FAQs.</p>
                            </div>
                            )}
                        </Accordion>
                    )}

            {/* NORMAL TAB CONTENT (only when not searching) */}
            {!searchTerm &&
              faqTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  <Accordion type="single" collapsible className="w-full">
                    {activeTabData?.items.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-b-[2px] border-b-[#C9C9C9] last:border-b-0">
                        <div onClick={(e) => {const clicked = e.target as HTMLElement;
                        if (clicked.closest('button')) return;
                        const btn = (e.currentTarget as HTMLElement).querySelector('button');
                        if (btn) (btn as HTMLButtonElement).click();}} className="cursor-pointer relative flex lg:flex-row flex-row-reverse items-start w-full before:content-[''] lg:before:w-[33px] before:w-[27px] lg:before:h-[33px] before:h-[27px] before:border-[2px] before:border-[#66666650] before:rounded-[10px] before:flex-shrink-0 before:transition-all before:duration-300 after:content-['+'] after:absolute lg:after:left-[8px] lg:after:top-[12px] lg:after:text-[25px] after:text-[19px] after:text-[#66666650] after:w-[16px] after:text-center after:transition-all after:duration-300 has-[[data-state=open]]:before:bg-[#C8FFFA] has-[[data-state=open]]:before:border-[#057C72] has-[[data-state=open]]:after:content-['−'] has-[[data-state=open]]:after:text-[#057C72] lg:py-4 py-2  after:right-[5px] lg:after:top-[9px] after:top-[7px] text-[19px]">
                        <div className="lg:ms-5 flex-1 ms-0">
                          <AccordionTrigger className="text-[#000] font-[500] data-[state=open]:font-[700] lg:text-[23px] text-[19px] text-start lg:p-0 pt-0 pb-0 justify-start flex-1 text-[14px] [&>svg]:hidden">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-[#666666] font-[400] lg:text-[18px] text-[12px] pb-0 pt-2">
                            {item.answer}
                          </AccordionContent>
                        </div>
                      </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
                    </div>
                </Tabs>
                <p className="lg:hidden text-center block font-[700] lg:text-[23px] text-[14px] text-[#000] uppercase mt-3 mb-2">Looking for more?</p>
                {!className.modal ? <Link href={`/faq`} className="lg:hidden block uppercase font-[600] lg:text-[19px] rounded-[56px] text-[15px] mx-auto bg-[#000] px-4 py-2 text-[#fff] w-max">Visit FAQs Page</Link> : ""}
                
            </div>
        </section>
    );
};              