export const trimString = (trimString: string) => {
    if (!trimString) return "";
    return trimString.length > 30
        ? trimString.slice(0, 5) + "..." + trimString.slice(-4)
        : trimString;
};

export function getYouTubeVideoId(url: string) {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7]?.length === 11 ? match[7] : null;
  }