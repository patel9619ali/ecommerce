import { Check } from "lucide-react";

type VerifiedEmailProps = {
    setOpenChangePhone: (open: boolean) => void;
}

export default function PhoneChanged({ setOpenChangePhone }: VerifiedEmailProps) {
    return (
        <>
            <div className=" flex items-center justify-center xs:px-6 px-4 py-10">
                <div className="w-[92px] h-[92px] flex items-center justify-center border border-[3px] border-[#053E5433] bg-[#C8FFFA] rounded-full">
                    <Check size={50} color="#057C72" />
                </div>
            </div>

            <div className="bg-white xs:px-6 px-4 xs:py-6 py-4 h-full">
                <div className="xs:pb-0 pb-0 flex flex-col justify-between xs:h-auto h-full">
                    <div>
                        <div className="relative xs:text-start text-center">
                            <h2 className="text-md xs:text-[23px] font-bold bg-gradient-to-r from-[#053E54] to-[#057C72] bg-clip-text text-transparent xs:mb-4 inline-block">Your Mobile Number Changed</h2>
                        </div>
                        <p className="text-[#666666] xs:text-[18px] text-sm font-400 xs:text-start text-center xs:mb-6">Your mobile number has been changed successfully.</p>
                    </div>
                    <div className="sticky bottom-0 pb-[20px] xs:mt-5 xs:[position:unset] xs:[bottom:unset] xs:pb-0">
                        <button
                            onClick={() => setOpenChangePhone(false)}
                            className="w-full h-[50px] bg-[#053E54] rounded-[20px] text-white font-semibold text-[19px] cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}