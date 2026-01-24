'use client';
import React, { useState, useEffect } from 'react';

const TableOfContents = ({ data, className }: { data: any[], className: string }) => {
  const [sections, setSections] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState('');

  // 1️⃣ Convert Strapi JSON into dynamic sections
  useEffect(() => {
    if (!data) return;

    const generated = data.map((item) => {
      const titleText = item.title;
      const id = titleText.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');

      return {
        id,
        label: titleText.replace(/^\d+\.\s*/, ""),
        fullTitle: titleText,
        content: item.content,
      };
    });

    setSections(generated);
    if (generated[0]) setActiveSection(generated[0].id);
  }, [data]);

  // 2️⃣ Scroll spy highlight logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // 3️⃣ Smooth scroll to section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-20 md:mt-8">

      {/* Left Sidebar */}
      <div className={`${className} lg:col-span-2 lg:border-r lg:border-r-2 border-r-[#C9C9C9] lg:pr-0`}>
        <div className="sticky top-24">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`cursor-pointer w-full text-left mb-5 lg:pt-0 lg:pl-5 relative group transition-colors ${
                  activeSection === section.id
                    ? "text-[#053E54] font-[700]"
                    : "text-[#666666] font-[600] hover:text-[#053E54] hover:font-[700]"
                }`}
              >
                <span className="lg:text-[19px] relative z-10 leading-normal cursoe-pointer">
                  {section.label}
                </span>

                <div
                  className={`absolute left-0 top-0 bottom-0 w-0.5 h-full transition-all ${
                    activeSection === section.id
                      ? "bg-[#053E54] w-[3px] rounded-[53px]"
                      : ""
                  }`}
                />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Content Area */}
      <div className={`${`toc-content`} lg:col-span-4 space-y-6 lg:space-y-10 pb-5 md:pb-30`} id="content-area" >
        {sections.map((section) => (
          <section id={section.id} key={section.id}>
            <h3 className="text-[14px] lg:text-[19px] lg:leading-[26px] font-[700] text-[#053E54]">
              {section.fullTitle}
            </h3>
            <p
              className="text-[14px] lg:text-[16px] lg:leading-[23px] text-[#666666] mt-2"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </section>
        ))}
      </div>
    </div>
  );
};

export default TableOfContents;
