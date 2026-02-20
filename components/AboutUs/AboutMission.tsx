'use client';
import { motion } from "framer-motion";
import lifestyleImage from "@/assets/blendras-lifestyle.jpg";

const stats = [
  { number: "500K+", label: "Happy Customers" },
  { number: "30+", label: "Countries" },
  { number: "4.8★", label: "Average Rating" },
  { number: "2021", label: "Founded" },
];

const AboutMission = () => {
  return (
    <section className="py-24 bg-[#EEF2EF80]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_8px_32px_-8px_rgba(23,43,34,0.08)]">
              <img
                src={"/assets/blendras-lifestyle.jpg"}
                alt="Active person enjoying a Blendras smoothie outdoors"
                className="w-full h-[480px] object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#172B22] mb-6">
              Our Mission
            </h2>
            <p className="text-[#687B72] text-lg font-body leading-relaxed mb-6">
              We started Blendras with a simple idea: everyone deserves access to fresh, 
              nutritious beverages — not just when they're at home, but at the gym, at work, 
              on a hike, or traveling the world.
            </p>
            <p className="text-[#687B72] font-body leading-relaxed mb-10">
              Our team of engineers and nutrition enthusiasts work tirelessly to create 
              portable blenders that are powerful enough for ice, quiet enough for the office, 
              and beautiful enough to carry everywhere. Because healthy habits should be effortless.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-2xl md:text-3xl font-bold text-[#2B9660] mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-[#687B72] font-body">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
