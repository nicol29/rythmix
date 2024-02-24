import { BeatDocumentInterface } from "@/types/mongoDocTypes";

const returnCheapestLicensePrice = (beat: BeatDocumentInterface) => {
  const { licenses } = beat;

  if (licenses.basic.selected) return licenses.basic.price;
  if (licenses.premium.selected) return licenses.premium.price;
  if (licenses.exclusive.selected) return licenses.exclusive.price;
}

export default returnCheapestLicensePrice;