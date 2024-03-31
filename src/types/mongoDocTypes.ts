import { ObjectId } from "mongodb";
import Stripe from "stripe";


interface AssetInterface {
  url: string; 
  publicId: string; 
  fileName: string;
}

export interface LicenseInterface {
  price: number;
  selected: boolean;
}

export interface LicenseTermsInterface {
  distributionCopies: string;
  audioStreams: string;
  musicVideos: string;
  radioStations: string;
  allowProfitPerformances: boolean;
  country: string | null;
}

export interface BeatDocumentInterface {
  _id: ObjectId;
  id: string;
  title: string;
  bpm: string;
  key: string;
  genre: string;
  mood: string;
  tags: string[];
  producer: { 
    _id: string;
    userName: string;
    profileUrl: string;
  },
  urlIdentifier: number;
  status: "draft" | "published";
  assets: { 
    artwork: AssetInterface;
    mp3: AssetInterface;
    wav: AssetInterface;
  },
  licenses: {
    basic: LicenseInterface;
    premium: LicenseInterface;
    exclusive: LicenseInterface;
  },
  licenseTerms: {
    basic: LicenseTermsInterface;
    premium: LicenseTermsInterface;
    exclusive: LicenseTermsInterface;
  }
  createdAt: Date,
  formattedDate: string;
  comments: [{
    author: any;
    text: string;
    _id: string;
    date: Date;
  }],
  plays: number
}

export interface CartItemInterface extends BeatDocumentInterface {
  chosenLicense: {
    licenseType: "basic" | "premium" | "exclusive";
    licenseTerms: LicenseTermsInterface;
    licensePrice: number;
  }
}

export interface UserDocumentInterface {
  _id: ObjectId;
  email: string;
  profilePicture: string;
  profileUrl: string;
  isProfileCompleted: boolean;
  createdAt: Date;
  userName: string;
  userType: string;
  country: string;
  biography: string;
  licenseTerms: {
    basic: LicenseTermsInterface;
    premium: LicenseTermsInterface;
    exclusive: LicenseTermsInterface;
  }
  stripeDetails: {
    accountId: string;
    onBoardStatus: "unstarted" | "incomplete" | "complete";
  }
  testUser: boolean;
}

export interface CustomerOrdersInterface {
  _id: ObjectId;
  totalAmount: number;
  paymentIntentId: string;
  items: [{
    productId: ObjectId;
    sellerId: ObjectId;
    price: number;
    contract: string;
    licenseType: string;
    licenseTerms: Object;
  }],
  status: string;
  transferGroup: string;
  createdAt: Date;
  customerDetails: {
    customerId: ObjectId,
    billingAddress: Stripe.PaymentMethod.BillingDetails,
    email: string,
  },
}

export interface SellerPayoutInterface {
  _id: ObjectId;
  sellerId: ObjectId;
  totalAmount: number;
  paymentIntentId: string;
  transferId: number;
  productId: ObjectId;
  contract: string;
  licenseType: string;
  licenseTerms: ObjectId;
  buyerId: ObjectId;
  status: string;
  transferGroup: string;
  buyerAddress: Object;
  createdAt: Date;
}