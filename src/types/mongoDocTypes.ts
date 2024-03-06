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
}