import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoEmbed, formatTime } from "./VideoEmbed";

describe("formatTime", () => {
  it("formats zero seconds", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("formats sub-minute seconds with zero-padding", () => {
    expect(formatTime(65)).toBe("1:05");
  });

  it("does not roll minutes over at 60 (no h:mm:ss form)", () => {
    expect(formatTime(3661)).toBe("61:01");
  });

  it("falls back to 0:00 for non-finite or negative input", () => {
    expect(formatTime(NaN)).toBe("0:00");
    expect(formatTime(-5)).toBe("0:00");
  });
});

describe("VideoEmbed", () => {
  let playSpy: ReturnType<typeof vi.spyOn>;
  let pauseSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    playSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockImplementation(() => Promise.resolve());
    pauseSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a video element without native controls", () => {
    const { container } = render(<VideoEmbed src="video.mp4" poster="poster.jpg" />);
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "video.mp4");
    expect(video).toHaveAttribute("poster", "poster.jpg");
    expect(video).not.toHaveAttribute("controls");
  });

  it("calls play() when clicking the play button while paused", async () => {
    const user = userEvent.setup();
    render(<VideoEmbed src="video.mp4" />);
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(playSpy).toHaveBeenCalledOnce();
  });

  it("calls pause() when clicking the button while playing", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoEmbed src="video.mp4" />);
    const video = container.querySelector("video") as HTMLVideoElement;

    Object.defineProperty(video, "paused", { value: false, configurable: true });
    fireEvent.play(video);

    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(pauseSpy).toHaveBeenCalledOnce();
  });

  it("updates the displayed current time on timeupdate", () => {
    const { container } = render(<VideoEmbed src="video.mp4" />);
    const video = container.querySelector("video") as HTMLVideoElement;

    Object.defineProperty(video, "currentTime", { value: 65, configurable: true });
    fireEvent.timeUpdate(video);

    expect(screen.getByText("1:05")).toBeInTheDocument();
  });

  it("sets the scrubber max from loadedmetadata duration", () => {
    const { container } = render(<VideoEmbed src="video.mp4" />);
    const video = container.querySelector("video") as HTMLVideoElement;

    Object.defineProperty(video, "duration", { value: 120, configurable: true });
    fireEvent.loadedMetadata(video);

    const slider = screen.getByRole("slider", { name: "Seek" });
    expect(slider).toHaveAttribute("max", "120");
    expect(screen.getByText("2:00")).toBeInTheDocument();
  });

  it("defaults the scrubber max to 0 before metadata loads", () => {
    render(<VideoEmbed src="video.mp4" />);
    const slider = screen.getByRole("slider", { name: "Seek" });
    expect(slider).toHaveAttribute("max", "0");
  });
});
