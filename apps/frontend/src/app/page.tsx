import { VideoListItem } from "@/components/video-list-item";

export default function Page() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {new Array(10).fill(1).map((video, index) => (
        <VideoListItem
          key={index}
          video={{
            key: "asdasd",
            title: "test title",
            description: "test desc",
            thumbnail: "/preview-thumbnail.jpg",
            status: "ready",
          }}
        />
      ))}
    </div>
  );
}
