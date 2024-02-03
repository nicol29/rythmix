import { ObjectId } from "mongodb"

interface AssetInterface {
  url: string; 
  publicId: string; 
}

interface LicenseInterface {
  price: number;
  selected: boolean;
}

export interface BeatDocumentInterface {
  title: string;
  bpm: string;
  key: string;
  genre: string;
  mood: string;
  producer: { 
    _id: ObjectId;
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
  createdAt: Date,
}