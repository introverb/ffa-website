// Embeds a YouTube video in a 16:9 frame, used for Possibilia interview
// conversations that are video-first or too large to ship through Git LFS.
// We keep a single component so the styling and the privacy-enhanced
// embed host are consistent across packages.
//
// `youtu-nocookie.com` is YouTube's privacy-enhanced embed host: it
// doesn't drop tracking cookies until the user actually starts the
// video, which keeps the page's network footprint small and avoids
// loading any tracking scripts we don't need.

export function YouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title?: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-ink/5">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title ?? 'Interview video'}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
