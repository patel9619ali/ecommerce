"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <>
            <aside className="md:block hidden md:sticky md:top-25 w-full h-max p-5 bg-white rounded-[20px] border border-[#C9C9C9]">
                {/* Profile Section */}
                <h2 className="text-[#053E54] text-[19px] font-bold mb-2">Profile</h2>

                <Link
                    href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}user-profile/my-profile`}
                    className={`flex items-center gap-3 ${pathname === "/user-profile/my-profile" ? "bg-[#053E54] text-white border-[#053E54]" : "text-[#053e54] border-[#C9C9C9]"} px-4 py-3 rounded-[20px] mb-6 border`}
                >
                    <div className={`flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px] ${pathname === "/user-profile/my-profile" ? "bg-white" : "bg-[#C8FFFA]"}`}>
                        <svg width="15" height="17" viewBox="0 0 15 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.08984 0C4.74424 0 2.83594 1.9083 2.83594 4.2539C2.83594 6.5995 4.74424 8.5078 7.08984 8.5078C9.43544 8.5078 11.3437 6.5995 11.3437 4.2539C11.3437 1.9083 9.43544 0 7.08984 0Z" />
                            <path d="M12.3825 11.2867C11.2179 10.1042 9.67397 9.453 8.03515 9.453H6.14452C4.50573 9.453 2.96179 10.1042 1.79716 11.2867C0.638243 12.4635 0 14.0167 0 15.6605C0 15.9216 0.211624 16.1332 0.472656 16.1332H13.707C13.968 16.1332 14.1797 15.9216 14.1797 15.6605C14.1797 14.0167 13.5414 12.4635 12.3825 11.2867Z" />
                        </svg>
                    </div>
                    <span className="text-[16px] font-semibold uppercase whitespace-nowrap">My Profile</span>
                </Link>

                <Card className="rounded-[20px] py-0 shadow-none border-[#C9C9C9]">
                    <CardContent className="p-0">

                        <Link
                            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}user-profile/my-wishlist`}
                            className={`flex items-center gap-3 ${pathname === "/user-profile/my-wishlist" ? "bg-[#053E54] text-white border-[#053E54] rounded-b-[20px]" : "text-[#053e54] border-[#C9C9C9]"} px-4 py-3 border-b last:border-none`}
                        >
                            <div className={`flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px] ${pathname === "/user-profile/my-wishlist" ? "bg-white" : "bg-[#C8FFFA]"}`}>
                                <svg width="16" height="13" viewBox="0 0 16 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.99999 13C7.91905 13 7.83815 12.9804 7.76565 12.941C7.6869 12.8983 5.81594 11.8778 3.91813 10.3401C2.79332 9.42874 1.89545 8.52482 1.24951 7.65348C0.413642 6.52597 -0.00670047 5.44143 8.07524e-05 4.42997C0.00801823 3.25302 0.456735 2.14617 1.26367 1.31329C2.08423 0.466377 3.17929 0 4.34719 0C5.84397 0 7.21243 0.787669 8.00002 2.03543C8.78761 0.787698 10.1561 0 11.6529 0C12.7562 0 13.8089 0.420814 14.6172 1.18494C15.5042 2.02348 16.0082 3.2083 15.9999 4.43555C15.9931 5.44525 15.5649 6.52814 14.7272 7.6541C14.0792 8.525 13.1826 9.42851 12.0622 10.3396C10.1713 11.8772 8.3138 12.8977 8.23565 12.9403C8.1628 12.9801 8.08137 13 7.99999 13Z" />
                                </svg>
                            </div>
                            <span className="text-[16px] font-semibold uppercase whitespace-nowrap">My Wishlist</span>
                        </Link>
                    </CardContent>
                </Card>
            </aside>

            {/* Mobile sidebar */}
            <div className="md:hidden block">
                {/* Bidding */}
                {/* <Card className="mb-5 w-full h-max p-5 bg-white rounded-[20px] border border-[#C9C9C9] shadow-none">
                    <CardContent className="p-0">
                        <h2 className="text-[#053E54] text-[14px] font-bold mb-2">Bidding</h2>
                        <Link
                            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}user-profile/bidding-history`}
                            className={`flex items-center gap-3 pt-3 first:pt-0 pb-3 last:pb-0 border-b last:border-none text-[#053e54]`}
                        >
                            <div className={`flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px] bg-[#C8FFFA]`}>
                                <svg width="16" height="13" viewBox="0 0 16 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.8151 12.4444H6.40797C6.30568 12.4444 6.22266 12.3728 6.22266 12.2848V10.8263C6.22266 10.7381 6.30568 10.6666 6.40797 10.6666H15.8151C15.9174 10.6666 16.0004 10.7382 16.0004 10.8263V12.2848C16.0004 12.3728 15.9174 12.4444 15.8151 12.4444Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14.924 10.6667H7.29476C7.19243 10.6667 7.10938 10.5951 7.10938 10.5071V9.04856C7.10938 8.96044 7.19243 8.88892 7.29476 8.88892H14.924C15.0263 8.88892 15.1094 8.96052 15.1094 9.04856V10.5071C15.1095 10.5952 15.0263 10.6667 14.924 10.6667Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.1742 6.22225H9.05154C8.96271 6.22225 8.89062 6.13651 8.89062 6.03108V1.08008C8.89062 0.974558 8.96279 0.888916 9.05154 0.888916H13.1742C13.263 0.888916 13.3351 0.974558 13.3351 1.08008V6.03089C13.3351 6.13642 13.2629 6.22215 13.1742 6.22215V6.22225Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.7696 1.77778H8.45255C8.2031 1.77778 8 1.55012 8 1.27027V0.507618C8 0.227871 8.20301 0 8.45255 0H13.7696C14.019 0 14.2222 0.227659 14.2222 0.507618V1.27027C14.2221 1.55022 14.0191 1.77778 13.7696 1.77778Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.7696 8.00001H8.45255C8.2031 8.00001 8 7.77224 8 7.49249V6.72964C8 6.44989 8.20301 6.22223 8.45255 6.22223H13.7696C14.019 6.22223 14.2222 6.44989 14.2222 6.72964V7.49249C14.2221 7.77224 14.0191 8.00001 13.7696 8.00001Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.80647 4.44438H5.13233C5.15649 4.39163 5.16993 4.334 5.16993 4.27357V2.83741C5.16993 2.77706 5.15659 2.71944 5.13233 2.66669H7.80666C7.91338 2.66669 8 2.74317 8 2.83741V4.27365C7.99981 4.36789 7.91338 4.44438 7.80647 4.44438ZM2.86748 4.44438H1.00661C0.451636 4.44438 0 4.04573 0 3.55566C0 3.06559 0.451539 2.66677 1.00661 2.66677H2.86748C2.84331 2.71953 2.82988 2.77715 2.82988 2.8375V4.27365C2.82988 4.334 2.84331 4.39171 2.86748 4.44446V4.44438Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4.24304 4.4444H2.87068C2.75878 4.4444 2.66797 4.36791 2.66797 4.27366V2.83737C2.66797 2.74312 2.75878 2.66663 2.87068 2.66663H4.24304C4.35493 2.66663 4.44575 2.74312 4.44575 2.83737V4.27366C4.44575 4.36808 4.35493 4.4444 4.24304 4.4444Z" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-semibold uppercase whitespace-nowrap">Bidding History</span>
                        </Link>

                        <Link
                            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}user-profile/my-winnings`}
                            className={`flex items-center gap-3 pt-3 first:pt-0 pb-3 last:pb-0 border-b last:border-none text-[#053e54]`}
                        >
                            <div className={`flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px] bg-[#C8FFFA]`}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.165 1.15623C12.8938 0.868025 12.509 0.70187 12.1123 0.70187H10.8492C10.8543 0.47469 10.8577 0.240756 10.8577 0H2.71169C2.71169 0.240723 2.71507 0.47469 2.72017 0.70187H1.44867C1.05196 0.70187 0.667137 0.868025 0.395885 1.15623C0.121223 1.44616 -0.0211575 1.84284 0.00255055 2.24465C0.22973 6.03201 2.18445 8.40884 5.28348 8.76148L4.68333 10.8501C3.96961 10.8501 3.39151 11.4282 3.39151 12.1419V13.5626H10.1796V12.1419C10.1796 11.4282 9.60149 10.8501 8.88776 10.8501L8.28761 8.76148C11.3799 8.40546 13.3329 6.03032 13.5584 2.24465C13.5821 1.84456 13.4397 1.44785 13.165 1.15623ZM1.35712 2.16326C1.35543 2.12598 1.3707 2.10055 1.38424 2.08697C1.40967 2.05985 1.4402 2.05985 1.44867 2.05985H2.7846C2.98635 4.72661 3.57462 6.23882 4.14596 7.09327C1.97085 6.18117 1.45205 3.74501 1.35712 2.16326ZM9.42348 7.08817C9.99479 6.23203 10.5814 4.72151 10.7831 2.05816H12.1139C12.1241 2.05816 12.153 2.05816 12.1784 2.08528C12.192 2.09886 12.2072 2.12429 12.2055 2.16157C12.1089 3.74332 11.5918 6.1727 9.42348 7.08817Z" />
                                </svg>

                            </div>
                            <span className="text-[14px] font-semibold uppercase whitespace-nowrap">My Winnings</span>
                        </Link>
                    </CardContent>
                </Card> */}

                {/* Direct Sale */}
                <Card className="mb-5 w-full h-max p-5 bg-white rounded-[20px] border border-[#C9C9C9] shadow-none">
                    <CardContent className="p-0">
                        <h2 className="text-[#053E54] text-[14px] font-bold mb-2">My Profile</h2>
                        {/* <Link
                            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}user-profile/my-bookings`}
                            className={`flex items-center gap-3 pt-3 first:pt-0 pb-3 last:pb-0 border-b last:border-none text-[#053e54]`}
                        >
                            <div className={`flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px] bg-[#C8FFFA]`}>
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.20599 5.1662L2.32812 1.42578C2.58398 0.572753 3.354 0 4.24414 0H11.7559C12.646 0 13.416 0.572754 13.6719 1.42578L14.794 5.1662C15.5026 5.47412 16 6.17926 16 7V11C16 11.5522 15.5522 12 15 12V12.9999C15 13.5522 14.5523 14 14 14H12.9999C12.4477 14 11.9999 13.5522 11.9999 13L12.0004 12H4L4.00006 12.9999C4.00006 13.5522 3.55237 14 3.00006 14H2C1.44769 14 1 13.5522 1 13V12.0001C0.447755 12.0001 0 11.5522 0 11V7C0 6.17926 0.497438 5.47412 1.20599 5.1662ZM11.7559 2H4.24417L3.34415 5H12.6559L11.7559 2ZM12 9.5C12.5523 9.5 13 9.05225 13 8.5C13 7.94769 12.5523 7.5 12 7.5C11.4477 7.5 11 7.94769 11 8.5C11 9.05225 11.4477 9.5 12 9.5ZM4.00003 9.5C4.55234 9.5 5.00003 9.05225 5.00003 8.5C5.00003 7.94769 4.55234 7.5 4.00003 7.5C3.44773 7.5 3.00003 7.94769 3.00003 8.5C3.00003 9.05225 3.44773 9.5 4.00003 9.5Z" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-semibold uppercase whitespace-nowrap">My Bookings</span>
                        </Link> */}

                        <Link
                            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}user-profile/my-wishlist`}
                            className={`flex items-center gap-3 pt-3 first:pt-0 pb-3 last:pb-0 border-b last:border-none text-[#053e54]`}
                        >
                            <div className={`flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px] bg-[#C8FFFA]`}>
                                <svg width="16" height="13" viewBox="0 0 16 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.99999 13C7.91905 13 7.83815 12.9804 7.76565 12.941C7.6869 12.8983 5.81594 11.8778 3.91813 10.3401C2.79332 9.42874 1.89545 8.52482 1.24951 7.65348C0.413642 6.52597 -0.00670047 5.44143 8.07524e-05 4.42997C0.00801823 3.25302 0.456735 2.14617 1.26367 1.31329C2.08423 0.466377 3.17929 0 4.34719 0C5.84397 0 7.21243 0.787669 8.00002 2.03543C8.78761 0.787698 10.1561 0 11.6529 0C12.7562 0 13.8089 0.420814 14.6172 1.18494C15.5042 2.02348 16.0082 3.2083 15.9999 4.43555C15.9931 5.44525 15.5649 6.52814 14.7272 7.6541C14.0792 8.525 13.1826 9.42851 12.0622 10.3396C10.1713 11.8772 8.3138 12.8977 8.23565 12.9403C8.1628 12.9801 8.08137 13 7.99999 13Z" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-semibold uppercase whitespace-nowrap">My Wishlist</span>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}