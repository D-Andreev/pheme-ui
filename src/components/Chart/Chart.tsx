import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface ChartDatum {
  label: string;
  a: number;
  b: number;
}

export interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  data: ChartDatum[];
  /** Legend labels for series A / B. Defaults to `["A", "B"]`. */
  seriesLabels?: [string, string];
  className?: string;
}

const CHART_HEIGHT = 120;
const GROUP_WIDTH = 64;
const BAR_WIDTH = 20;
const BAR_GAP = 4;
const PADDING_TOP = 8;
const AXIS_LABEL_HEIGHT = 20;
const VIEW_HEIGHT = PADDING_TOP + CHART_HEIGHT + AXIS_LABEL_HEIGHT;

/** Pure scale helper: maps `value` against `max` to a pixel height, clamped to 0 when `max <= 0`. */
export function computeBarHeight(value: number, max: number, maxHeightPx: number): number {
  return max <= 0 ? 0 : (value / max) * maxHeightPx;
}

/**
 * Data-driven two-series bar chart. Series `a` renders in a neutral tone and
 * series `b` in the accent color, matching the system's convention of using
 * accent as a highlight, not a flood.
 */
export function Chart({ data, seriesLabels = ["A", "B"], className, ...rest }: ChartProps) {
  const max = data.reduce((m, d) => Math.max(m, d.a, d.b), 0);
  const viewWidth = Math.max(data.length, 1) * GROUP_WIDTH;
  const pairWidth = BAR_WIDTH * 2 + BAR_GAP;

  return (
    <div className={cx("flex flex-col gap-ds-2", className)} {...rest}>
      <div className="flex items-center gap-ds-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-neutral-600" />
          {seriesLabels[0]}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent" />
          {seriesLabels[1]}
        </span>
      </div>
      <svg viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`} className="h-auto w-full">
        {data.map((datum, i) => {
          const groupX = i * GROUP_WIDTH;
          const barsStartX = groupX + (GROUP_WIDTH - pairWidth) / 2;
          const heightA = computeBarHeight(datum.a, max, CHART_HEIGHT);
          const heightB = computeBarHeight(datum.b, max, CHART_HEIGHT);
          return (
            <g key={`${datum.label}-${i}`}>
              <rect
                x={barsStartX}
                y={PADDING_TOP + CHART_HEIGHT - heightA}
                width={BAR_WIDTH}
                height={heightA}
                fill="var(--color-neutral-600)"
              />
              <rect
                x={barsStartX + BAR_WIDTH + BAR_GAP}
                y={PADDING_TOP + CHART_HEIGHT - heightB}
                width={BAR_WIDTH}
                height={heightB}
                fill="var(--color-accent)"
              />
              <text
                x={groupX + GROUP_WIDTH / 2}
                y={PADDING_TOP + CHART_HEIGHT + 14}
                textAnchor="middle"
                fontSize={10}
                fill="currentColor"
                className="text-neutral-500"
              >
                {datum.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
