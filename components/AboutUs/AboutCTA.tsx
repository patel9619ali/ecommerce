'use client';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AboutCTA = () => {
  return (
    <section className="py-24 bg-[#F9FBF9]">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
          style={{ background: "linear-gradient(135deg, #2B9660, #3AAE74)" }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#FFFFFF] mb-4">
            Ready to Blend On-The-Go?
          </h2>
          <p className="text-[#FFFFFFcc] text-lg font-body max-w-xl mx-auto mb-8">
            Join over 500,000 people who made the switch to portable, fresh nutrition with Blendras.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FFFFFF] text-[#172B22] font-body font-semibold text-lg transition-shadow hover:shadow-lg"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <div className="absolute top-6 left-6 w-20 h-20 rounded-full bg-[#FFFFFF1a]" />
          <div className="absolute bottom-8 right-10 w-32 h-32 rounded-full bg-[#FFFFFF0d]" />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutCTA;
