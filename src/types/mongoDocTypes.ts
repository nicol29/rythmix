import { ObjectId } from "mongodb";


interface AssetInterface {
  url: string; 
  publicId: string; 
  fileName: string;
}

export interface LicenseInterface {
  price: number;
  selected: boolean;
}

export interface BeatDocumentInterface {
  _id: ObjectId;
  title: string;
  bpm: string;
  key: string;
  genre: string;
  mood: string;
  tags: string[];
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
  formattedDate: string;
  comments: [{
    author: ObjectId,
    text: string,
  }],
}