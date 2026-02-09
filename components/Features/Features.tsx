"use client";

import { motion } from "framer-motion";
import { Zap, Fan, BatteryCharging, Droplets, Cpu, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Ultra Portable",
    description: "Weighs just 385g. Perfect for gym, office, travel, or outdoor adventures.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Fan,
    title: "6-Blade Power",
    description: "304 stainless steel blades at 22,000 RPM crush ice and blend tough fruits effortlessly.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: BatteryCharging,
    title: "USB-C Fast Charge",
    description: "2000mAh battery provides 15+ blends per charge. Full charge in just 2-3 hours.",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Droplets,
    title: "Self-Cleaning",
    description: "Add water and a drop of soap, press blend, rinse. Clean in seconds.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Cpu,
    title: "Smart Safety",
    description: "Magnetic safety switch ensures blending only when lid is properly secured.",
    color: "from-rose-400 to-red-500",
  },
  {
    icon: Shield,
    title: "BPA-Free",
    description: "Made with food-grade Tritan plastic. Safe for you and your family.",
    color: "from-teal-400 to-cyan-500",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-14 px-4 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Designed for <span className="text-gradient-accent">Performance</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Every detail engineered for the perfect blend, every time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-[#fff] border border-[#eae8ee80] hover:border-[#7c3bed33] hover:shadow-xl transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
