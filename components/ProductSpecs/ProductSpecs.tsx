'use client'
import { motion } from "framer-motion";
import { product, colorVariants } from "@/data/products";
import black1 from "@/public/assets/Blender/BlackBlender/black1.jpg";
const ProductSpecs = () => (
  <section className="py-14 px-4 bg-[linear-gradient(180deg,hsl(262,40%,98%)_0%,hsl(262,30%,95%)_100%)] text-white relative overflow-hidden">
    {/* Background Elements */}
    <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
    
    <div className="mx-auto relative">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <img 
            src={"/assets/Blender/BlackBlender/black1.jpg"} 
            alt="BlendRas Specs" 
            className="drop-shadow-2xl w-full lg:h-[550px] h-full object-cover select-none cursor-pointer "
          />
        </motion.div>
        
        {/* Specs */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-black/10 text-black/80 text-[18px] font-medium mb-4">
            Technical Details
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-[#000] lg:text-start text-center">
            Tech <span className="text-gradient">Specs</span>
          </h2>
          
          <div className="space-y-0 rounded-2xl overflow-hidden bg-[#fff] border-[2px] border-[#eae8ee] hover:border-[#7c3bed33] hover:shadow-xl transition-all duration-500">
            {product.specs.map((s, i) => (
              <div 
                key={s.label} 
                className={`flex justify-between px-6 py-4 ${
                  i % 2 === 0 ? "bg-black/5" : "bg-transparent"
                }`}
              >
                <span className="font-medium text-black/70">{s.label}</span>
                <span className="text-black font-semibold text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ProductSpecs;
