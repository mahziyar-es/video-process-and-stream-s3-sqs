import { fetchVideos } from "@/api";
import { VideoListItem } from "@/components/video-list-item";
import Link from "next/link";

export default async function Page() {
  const videos = await fetchVideos();

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-xl">There are no videos</div>
        <div className="mt-4">
          <Link href="/upload" className="text-orange-500 text-lg ">
            Upload one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video, index) => (
        <VideoListItem key={index} video={video} />
      ))}
    </div>
  );
}
