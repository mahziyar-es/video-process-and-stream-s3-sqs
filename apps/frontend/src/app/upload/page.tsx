import { VideoForm } from "@/components/video-form";

export default function Page() {
  return (
    <div className="h-full w-full ">
      <h3 className="font-bold text-2xl">Video Form</h3>
      <div className="mt-8">
        <VideoForm />
      </div>
    </div>
  );
}
