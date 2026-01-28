"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type DocumentsListsProps = {
    setOpenManageDocuments: (open: boolean) => void;
    openUpdatingLoader: () => void;
    openVerifiedDocuments: () => void;
};

export default function DocumentsLists({ setOpenManageDocuments, openUpdatingLoader, openVerifiedDocuments }: DocumentsListsProps) {
    const [selectedDoc, setSelectedDoc] = useState<"passport" | "emirates" | "license">("passport");
    const [frontPage, setFrontPage] = useState<File | null>(null);
    const [backPage, setBackPage] = useState<File | null>(null);
    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const [previewName, setPreviewName] = useState<string>("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowed = ["image/png", "image/jpeg", "application/pdf"];
        if (!allowed.includes(file.type)) {
            alert("Only PNG, JPEG and PDF allowed!");
            return;
        }

        setter(file);
    };

    useEffect(() => {
        async function loadFile(url: string): Promise<File> {
            const fileName = url.split("/").pop()?.split("?")[0] || "file.png";
            const res = await fetch(url);
            const blob = await res.blob();
            return new File([blob], fileName, { type: blob.type });
        }

        async function preloadImages() {
            const frontUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/assets/images/banner-image.png`;
            const backUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/assets/images/banner-image.png`;

            const frontFile = await loadFile(frontUrl);
            const backFile = await loadFile(backUrl);

            setFrontPage(frontFile);
            setBackPage(backFile);
        }

        preloadImages();
    }, []);

    const isSubmitEnabled = frontPage !== null && backPage !== null;

    return (
        <>
            {/* Header */}
            <div className="items-center justify-between relative flex gap-6 xs:px-6 px-4 xs:py-5 py-2">
                <h2 className="text-white xs:text-[23px] text-md font-semibold">
                    Manage Documents
                </h2>
                <Button
                    onClick={() => setOpenManageDocuments(false)}
                    className="text-white bg-transparent hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3"
                >
                    <X className="!w-8 !h-8" />
                </Button>
            </div>

            <div className="bg-white h-full xs:px-6 px-4 py-6 xs:pb-[30px] pb-[130px] overflow-y-auto custom-scroll">
                <div>
                    {/* Titles */}
                    <p className="text-[#666666] xs:text-[18px] text-[14px] mb-2">
                        Choose a document (We accept PNG, JPEG, PDF Only)
                    </p>

                    {/* Document Type Selection */}
                    <div className="flex xs:flex-row flex-col gap-4 mb-6">

                        {/* Single Box Component */}
                        {[
                            { key: "passport", label: "Passport", icon: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/assets/images/passport-icon.svg` },
                            { key: "emirates", label: "Emirates ID", icon: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/assets/images/id-card-icon.svg` },
                            { key: "license", label: "Driving License", icon: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/assets/images/driving-license-icon.svg` },
                        ].map((doc) => (
                            <div
                                key={doc.key}
                                onClick={() => setSelectedDoc(doc.key as any)}
                                className={`flex-1 py-4 xs:px-2 px-4 rounded-[20px] cursor-pointer border-[2px] relative xs:min-h-[140px]
                                ${selectedDoc === doc.key
                                        ? "bg-[#C8FFFA] border-[#053E54]"
                                        : "bg-white border-[#C9C9C9]"
                                    }`}
                            >
                                {selectedDoc === doc.key ? (
                                    <div className="absolute xs:top-3 xs:translate-y-[unset] top-1/2 translate-y-[-50%] right-3 w-6 h-6 rounded-full bg-[#057C72] flex items-center justify-center">
                                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                            <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="absolute xs:top-3 xs:translate-y-[unset] top-1/2 translate-y-[-50%] right-3 w-6 h-6 rounded-full border border-[#C9C9C9]" />
                                )}

                                <div className="flex xs:flex-col flex-row items-center xs:gap-1 gap-2 h-full xs:justify-end">
                                    <div className="flex justify-center xs:w-full">
                                        <img src={doc.icon} className="w-10" />
                                    </div>
                                    <div className="relative">
                                        <span className="inline-block xs:text-[16px] text-[14px] font-semibold text-[#053E54]">{doc.label}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upload Front Page */}
                    <div className="flex justify-between items-center mb-8 gap-2">
                        <div className="text-[#666666] xs:text-[18px] text-[14px]">
                            {!frontPage ? (
                                <span>
                                    Upload {selectedDoc === "passport" ? "Passport" : selectedDoc === "emirates" ? "Emirates ID" : "License"} Front Page
                                </span>
                            ) : (
                                <span className="text-[#053E54] xs:text-[19px] text-[16px] font-semibold break-all">{frontPage.name}</span>
                            )}
                        </div>

                        {!frontPage ? (
                            <label className="w-[110px] h-[40px] rounded-[20px] border border-[#C9C9C9] flex items-center justify-center text-[#053E54] cursor-pointer font-semibold">
                                Upload
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, setFrontPage)}
                                />
                            </label>
                        ) : (
                            <div className="flex justify-between items-center py-2">
                                <div className="flex gap-3">
                                    <div
                                        onClick={() => {
                                            setPreviewFile(URL.createObjectURL(frontPage));
                                            setPreviewName(frontPage.name);
                                        }}
                                        className="p-2 border border-[#C9C9C9] rounded-[10px] w-10 h-10 flex items-center justify-center cursor-pointer">
                                        <svg width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.3077 3.88858C13.2596 3.88858 14.8419 5.47091 14.8419 7.4228C14.8419 9.3747 13.2596 10.957 11.3077 10.957C9.35576 10.957 7.77344 9.3747 7.77344 7.4228C7.77344 5.47091 9.35576 3.88858 11.3077 3.88858Z" fill="#053E54" />
                                            <path d="M22.2721 8.39912C19.5954 11.6829 15.5436 14.8438 11.3096 14.8438C7.07473 14.8438 3.02196 11.6807 0.347028 8.39912C-0.115676 7.83173 -0.115676 7.00803 0.347028 6.44064C1.01954 5.61561 2.42941 4.02302 4.31244 2.63148C9.05478 -0.873292 13.5539 -0.881025 18.3067 2.63148C20.1898 4.02302 21.5996 5.61561 22.2721 6.44064C22.7335 7.00693 22.7359 7.82987 22.2721 8.39912ZM11.3096 12.3691C13.9979 12.3691 16.1847 10.149 16.1847 7.41988C16.1847 4.69072 13.9979 2.47063 11.3096 2.47063C8.62129 2.47063 6.43443 4.69072 6.43443 7.41988C6.43443 10.149 8.62129 12.3691 11.3096 12.3691Z" fill="#053E54" />
                                        </svg>
                                    </div>
                                    <div
                                        onClick={() => setFrontPage(null)}
                                        className="p-2 border border-[#C9C9C9] rounded-[10px] w-10 h-10 flex items-center justify-center cursor-pointer">
                                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.1875 1.12501H10.9687L10.6383 0.467574C10.4955 0.180906 10.2027 -0.000245852 9.8824 6.14821e-06H5.86408C5.5444 -0.00121785 5.25215 0.180402 5.11175 0.467574L4.78127 1.12501H0.5625C0.251856 1.12501 0 1.37686 0 1.68751V2.81251C0 3.12315 0.251856 3.37501 0.5625 3.37501H15.1875C15.4981 3.37501 15.75 3.12315 15.75 2.81251V1.68751C15.75 1.37686 15.4981 1.12501 15.1875 1.12501Z" fill="#053E54" />
                                            <path d="M1.87031 16.418C1.926 17.3072 2.66335 17.9999 3.55428 18H12.1957C13.0866 17.9999 13.824 17.3072 13.8797 16.418L14.625 4.5H1.125L1.87031 16.418Z" fill="#053E54" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upload Back/Visa Page */}
                    <div className="flex justify-between items-center mb-8 gap-2">
                        <div className="text-[#666666] xs:text-[18px] text-[14px]">
                            {!backPage ? (
                                <span>
                                    Upload {selectedDoc === "passport" ? "Passport Visa Page" : "Back Side Document"}
                                </span>
                            ) : (
                                <span className="text-[#053E54] xs:text-[19px] text-[16px] font-semibold break-all">{backPage.name}</span>
                            )}
                        </div>

                        {!backPage ? (
                            <label className="w-[110px] h-[40px] rounded-[20px] border border-[#C9C9C9] flex items-center justify-center text-[#053E54] cursor-pointer font-semibold">
                                Upload
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, setBackPage)}
                                />
                            </label>
                        ) : (
                            <div className="flex justify-between items-center py-2">
                                <div className="flex gap-3">
                                    <div
                                        onClick={() => {
                                            setPreviewFile(URL.createObjectURL(backPage));
                                            setPreviewName(backPage.name);
                                        }}
                                        className="p-2 border border-[#C9C9C9] rounded-[10px] w-10 h-10 flex items-center justify-center cursor-pointer">
                                        <svg width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.3077 3.88858C13.2596 3.88858 14.8419 5.47091 14.8419 7.4228C14.8419 9.3747 13.2596 10.957 11.3077 10.957C9.35576 10.957 7.77344 9.3747 7.77344 7.4228C7.77344 5.47091 9.35576 3.88858 11.3077 3.88858Z" fill="#053E54" />
                                            <path d="M22.2721 8.39912C19.5954 11.6829 15.5436 14.8438 11.3096 14.8438C7.07473 14.8438 3.02196 11.6807 0.347028 8.39912C-0.115676 7.83173 -0.115676 7.00803 0.347028 6.44064C1.01954 5.61561 2.42941 4.02302 4.31244 2.63148C9.05478 -0.873292 13.5539 -0.881025 18.3067 2.63148C20.1898 4.02302 21.5996 5.61561 22.2721 6.44064C22.7335 7.00693 22.7359 7.82987 22.2721 8.39912ZM11.3096 12.3691C13.9979 12.3691 16.1847 10.149 16.1847 7.41988C16.1847 4.69072 13.9979 2.47063 11.3096 2.47063C8.62129 2.47063 6.43443 4.69072 6.43443 7.41988C6.43443 10.149 8.62129 12.3691 11.3096 12.3691Z" fill="#053E54" />
                                        </svg>
                                    </div>
                                    <div
                                        onClick={() => setBackPage(null)}
                                        className="p-2 border border-[#C9C9C9] rounded-[10px] w-10 h-10 flex items-center justify-center cursor-pointer">
                                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.1875 1.12501H10.9687L10.6383 0.467574C10.4955 0.180906 10.2027 -0.000245852 9.8824 6.14821e-06H5.86408C5.5444 -0.00121785 5.25215 0.180402 5.11175 0.467574L4.78127 1.12501H0.5625C0.251856 1.12501 0 1.37686 0 1.68751V2.81251C0 3.12315 0.251856 3.37501 0.5625 3.37501H15.1875C15.4981 3.37501 15.75 3.12315 15.75 2.81251V1.68751C15.75 1.37686 15.4981 1.12501 15.1875 1.12501Z" fill="#053E54" />
                                            <path d="M1.87031 16.418C1.926 17.3072 2.66335 17.9999 3.55428 18H12.1957C13.0866 17.9999 13.824 17.3072 13.8797 16.418L14.625 4.5H1.125L1.87031 16.418Z" fill="#053E54" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="sticky bottom-0 border-t border-t-[#C9C9C9] shadow-[0px_-2px_4px_0px_#0000001A] xs:px-6 px-4 py-4 bg-white">
                <button
                    disabled={!isSubmitEnabled}
                    onClick={() => {
                        openUpdatingLoader();
                        setTimeout(() => {
                            openVerifiedDocuments();
                        }, 3000);
                    }}
                    className={`w-full h-[50px] rounded-[20px] font-semibold text-[19px] cursor-pointer
                        ${isSubmitEnabled ? "bg-[#053E54] text-white" : "bg-[#C9C9C9] text-white opacity-60"}
                    `}
                >
                    UPDATE
                </button>
            </div>

            {/* Preview uploaded files */}
            {previewFile && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]">
                    <div className="bg-white w-full max-w-full h-full relative">

                        {/* Header */}
                        <div className="bg-[#053E54] items-center relative flex justify-between items-center xs:px-6 px-4 xs:py-5 py-2 gap-2">
                            <p className="text-white xs:text-[23px] text-md font-semibold break-all">
                                {previewName}
                            </p>

                            {/* Close Button */}
                            <Button
                                onClick={() => setPreviewFile(null)}
                                className="text-white bg-transparent hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
                                <X className="!w-8 !h-8" />
                            </Button>
                        </div>

                        {/* Preview Body */}
                        <div className="xs:px-6 px-4 xs:py-6 py-4">
                            <div className="xs:max-h-[420px] xs:min-h-[420px] max-h-[80vh] min-h-[80vh] overflow-y-auto custom-scroll">
                                {/* If PDF */}
                                {previewName.toLowerCase().endsWith(".pdf") ? (
                                    <iframe
                                        src={previewFile}
                                        className="w-full xs:h-[420px] h-[80vh]"
                                    ></iframe>
                                ) : (
                                    /* If Image */
                                    <img
                                        src={previewFile}
                                        className="w-full object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}