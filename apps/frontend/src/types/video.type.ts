export type Video = {
  key: string;
  title: string;
  description: string;
  thumbnail: string;
  status: "pending" | "processing" | "ready";
};
