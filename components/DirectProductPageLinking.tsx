'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import LoadingLink from "./Loader/LoadingLink";
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
export default function DirectProductPageLinking() {
  return (
    <>
      <section className="py-16 md:py-24 bg-[#fff]">
        <div className="container px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] rounded-3xl p-8 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Blend Fresh?</h2>
            <p className="text-white/80 max-w-md mx-auto mb-8">Join 50,000+ happy customers who blend on the go every day.</p>
            <Button asChild size="lg" className="bg-white text-[#020817] hover:bg-white/90 rounded-full px-8 h-12 text-base font-semibold">
              <LoadingLink href="/products">
                Shop All Products <ChevronRight className="h-4 w-4 ml-1" />
              </LoadingLink>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}