"use client"

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { reviews } from "@/data/products";

const Reviews = () => {
  return (
    <section id="reviews" className="py-14 px-4 bg-[linear-gradient(180deg,hsl(262,40%,98%)_0%,hsl(262,30%,95%)_100%)] relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Customer Love
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What People <span className="text-gradient">Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Join 2,000+ happy customers who blend fresh every day.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-6 rounded-3xl bg-[#fff] border-[2px] border-[#eae8ee] hover:border-[#7c3bed33] hover:shadow-xl transition-all duration-500"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-foreground/80 mb-6 leading-relaxed">"{review.text}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-muted-foreground text-xs">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
