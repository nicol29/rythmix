import { Dispatch } from "react";
import { BeatDocumentInterface } from "./mongoDocTypes";

interface ReturnedUploadFile {
  fileName: string;
  publicId: string;
  url: string;
}

export interface DropzoneAction {
  type: "SET_ACCEPTED_FILE" | "REMOVE_ACCEPTED_FILE" | "SET_ERROR" | "REMOVE_ERROR" | "REMOVE_ALL_ERRORS";
  payload: {
    dropzone: "artwork" | "mp3" | "wav";
    acceptedFile?: ReturnedUploadFile;
    error?: string
  };
};

export interface FileState {
  artwork: { acceptedFile: ReturnedUploadFile | null; errorMsg: string | null; };
  mp3: { acceptedFile: ReturnedUploadFile | null; errorMsg: string | null; };
  wav: { acceptedFile: ReturnedUploadFile | null; errorMsg: string | null; };
};

export interface DragDropAreaProps {
  filesState: { acceptedFile: ReturnedUploadFile | null; errorMsg: string | null; };
  dispatch: Dispatch<DropzoneAction>;
  styles: string;
  beatUrl: string;
  dropZoneName: "artwork" | "mp3" | "wav";
  dropZoneOptions: {
    accept: {
      [mimeType: string]: string[];
    }
    maxSize: number;
    minSize: number;
  };
}

export interface FormDataWithFiles {
  artwork: File | null;
  mp3: File | null;
  wav: File | null;
}

export interface BeatUploadFormPropsInterface {
  slug: string;
  currentBeat: BeatDocumentInterface; 
  formType: "upload" | "edit";
}