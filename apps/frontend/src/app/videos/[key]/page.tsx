import { fetchVideo } from "@/api";
import { VideoPlayer } from "@/components/video-player";

export default async function Page({ params }: { params: { key: string } }) {
  const video = await fetchVideo(params.key);

  return (
    <div className="flex flex-wrap">
      <div className="w-full md:w-2/3 p-2">
        <VideoPlayer videoSrc={video.video} />
      </div>
      <div className="w-full md:w-1/3 p-2">
        <p className="font-bold text-xl">{video.title}</p>
        <p className="mt-4">{video.description}</p>
      </div>
    </div>
  );
}
