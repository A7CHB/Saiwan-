import { CanopyMark } from "@/components/icons/canopy";

/**
 * Route-transition skeleton. Deliberately quiet — a spinner on a luxury site
 * reads as a stall, whereas a slowly breathing mark reads as a beat.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center" role="status" aria-live="polite">
      <CanopyMark className="size-10 animate-[saiwan-fade_1.4s_ease-in-out_infinite_alternate] text-accent" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
