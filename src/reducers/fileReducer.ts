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
      }
    case "REMOVE_ACCEPTED_FILE":
      return {
        ...state,
        [action.payload.dropzone]: {
          ...state[action.payload.dropzone],
          acceptedFile: null,
        },
      }
    case "SET_ERROR":
      return {
        ...state,
        [action.payload.dropzone]: {
          ...state[action.payload.dropzone],
          errorMsg: action.payload.error,
        },
      }
    case "REMOVE_ERROR":
      return {
        ...state,
        [action.payload.dropzone]: {
          ...state[action.payload.dropzone],
          errorMsg: null,
        },
      }
    case "REMOVE_ALL_ERRORS":
      const newState: FileState = { ...state };

      (Object.keys(newState) as Array<keyof FileState>).forEach(key => {
        const item = newState[key];
        if (item && typeof item === 'object' && 'errorMsg' in item) {
          newState[key] = {
            ...item,
            errorMsg: null,
          };
        }
      });
    
      return newState;
    default:
      return state;
  }
}