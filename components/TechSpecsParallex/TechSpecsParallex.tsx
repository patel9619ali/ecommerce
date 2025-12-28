"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring,MotionValue } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"


const items = [
  {
    title: `Included In The Box`,
    desc: `
    <ul>
        <li>Dynasty Headphone</li>
        <li>Aluminium carrying case</li>
        <li>USB-A to USB-C cable</li>
        <li>3.5 mm audio cable</li>
        <li>Flight adaptor</li>
        <li>Microfibre cleaning cloth</li>
        <li>Quick start guide</li>
        <li>Greeting card</li>
        <li>Instruction and care card</li>
    </ul>
    `,
    img: "/assets/specs/collection-1.jpg",
  },
  {
    title: "Sounding",
    desc: `
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
    `,
    img: "/assets/specs/collection-2.jpg",
  },
  { 
    title: "Connectivity", 
    desc: `
     <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>`, 
    img: "/assets/specs/collection-3.jpg",
  },
  { 
    title: "Microphone", 
    desc:  `<p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>
      <p>Noise Isolation <br/>
Passive Noise Cancelling</p>`, 
    img: "/assets/specs/collection-4.jpg",
  },
]

interface SpecCardProps {
  item: typeof items[0]
  index: number
  progress: MotionValue<number>
  total: number
}

function SpecCard({ item, index, progress, total }: SpecCardProps) {
  const start = index / total
  const end = (index + 1) / total

  // RAW transforms
  const opacityRaw = useTransform(
    progress,
    [start - 0.05, start, end - 0.05, end],
    [0, 1, 1, 0]
  )

  const scaleRaw = useTransform(
    progress,
    [start, end],
    [0.95, 1]
  )

  const y = useTransform(
    progress,
    [start, end],
    [60, -60]
  )

  const imageY = useTransform(
    progress,
    [start, end],
    [40, -40]
  )

  // SPRINGS (Shopify-style smoothing)
  const opacity = useSpring(opacityRaw, {
    stiffness: 120,
    damping: 30,
  })

  const scale = useSpring(scaleRaw, {
    stiffness: 120,
    damping: 30,
  })
  return (
    <motion.div 
      style={{ opacity, scale }}
      className="sticky top-24"
    >
      <Card className="overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0 border-[2px] border-[#fff] rounded-xl">
            {/* Image Section */}
            <div className="relative h-64 md:h-96 overflow-hidden">
              <motion.div style={{ y: imageY }} className="absolute inset-0" >
                <img src={item.img}  alt={item.title} className="w-full h-full object-cover scale-110" />
                <div className="absolute inset-0 " />
              </motion.div>
            </div>
            
            {/* Content Section */}
            <motion.div style={{ y }} className="px-4 specification_content_wrapper" >
                <h3 className="text-[38px] font-[700] text-[#fff] mb-4" dangerouslySetInnerHTML={{ __html: item.title }} />

                <div className="" dangerouslySetInnerHTML={{ __html: item.desc }} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function TechSpecsParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"],
})

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section ref={containerRef} className="relative bg-[#000] py-5">
      {/* Background Gradient */}
      

      <div className="container relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-[700] lg:text-[32px] md:text-[28px] text-[#fff] mb-6">
            TECH SPECS
          </h2>
        </motion.div>

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
          <motion.div style={{ width: progressWidth }} className="h-[5px] bg-[#fff]" />
        </div>

        {/* Cards */}
        <div className="space-y-8">
          {items.map((item, index) => (
            <SpecCard
                key={item.title}
                item={item}
                index={index}
                progress={scrollYProgress}
                total={items.length}
            />
            ))}
        </div>
      </div>
    </section>
  )
}


