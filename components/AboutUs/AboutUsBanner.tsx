'use client';
import { motion } from "framer-motion";
import heroImage from "@/assets/Blender/BlackBlender/black1.jpg";

const AboutUsBanner = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32" style={{ background: "linear-gradient(135deg, rgba(43,150,96,0.08), rgba(224,138,40,0.06))" }}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E0F0E8] text-[#205040] text-sm font-medium font-body mb-6">
              Our Story
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#172B22] leading-tight mb-6">
              Blend Your Life,{" "}
              <span className="text-[#2B9660]">Anywhere.</span>
            </h1>
            <p className="text-lg text-[#687B72] font-body leading-relaxed max-w-lg">
              At Blendras, we believe healthy living shouldn't stop when you leave your kitchen. 
              Our portable juicers are designed for people who refuse to compromise on nutrition — 
              no matter where life takes them.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_8px_32px_-8px_rgba(23,43,34,0.08)]">
              <img
                src={"/assets/Blender/BlackBlender/black1.jpg"}
                alt="Blendras portable juicer surrounded by fresh fruits"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#E08A2833] animate-float" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#2B966026] animate-float" style={{ animationDelay: "2s" }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsBanner;
