import { Video } from "./types/video.type";
import { httpRequest } from "./utils";

export const createVideo = async (videoData: any) => {
  const formData = new FormData();
  formData.append("title", videoData.title);
  formData.append("description", videoData.description);
  formData.append("video", videoData.video);
  formData.append("thumbnail", videoData.thumbnail);

  const data = await httpRequest("videos", {
    method: "POST",
    body: formData,
  });

  return data;
};

export const fetchVideos = async () => {
  const data = await httpRequest("videos", {
    cache: "no-store",
  });

  return data as Video[];
};
