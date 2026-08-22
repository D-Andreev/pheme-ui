import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { Button } from "../Button/Button";
import { cx } from "../../lib/cx";

export interface VideoEmbedProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Video source URL. */
  src: string;
  /** Poster image shown before playback starts. */
  poster?: string;
}

/**
 * Formats a duration in seconds as `mm:ss`. Minutes are not capped at 59 —
 * an hour-plus clip renders as e.g. `61:01` rather than rolling into an
 * `h:mm:ss` form. Negative, `NaN`, or non-finite input renders as `0:00`.
 */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M4 2.5v11l9-5.5-9-5.5z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
  </svg>
);

/**
 * Video player with a poster frame and custom play/pause + scrubber
 * controls, in place of the native browser chrome.
 */
export function VideoEmbed({ src, poster, className, ...rest }: VideoEmbedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    };
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const value = Number(event.target.value);
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className={cx("flex flex-col gap-ds-2 w-full", className)} {...rest}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={false}
        className="w-full rounded-md"
      />
      <div className="flex items-center gap-ds-2">
        <Button
          icon
          variant="ghost"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={togglePlayback}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <span className="font-mono text-xs text-text opacity-70 tabular-nums">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek"
          className="flex-1 accent-accent"
        />
        <span className="font-mono text-xs text-text opacity-70 tabular-nums">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
