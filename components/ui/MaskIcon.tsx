/**
 * Renders a transparent-background PNG icon as a solid shape tinted with the
 * current text color (via CSS mask). Lets bespoke raster icons inherit the
 * same `text-olive` treatment as the lucide line icons and scale crisply.
 */
export default function MaskIcon({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
