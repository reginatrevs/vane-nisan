"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Asset } from "@/lib/assets";

/**
 * Renders an image from /public/assets. If the file isn't there yet,
 * it silently renders `fallback` instead — so the site looks finished
 * while you're still collecting artwork.
 */
export function AssetImage({
  asset,
  alt,
  className,
  sizes = "100vw",
  fallback = null,
  eager = false,
}: {
  asset: Asset;
  alt: string;
  className?: string;
  /** Rendered width at each breakpoint, so next/image picks the right file. */
  sizes?: string;
  fallback?: React.ReactNode;
  /** Load immediately instead of lazily — use for above-the-fold artwork. */
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  // The image is server-rendered, so a 404 fires its error event before React
  // hydrates and can attach onError. Catch that case via the ref callback by
  // inspecting the already-settled element. An img with no resolved source also
  // reports `complete` with zero pixels, so require currentSrc to tell a real
  // 404 apart from a source next/image hasn't picked yet.
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.currentSrc && node.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) return <>{fallback}</>;

  return (
    <Image
      ref={ref}
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={alt}
      sizes={sizes}
      quality={90}
      className={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      onError={() => setFailed(true)}
    />
  );
}
