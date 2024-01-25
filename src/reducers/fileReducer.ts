import { FileState, DropzoneAction } from "@/types/uploadBeatFormTypes";


export default function fileReducer(state: FileState, action: DropzoneAction) {
  switch (action.type) {
    case "SET_ACCEPTED_FILE":
      return {
        ...state,
        [action.payload.dropzone]: {
          ...state[action.payload.dropzone],
          acceptedFile: action.payload.acceptedFile,
        },
      };
    case "SET_REJECTED_FILE":
      return {
        ...state,
        [action.payload.dropzone]: {
          ...state[action.payload.dropzone],
          rejectedFile: action.payload.rejectedFile,
        },
      }
    case "REMOVE_ACCEPTED_FILE":
      return {
        ...state,
        [action.payload.dropzone]: {
          ...state[action.payload.dropzone],
          acceptedFile: null,
        },
      }
    case "REMOVE_REJECTED_FILE":
      return {
        ...state,
        [action.payload.dropzone]: {
          ...state[action.payload.dropzone],
          rejectedFile: null,
        },
      }
    default:
      return state;
  }
}