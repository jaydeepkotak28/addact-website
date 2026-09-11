import React from "react";
import VideoList from "@/components/organisms/VideoList";
import type { VideoRelationBlockProps, VideoContentType } from "@/types";

export type { VideoRelationBlockProps };

export const VideoRelationBlock: React.FC<VideoRelationBlockProps> = ({
  videoListings = [],
  className = "",
}) => {
  if (!videoListings || videoListings.length === 0) {
    return null;
  }

  const normalizedVideoList: VideoContentType[] = videoListings
    .map((item: any, index: number) => {
      if (!item) return null;

      const videoData = item.Video || item.video;
      const contentData = item.Content || item.content;
      const iframeData = item.Iframe || item.iframe;

      return {
        id: item.id || item.documentId || index,
        documentId: item.documentId,
        internalName: item.internalName,
        Content: {
          Title: contentData?.Title || videoData?.title || item.internalName || "",
          Description: contentData?.Description || videoData?.description || "",
          Link: contentData?.Link || videoData?.link || null,
        },
        Iframe: {
          Richtext: iframeData?.Richtext || videoData?.richtext || "",
        },
        Video: videoData || null,
      };
    })
    .filter(Boolean) as VideoContentType[];

  if (normalizedVideoList.length === 0) {
    return null;
  }

  return <VideoList videoList={normalizedVideoList} className={className} />;
};

export default VideoRelationBlock;
