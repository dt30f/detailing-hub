export function StudioViewTracker({
  studioId,
  pathname,
}: {
  studioId: string;
  pathname: string;
}) {
  const src = `/api/studio-views?studioId=${encodeURIComponent(
    studioId,
  )}&pathname=${encodeURIComponent(pathname)}`;

  return (
    // Tracking pixels should stay as plain images so the request reaches the API.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={1}
      height={1}
      className="pointer-events-none absolute h-px w-px opacity-0"
    />
  );
}
