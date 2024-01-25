import { File } from "buffer";
import { Dispatch } from "react";


export interface DropzoneAction {
  type: "SET_ACCEPTED_FILE" | "SET_REJECTED_FILE" | "REMOVE_ACCEPTED_FILE" | "REMOVE_REJECTED_FILE";
  payload: {
    dropzone: "artworkFile" | "mp3File" | "wavFile";
    acceptedFile?: File ;
    rejectedFile?: File ;
  };
};

export interface FileState {
  artworkFile: { acceptedFile: File | null; rejectedFile: File | null; };
  mp3File: { acceptedFile: File | null; rejectedFile: File | null; };
  wavFile: {acceptedFile: File | null; rejectedFile: File | null; };
};

export interface DragDropAreaProps {
  filesState: { acceptedFile: File | null; rejectedFile: File | null; };
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

interface ExtendedFile extends File {
  preview?: string;
}