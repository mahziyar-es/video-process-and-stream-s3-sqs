"use server";
import { Video } from "./types/video.type";
import { httpRequest } from "./utils";

export const createVideo = async (videoData: FormData) => {
  const data = await httpRequest("videos", {
    method: "POST",
    body: videoData,
  });

  return data;
};

export const fetchVideos = async () => {
  const data = await httpRequest("videos", {
    cache: "no-store",
  });

  return data as Video[];
};

export const fetchVideo = async (key: string) => {
  const data = await httpRequest(`videos/${key}`, {
    cache: "no-store",
  });

  return data as Video;
};
