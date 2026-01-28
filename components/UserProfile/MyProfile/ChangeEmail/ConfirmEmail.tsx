'use client'

import { useState } from 'react'
import { DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
// import { sendEmailOtp } from '@/lib/api'
import { useCurrentUser } from '@/hooks/use-current-user'

type ConfirmEmailProps = {
    setNewEmail: (email: string) => void;
    openOtp: () => void
    openNewEmail: () => void
}

export default function ConfirmEmail({
    setNewEmail,
    openOtp,
    openNewEmail
}: ConfirmEmailProps) {
    const user = useCurrentUser();

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!user) return null;

    const handleConfirmEmail = async () => {
        setLoading(true)
        setError(null)

        // const res = await sendEmailOtp(user.email)

        setLoading(false)

        // if (!res.status) {
        //     setError(res.message || 'Something went wrong')
        //     return
        // }
        // setNewEmail(user.emailId)
        openOtp()
    }

    return (
        <>
            <div className={`flex justify-between items-start justify-end relative h-[200px] flex xs:px-6 px-4 xs:py-5 py-2`}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_APP_BASE_URL}assets/images/email-vector.svg`}
                    width={1038}
                    height={334}
                    alt="Email"
                    className="w-full absolute inset-0 cover mt-[19px]"
                    unoptimized
                />
                <DialogClose className="text-white opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 z-3">
                    <X size={30} className="fill-[#053E54] xs:fill-white" />
                </DialogClose>
            </div>

            <div className="bg-white xs:px-6 px-4 xs:py-6 py-4">
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="xs:text-[23px] text-md font-bold bg-gradient-to-r from-[#053E54] to-[#057C72] bg-clip-text text-transparent mb-4 uppercase text-center xs:text-start">
                            Confirm This Email
                        </h2>

                        <p className="text-[#666] xs:text-[18px] text-sm text-center xs:text-start mb-6">
                            Do you want to confirm this email or use a different one?
                        </p>

                        {error && (
                            <p className="text-sm text-red-600 mb-4 text-center xs:text-start">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-y-6">
                        <Button
                            onClick={handleConfirmEmail}
                            disabled={loading}
                            className="rounded-[20px] font-semibold bg-[#053E54] hover:bg-[#053E54] text-white px-6 h-[50px] leading-[50px] text-[19px] sm:mt-0 outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 w-full uppercase cursor-pointer"
                        >
                            {loading ? 'Sending OTP...' : 'Confirm this one'}
                        </Button>

                        <Button
                            onClick={openNewEmail}
                            className="font-semibold shadow-none bg-[transparent] hover:bg-[transparent] text-[#053E54] px-6 h-[50px] leading-[50px] text-[19px] sm:mt-0 outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 w-full uppercase cursor-pointer">
                            No, I will use  Different
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
