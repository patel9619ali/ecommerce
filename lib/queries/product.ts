import qs from "qs";

export const productQuery = qs.stringify({
  populate: {
    brand: true,
    category: true,
    variant: {
      populate: {
        images: true,
        ReturnsAndWarranty: true
      }
    }
  }
});