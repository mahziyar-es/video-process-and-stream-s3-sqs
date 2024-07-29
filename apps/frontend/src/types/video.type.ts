export type Video = {
  key: string;
  title: string;
  description: string;
  thumbnail: string;
  video?: string;
  video_status: "pending" | "processing" | "ready";
};
