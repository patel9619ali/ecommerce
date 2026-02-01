"use client"

import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import {BreadcrumbWithCustomSeparator} from "@/components/Breadcrumb/Breadcrumb";
import ChangeName from "@/components/UserProfile/MyProfile/ChangeName";
import Logout from "@/components/UserProfile/MyProfile/Logout";
import ProfileDetailsCard from "@/components/UserProfile/MyProfile/ProfileDetailsCard";
import SettingsOptions from "@/components/UserProfile/MyProfile/SettingsOptions";
import SupportCard from "@/components/UserProfile/MyProfile/SupportCard";
import Sidebar from "@/components/UserProfile/Sidebar";
import ChangeEmail from "@/components/UserProfile/MyProfile/ChangeEmail/ChangeEmail";
import ChangePhone from "@/components/UserProfile/MyProfile/ChangePhone/ChangePhone";
import { useCurrentUser } from "@/hooks/use-current-user";
import ManageSettingsDrawer from "@/components/ManageSettingsDrawer/ManageSettingsDrawer";
import ChangePassword from "@/components/ChangePassword/ChangePassword";

const breadcrumbItems: any[] = [
    { label: 'Home', href: '/' },
    { label: 'My Profile' },
]

export default function MyProfile() {
    const [openChangeName, setOpenChangeName] = useState(false);
    const [openChangePhone, setOpenChangePhone] = useState(false);
    const [openChangeEmail, setOpenChangeEmail] = useState(false);
    const [newcountryCode, setNewCountryCode] = useState<string | undefined>("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [manageOpen, setManageOpen] = useState(false);
    const [isChangeEmail, setIsChangeEmail] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const user = useCurrentUser();
    console.log(user,"useruseruser")
    return (
        <>
            <section className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
                <div className="container py-5 mx-auto">
                    <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
                    <div className="grid md:grid-cols-[1fr_3fr] grid-cols-1 xl:gap-6 lg:gap-4 md:gap-5">
                        
                         <div className="sm:order-1 order-2">
                            <Sidebar />
                        </div>

                     <div className="grid xl:grid-cols-[2fr_1fr] grid-cols-1 xl:gap-6 lg:gap-4 gap-5 sm:order-2 order-1">
                            
                            <div className="flex flex-col gap-y-5">
                                <ProfileDetailsCard setOpenChangeName={setOpenChangeName} setOpenChangeEmail={setOpenChangeEmail} setManageOpen={setManageOpen} />
                                <SupportCard />
                                <Logout />
                            </div>
                            {user?.isOAuth === false &&
                                <div>
                                    <SettingsOptions setOpenPassword={setOpenPassword} setOpenChangePhone={setOpenChangePhone} setOpenChangeEmail={setOpenChangeEmail} setIsChangeEmail={setIsChangeEmail} />
                                </div>
                            }

                        </div> 
                    </div>
                </div>
            </section>

            {/* Change Name Modal */}
            <ChangeName openChangeName={openChangeName} setOpenChangeName={setOpenChangeName} />
            {/* Change Email Modal */}
            <ChangeEmail openChangeEmail={openChangeEmail} setOpenChangeEmail={setOpenChangeEmail} newEmail={newEmail} setNewEmail={setNewEmail} setIsChangeEmail={setIsChangeEmail} isChangeEmail={isChangeEmail} />
            {/* Change Name Modal */}
            <ChangePassword openPassword={openPassword} setOpenPassword={setOpenPassword} />

            {/* Change Phone Modal */}
            {/* <ChangePhone openChangePhone={openChangePhone} setOpenChangePhone={setOpenChangePhone} newcountryCode={newcountryCode} setNewCountryCode={setNewCountryCode} newPhoneNumber={newPhoneNumber} setNewPhoneNumber={setNewPhoneNumber} /> */}
            {/* Change Phone Modal */}

            {/* Manage settings drawer for mobile */}
            <ManageSettingsDrawer manageOpen={manageOpen} setManageOpen={setManageOpen} setOpenPassword={setOpenPassword} setOpenChangeEmail={setOpenChangeEmail} setIsChangeEmail={setIsChangeEmail} />
        </>
    )
}