// productVariants.ts
import img1 from "../../public/assets/cartImages/dynasty-headphone-blackgold-01.jpg";
import img2 from "../../public/assets/cartImages/dynasty-headphone-black-02.jpg";
import img3 from "../../public/assets/cartImages/dynasty-headphone-black-03.jpg";
import img4 from "../../public/assets/cartImages/dynasty-headphone-black-04.jpg";

import blue1 from "@/public/assets/cartImages/dynasty-headphone-blue-01.jpg";
import blue2 from "@/public/assets/cartImages/dynasty-headphone-blue-02.jpg";
import blue3 from "@/public/assets/cartImages/dynasty-headphone-blue-03.jpg";
import blue4 from "@/public/assets/cartImages/dynasty-headphone-blue-04.jpg";

export const PRODUCT_VARIANTS = {
  black: {
    name: "Black",
    price: 169400,
    images: [img1, img2, img3, img4],
  },
  blue: {
    name: "Blue",
    price: 169400,
    images: [blue1, blue2, blue3, blue4],
  },
};
