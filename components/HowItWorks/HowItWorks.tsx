'use client'
import { motion } from "framer-motion";
import { BatteryCharging, Apple, Play } from "lucide-react";

const steps = [
  {
    icon: BatteryCharging,
    step: "01",
    title: "Charge Up",
    description: "Connect the USB-C cable and fully charge your BlendRas in 2-3 hours.",
    gradient: "from-primary to-purple-600",
  },
  {
    icon: Apple,
    step: "02",
    title: "Add Ingredients",
    description: "Drop in your favorite fruits, add some liquid, and secure the lid tight.",
    gradient: "from-accent to-teal-500",
  },
  {
    icon: Play,
    step: "03",
    title: "Press & Blend",
    description: "Double-tap the power button and enjoy a fresh smoothie in 30 seconds.",
    gradient: "from-pink-500 to-rose-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-14 px-4 bg-[#fff] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple & Easy
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Three simple steps to your perfect blend. It's that easy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-[linear-gradient(to_right,hsl(262_83%_58%_/_0.3),transparent)] from-[#7c3bed4d] to-transparent" />
              )}
              
              <div className="relative inline-flex flex-col items-center">
                {/* Step Number */}
                <span className="text-7xl font-bold text-[#00000014] mb-4">{step.step}</span>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground max-w-xs">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
