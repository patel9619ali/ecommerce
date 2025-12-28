import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "Included In The Box",
    description: `<ul>
        <li>Dynasty Headphone</li>
        <li>Aluminium carrying case</li>
        <li>USB-A to USB-C cable</li>
        <li>3.5 mm audio cable</li>
        <li>Flight adaptor</li>
        <li>Microfibre cleaning cloth</li>
        <li>Quick start guide</li>
        <li>Greeting card</li>
        <li>Instruction and care card</li>
    </ul>`,
    image: "/assets/specs/collection-1.jpg",
  },
  {
    id: 2,
    title: "Sounding",
     description: `<p>Fit<br/>True wireless In-ear<br/>
Fit for sport</p>
<p>EarGels<br/>4 pairs of silicone tips (XS, S,M,L)
<br/>
Comply™ Foam tips (M size)
</p>
<p>Materials<br/>Aluminium, Polymer, Silicon</p>
<p>Dust and Waterproof Rating
<br/>IP57 rating:</p>`,
    image: "/assets/specs/collection-2.jpg",
  },
  {
    id: 3,
    title: "Design",
    description: `<p>Battery Life<br/>
Up to 30 hours with charging case at moderate volume</p>

<p>Charging Time<br/>
Earphones: approx. 2 ½ h<br/>
Charging Case (USB-C): 2 h<br/>
Charging Case (Qi Wireless): 2 ½ h</p>

<p>Charging for 20 minutes gives approximately 1½ hour playback.</p>`,
    image: "/assets/specs/collection-3.jpg",
  },
  {
    id: 4,
    title: "Battery",
    description: `<p>Battery Life<br/>
Up to 30 hours with charging case at moderate volume</p>

<p>Charging Time<br/>
Earphones: approx. 2 ½ h<br/>
Charging Case (USB-C): 2 h<br/>
Charging Case (Qi Wireless): 2 ½ h</p>

<p>Charging for 20 minutes gives approximately 1½ hour playback.</p>`,
    image: "/assets/specs/collection-4.jpg",
  },
];

const ProductImage = ({ product, index }: { product: Product; index: number }) => (
  <div className="h-screen w-full flex items-center justify-center p-12 flex-shrink-0">
    <div className="relative w-full max-w-md">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-auto object-contain rounded-xl" 
      />
    </div>
  </div>
);

const ProductDescription = ({ product }: { product: Product }) => (
  <div className="h-screen w-full px-16 py-12 flex items-center flex-shrink-0 bg-[#3a4149]">
    <div className="max-w-xl">
      <h3 
        className="text-[42px] font-bold text-white mb-8 leading-tight" 
        dangerouslySetInnerHTML={{ __html: product.title }} 
      />
      <div 
        className="text-[#b8bdc4] text-base leading-relaxed space-y-4
        [&_p]:mb-5 
        [&_p:last-child]:mb-0
        [&_strong]:text-white 
        [&_strong]:font-semibold
        [&_strong]:block
        [&_strong]:mb-1
        [&_ul]:list-none
        [&_ul]:space-y-2
        [&_li]:pl-0
        [&_li]:text-[#b8bdc4]
        [&_li]:leading-relaxed
        [&_li:before]:content-['•']
        [&_li:before]:mr-3
        [&_li:before]:text-white"
        dangerouslySetInnerHTML={{ __html: product.description }} 
      />
    </div>
  </div>
);

export default function DualSpecsScroll() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], ["0%", "-300%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["-300%", "0%"]);

  return (
    <>
    <section className='bg-[#000] py-10'>
      <div className='container mx-auto'>
        <h2 className='text-[40px] text-[#fff] text-center font-[600] mb-5'>TECH SPECS</h2>
        <div ref={containerRef} className="relative" style={{ height: `${products.length * 100}vh` }} >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <div className="flex h-full">
                  <motion.div
                style={{ y: rightY }}
                className="w-1/2 flex flex-col"
              >
                {products.map((product) => (
                  <ProductDescription key={product.id} product={product} />
                ))}
              </motion.div>
              <motion.div
                style={{ y: leftY }}
                className="w-1/2 flex flex-col bg-black"
              >
                {products.map((product, index) => (
                  <ProductImage key={product.id} product={product} index={index} />
                ))}
              </motion.div>

            
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}