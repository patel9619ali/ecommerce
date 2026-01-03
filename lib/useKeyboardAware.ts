"use client";

import { useEffect, RefObject } from "react";

export default function useKeyboardAware(
    ref: RefObject<HTMLElement | null>,
    offset: number = 12
) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const el = ref.current;
        if (!el) return;

        const vk = (navigator as any).virtualKeyboard;

        // Enable overlay mode so keyboard does not resize layout
        if (vk) vk.overlaysContent = true;

        // VirtualKeyboard API handler
        const handleVK = () => {
            const bounding = vk?.boundingRect;
            const keyboardHeight = bounding?.height || 0;
            const keyboardShown = keyboardHeight > 0;

            if (keyboardShown) {
                el.style.position = "fixed";
                el.style.left = `${offset}px`;
                el.style.right = `${offset}px`;
                el.style.width = "93%";
                el.style.bottom = `${keyboardHeight + 0}px`;
                el.style.zIndex = "9999";
            } else {
                el.style.position = "";
                el.style.left = "";
                el.style.right = "";
                el.style.width = "100%";
                el.style.bottom = "";
                el.style.zIndex = "";
            }
        };

        if (vk) vk.addEventListener("geometrychange", handleVK);

        // VisualViewport fallback
        const viewport = window.visualViewport;
        const handleResize = () => {
            if (!viewport) return;

            const keyboardHeight = window.innerHeight - viewport.height;
            const keyboardShown = keyboardHeight > 120;

            if (!el) return;

            if (keyboardShown) {
                el.style.position = "fixed";
                el.style.left = `${offset}px`;
                el.style.right = `${offset}px`;
                el.style.width = "93%";
                el.style.bottom = `${keyboardHeight + 0}px`;
                el.style.zIndex = "9999";
            } else {
                el.style.position = "";
                el.style.left = "";
                el.style.right = "";
                el.style.width = "100%";
                el.style.bottom = "";
                el.style.zIndex = "";
            }
        };

        viewport?.addEventListener("resize", handleResize);

        return () => {
            vk?.removeEventListener("geometrychange", handleVK);
            viewport?.removeEventListener("resize", handleResize);
        };
    }, [ref, offset]);
}