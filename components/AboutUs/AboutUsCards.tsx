"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const cars = [
    {
        location: "Access to Exclusive Deals",
        img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/Access_to_Exclusive_Fleet_Deals.png`,
    },
    {
        location: "Transparent & Fair Bidding",
        img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/Transparent_Fair_Bidding.png`,
    },
    {
        location: "Expert Guidance",
        img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/Expert_Guidance.png`,
    },
    {
        location: "Wide Selection of Cars",
        img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/Wide_Selection_of_Cars.png`,
    }
];

export default function AboutUsCards() {
    return (
 <section className="bg-gradient-to-b from-[#FFFFFF] to-[rgba(255,255,255,0)] rounded-[63px] py-8">
            <div className={`container mx-auto flex relative flex-col items-center lg:gap-2 gap-2 flex-wrap lg:mb-4 mb-4`}>
                <h2 className={`text-[19px] sm:text-[37px] font-bold relative z-[2] bg-gradient-to-r from-[#053E54] to-[#057C72] bg-clip-text text-transparent xs:mb-6 mb-3 bg-clip-text max-w-3xl lg:text-center text-center lg:leading-[48px] leading-normal`}>Enjoy exclusive deals, transparent bidding, expert guidance, and a wide selection of cars—making it simple to save time</h2>

                {/* Carousel */}
                <Carousel className="w-full">
                    <CarouselContent>
                        {cars.map((car, index) => (
                        <CarouselItem key={index} className="basis-[calc(100%/1.2)] sm:basis-[calc(100%/2)] md:basis-[calc(100%/2.2)] lg:basis-[calc(100%/3.5)] xl:basis-[calc(100%/4)] first:pl-4 pl-5 h-auto">
                            <Card className="p-0 border-none shadow-none bg-transparent gap-0">
                            <CardContent className="rounded-[20px] overflow-hidden border-[#fff] border-[2px] bg-white/40 backdrop-blur-sm shadow-none px-0">
                                <Image src={car.img} alt={car.location} width={250} height={250} className="!w-full h-full object-cover" unoptimized/>
                            </CardContent>
                            <CardContent className="p-4 space-y-2">
                                <h3 className="font-[700] text-[#053e54] text-center sm:text-[27px] text-[17px] uppercase leading-[34px]">
                                {car.location}
                                </h3>
                            </CardContent>
                            </Card>
                        </CarouselItem>
                        ))}
                    </CarouselContent>

                    <div className="flex justify-center gap-2 mt-8">
                        <CarouselPrevious
                        className="
                            ![position:unset] hidden disabled:opacity-0 disabled:pointer-events-none
                            sm:w-[60px] sm:h-[60px] w-[40px] h-[40px]
                            sm:rounded-[20px] rounded-[16px]
                            bg-[#C8FFFA] hover:bg-[#C8FFFA]
                            border border-[2px] border-[#fff]
                        "
                        />
                        <CarouselNext
                        className="![position:unset] hidden disabled:opacity-0 disabled:pointer-events-none sm:w-[60px] sm:h-[60px] w-[40px] h-[40px] sm:rounded-[20px] rounded-[16px] bg-[#C8FFFA] hover:bg-[#C8FFFA] border border-[2px] border-[#fff]"
                        />
                    </div>
                </Carousel>

                <p className={`xs:text-[23px] text-[19px] font-[500] mb-3 max-w-2xl lg:text-center text-center lg:leading-[30px] leading-normal text-[#666666]`}>Quality isn’t just about the cars we sell; it’s about the experience we provide. We treat every transaction as a partnership, ensuring that the process of growing your fleet or finding a reliable ride is as smooth and enjoyable as the drive itself. At Zabeel Cars, your satisfaction is our final destination.</p>
            </div>
        </section>
    );
};