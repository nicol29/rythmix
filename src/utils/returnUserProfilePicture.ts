const returnProfilePicture = (userProfilePic: string | null | undefined) => {
  return !!userProfilePic ? `${userProfilePic}` : "/empty-profile-picture.png";
}

export default returnProfilePicture;