import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Product {
  id: number;
  title: string;
  description: string;
  media: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "Portable",
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
    media: "/assets/Blender/self_cleaning.mp4",
   
  },
  {
    id: 2,
    title: "Powerful",
     description: `<p>Fit<br/>True wireless In-ear<br/>
      Fit for sport</p>
      <p>EarGels<br/>4 pairs of silicone tips (XS, S,M,L)
      <br/>
      Comply™ Foam tips (M size)
      </p>
      <p>Materials<br/>Aluminium, Polymer, Silicon</p>
      <p>Dust and Waterproof Rating
      <br/>IP57 rating:</p>`,
       media: "/assets/specs/collection-1.jpg",
    
  },
  {
    id: 3,
    title: "USB-C Rechargeable",
    description: `<p>Get 15+ blends from just one hour of charging with any USB port. </p>

<p>The BlendJet 2 portable blender is equipped with a water-resistant USB-C port that makes it easier than ever to power up.<br/>
And the included cable is smartly reversible, so there’s no wrong way to plug it in.</p>

<p>Charging for 20 minutes gives approximately 1½ hour playback.</p>`,
    
    media: "/assets/Blender/portable_charger.mp4",
  },
  {
    id: 4,
    title: "Self Cleaning",
    description: `<p>Battery Life<br/>
Up to 30 hours with charging case at moderate volume</p>

<p>Charging Time<br/>
Earphones: approx. 2 ½ h<br/>
Charging Case (USB-C): 2 h<br/>
Charging Case (Qi Wireless): 2 ½ h</p>

<p>Charging for 20 minutes gives approximately 1½ hour playback.</p>`,
media: "/assets/Blender/self_cleaning.mp4",
    
    
  },
];

type MobileSpecs = {
  className: string;
}
const isVideo = (src: string): boolean => {
  return src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".ogg");
};
const ProductImage = ({ product,index}: { product: Product,index:number}) => {
  const video = isVideo(product.media);

  return (
    <div className="w-full flex items-center justify-center p-12 flex-shrink-0">
      <div className="relative w-full max-w-md">
        {video ? (
          <video src={product.media} autoPlay muted loop playsInline className="w-full h-auto object-contain rounded-xl" />
        ) : (
          <img src={product.media} alt={product.title} className="w-full h-auto object-contain rounded-xl" />
        )}
      </div>
    </div>
  );
};

const ProductDescription = ({ product,index }: { product: Product,index: number }) => (
  <div className="w-full px-8 py-12 flex items-center flex-shrink-0 bg-[#3a4149]">
    <div className="max-w-xl">
      <h3 
        className="text-[36px] font-bold text-white mb-8 leading-tight" 
        dangerouslySetInnerHTML={{ __html: product.title }} 
      />
      <div className="text-[20px] text-[#b8bdc4] text-base leading-relaxed space-y-4 [&_p]:mb-5  [&_p:last-child]:mb-0 [&_strong]:text-white  [&_strong]:font-semibold [&_strong]:block [&_strong]:mb-1 [&_ul]:list-none [&_ul]:space-y-2 [&_li]:pl-0 [&_li]:text-[#b8bdc4] [&_li]:leading-relaxed [&_li:before]:content-['•'] [&_li:before]:mr-3 [&_li:before]:text-white" dangerouslySetInnerHTML={{ __html: product.description }}  />
    </div>
  </div>
);
const MobileSpecs = ({ className }: MobileSpecs) => {
 
  return (
    <>
    <section className={`${className} bg-[#dbd4d463] dark:bg-[#fffffff0] py-10`}>
      <div className='container mx-auto !px-0'>
        <h2 className='text-[28px] text-[#000] text-center font-[600] mb-5'>TECH SPECS</h2>
        <div>
          {products.map((product, index) => (
            <>
            <motion.div  className="w-full flex flex-col bg-[#dbd4d463]">
              <ProductImage key={product.id} product={product} index={index} />
            </motion.div>
            <motion.div className="w-full flex flex-col" >
              <ProductDescription key={product.id} product={product} index={index}/>
            </motion.div>
            </>
          ))}           
                        
        </div>
      </div>
    </section>
    </>
  );
}
export default MobileSpecs