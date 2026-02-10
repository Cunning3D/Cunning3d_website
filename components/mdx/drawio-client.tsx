'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

type DrawioClientProps = {
  xml: string;
  title?: string;
  height?: string | number;
};

declare global {
  interface Window {
    GraphViewer?: {
      createViewerForElement: (element: HTMLElement, callback?: (viewer: any) => void) => void;
      processElements: () => void;
    };
    mxGraphInitialization?: Promise<void>;
  }
}

export function DrawioClient({ xml, title, height = 400 }: DrawioClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Configuration for the viewer
  const viewerConfig = {
    highlight: '#0000ff',
    nav: true,
    resize: true,
    toolbar: 'zoom layers lightbox',
    xml: xml,
  };

  useEffect(() => {
    if (loaded && window.GraphViewer && containerRef.current) {
      containerRef.current.innerHTML = ''; // Clear previous
      window.GraphViewer.createViewerForElement(containerRef.current);
    }
  }, [loaded, xml]);

  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border bg-white p-4 dark:bg-[#1e1e1e]">
      <Script
        src="https://viewer.diagrams.net/js/viewer-static.min.js"
        strategy="lazyOnload"
        onLoad={() => setLoaded(true)}
        onReady={() => setLoaded(true)}
      />
      {/* The viewer library looks for specific classes, but we trigger it manually via ref to support SPA nav */}
      <div
        ref={containerRef}
        className="mxgraph"
        style={{ width: '100%', height }}
        data-mxgraph={JSON.stringify(viewerConfig)}
      />
      {title && (
        <div className="mt-2 text-center text-xs text-muted-foreground">
          {title}
        </div>
      )}
    </div>
  );
}
