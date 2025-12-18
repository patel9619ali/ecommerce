import Image from "next/image";

export default function BannerSection() {
  return (
    <>
        <video autoPlay muted loop playsInline>
          <source src="/assets/videos/video-app-headphone.mp4" type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
    </>
  );
}