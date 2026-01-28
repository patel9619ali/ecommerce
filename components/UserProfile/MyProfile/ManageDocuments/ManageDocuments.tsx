import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import DocumentsLists from "./DocumentsLists";
import UpdatingLoader from "./UpdatingLoader";
import VerifiedDocuments from "./VerifiedDocuments";

type ChangeEmailProps = {
    openManageDocuments: boolean;
    setOpenManageDocuments: (open: boolean) => void;
}

export default function ManageDocuments({ openManageDocuments, setOpenManageDocuments }: ChangeEmailProps) {
    const [view, setView] = useState<"manageDocuments" | "updating" | "verifiedDocuments">("manageDocuments");

    useEffect(() => {
        if (!openManageDocuments) {
            const timeout = setTimeout(() => {
                setView("manageDocuments");
            }, 200);

            return () => clearTimeout(timeout);
        }
    }, [openManageDocuments]);

    return (
        <Dialog open={openManageDocuments} onOpenChange={setOpenManageDocuments}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[440px] max-w-full xs:h-auto h-full xs:top-1/2 xs:-translate-y-1/2 top-0 translate-y-0 xs:bottom-[unset] bottom-[0] bg-[#053E54] border-none [&>button]:hidden gap-0 block z-200">
                <DialogTitle className="text-white hidden">
                    Manage documents screens
                </DialogTitle>
                {/* Manage Documents Screen */}
                {view === "manageDocuments" && (
                    <DocumentsLists
                        setOpenManageDocuments={setOpenManageDocuments}
                        openUpdatingLoader={() => setView("updating")}
                        openVerifiedDocuments={() => setView("verifiedDocuments")}
                    />
                )}

                {/* Updating Loader Screen */}
                {view === "updating" && (
                    <UpdatingLoader />
                )}

                {/* Verified Documents Screen */}
                {view === "verifiedDocuments" && (
                    <VerifiedDocuments
                        setOpenManageDocuments={setOpenManageDocuments}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}