import { Dispatch } from "react";


export interface DropzoneAction {
  type: "SET_ACCEPTED_FILE" | "REMOVE_ACCEPTED_FILE" | "SET_ERROR" | "REMOVE_ERROR" | "REMOVE_ALL_ERRORS";
  payload: {
    dropzone: "artworkFile" | "mp3File" | "wavFile";
    acceptedFile?: File;
    error?: string
  };
};

export interface FileState {
  artworkFile: { acceptedFile: File | null; errorMsg: string | null; };
  mp3File: { acceptedFile: File | null; errorMsg: string | null; };
  wavFile: { acceptedFile: File | null; errorMsg: string | null; };
};

export interface DragDropAreaProps {
  filesState: { acceptedFile: File | null; errorMsg: string | null; };
  dispatch: Dispatch<DropzoneAction>;
  styles: String;
  dropZoneName: "artworkFile" | "mp3File" | "wavFile";
  dropZoneOptions: {
    accept: {
      [mimeType: string]: string[];
    }
    maxSize: number;
    minSize: number;
  };
}