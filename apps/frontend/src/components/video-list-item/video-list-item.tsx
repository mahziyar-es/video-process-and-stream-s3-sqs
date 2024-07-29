import { Video } from "@/types/video.type";
import Image from "next/image";
import Link from "next/link";

export const VideoListItem = ({ video }: { video: Video }) => {
  const VIDEO_STATUS_COLOR_MAP: Record<Video["video_status"], string> = {
    pending: "bg-gray-400",
    processing: "bg-yellow-400",
    ready: "bg-green-400",
  };

  return (
    <Link href={`/videos/${video.key}`}>
      <div className="rounded-lg border p-2 cursor-pointer hover:shadow-md transition">
        <Image
          src={video.thumbnail}
          alt={video.title}
          width={500}
          height={500}
          className="rounded-lg"
        />
        <div className="mt-2 flex items-center text-xs gap-2">
          <div
            className={`w-[10px] h-[10px] rounded-full ${
              VIDEO_STATUS_COLOR_MAP[video.video_status]
            }`}
          ></div>
          <div className="text-gray-600">{video.video_status}</div>
        </div>
        <div className="mt-2 text-gray-600">{video.title}</div>
      </div>
    </Link>
  );
};
