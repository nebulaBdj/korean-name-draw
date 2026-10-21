"use client";

import { useEffect, useState } from "react";
import type { KoreanName } from "@/lib/names";
import { drawStoryImage } from "@/lib/story-image";

type StoryImage = { blob: Blob; url: string };

// 결과 화면이 뜨면 미리 그려 둔다. 버튼을 누른 순간 바로 공유 시트를 열어야 iOS에서 막히지 않는다
export function useStoryImage(name: KoreanName, enabled: boolean): StoryImage | null {
  const [image, setImage] = useState<StoryImage | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let url: string | null = null;
    let cancelled = false;
    drawStoryImage(name)
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setImage({ blob, url });
      })
      .catch(() => setImage(null));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [name, enabled]);

  return image;
}
