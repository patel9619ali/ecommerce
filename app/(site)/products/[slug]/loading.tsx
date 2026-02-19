import { SpinnerCustom } from "@/components/Loader/SpinningLoader";

export default function Loading() {
  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] min-h-screen lg:py-10 py-5">
      <div className="px-2">
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative">
            <SpinnerCustom />
          </div>
        </div>
      </div>
    </section>
  );
}