'use client';
import { motion } from "framer-motion";
import { Leaf, Zap, Heart, Recycle } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Fresh First",
    description: "We champion fresh, whole ingredients. Our blenders are engineered to preserve nutrients and maximize flavor from real fruits and vegetables.",
  },
  {
    icon: Zap,
    title: "Power On-The-Go",
    description: "With USB-C charging and powerful motors, Blendras delivers café-quality smoothies in seconds — wherever you are.",
  },
  {
    icon: Heart,
    title: "Built With Care",
    description: "Every Blendras product is crafted with premium BPA-free materials and undergoes rigorous quality testing for your peace of mind.",
  },
  {
    icon: Recycle,
    title: "Sustainably Made",
    description: "We're committed to reducing single-use plastic. One Blendras replaces hundreds of disposable cups and bottles each year.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const AboutUsCards = () => {
  return (
    <section className="py-24 bg-[#F9FBF9]">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#172B22] mb-4">
            What We Stand For
          </h2>
          <p className="text-[#687B72] text-lg max-w-2xl mx-auto font-body">
            Four pillars that drive everything we create at Blendras.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={item}
              className="group p-8 rounded-2xl bg-[#FFFFFF] border border-[#DCE4DE] hover:border-[#2B966050] transition-all duration-300 shadow-[0_4px_24px_-4px_rgba(43,150,96,0.12)]"
            >
              <div className="w-14 h-14 rounded-xl bg-[#E0F0E8] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-7 h-7 text-[#2B9660]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#172B22] mb-3">
                {value.title}
              </h3>
              <p className="text-[#687B72] font-body leading-relaxed text-sm">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsCards;
