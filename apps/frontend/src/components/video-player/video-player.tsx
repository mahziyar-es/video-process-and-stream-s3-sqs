"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

export const VideoPlayer = ({ videoSrc }: { videoSrc?: string }) => {
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoSrc) return;

    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(videoPlayerRef.current!);
    } else if (
      videoPlayerRef.current!.canPlayType("application/vnd.apple.mpegurl")
    ) {
      videoPlayerRef.current!.src = videoSrc;
    }
  }, [videoSrc]);

  return (
    <video
      controls
      preload="none"
      ref={videoPlayerRef}
      className="w-full h-full rounded-xl"
    ></video>
  );
};
