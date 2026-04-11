import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

interface SpatialPreviewDetail {
  label: string;
  value: string;
}

interface SpatialCoordinatePreviewProps {
  x: number;
  y: number;
  z: number;
  details?: SpatialPreviewDetail[];
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
}

const PREVIEW_SIZE = 280;
const PREVIEW_CENTER_X = PREVIEW_SIZE / 2;
const PREVIEW_CENTER_Y = PREVIEW_SIZE / 2 + 24;
const GRAPH_SCALE = 88;
const MIN_PREVIEW_EXTENT = 5;
const FLOOR_GRID_MARKERS = [-1, -0.5, 0, 0.5, 1] as const;
const DEFAULT_YAW = Math.PI / 4;
const DEFAULT_PITCH = Math.PI / 5;
const MIN_PITCH = Math.PI / 10;
const MAX_PITCH = Math.PI / 2.4;
const ROTATION_SENSITIVITY = 0.01;

function formatCoordinate(value: number): string {
  const roundedValue = Math.round(value * 100) / 100;

  return Object.is(roundedValue, -0) ? "0" : roundedValue.toString();
}

function getFloorExtent(x: number, y: number): number {
  return Math.max(
    MIN_PREVIEW_EXTENT,
    Math.ceil(Math.max(Math.abs(x), Math.abs(y), 1)),
  );
}

function getHeightExtent(z: number): number {
  return Math.max(
    MIN_PREVIEW_EXTENT,
    Math.ceil(Math.max(Math.abs(z), 1)),
  );
}

function normalizeCoordinate(value: number, extent: number): number {
  return value / extent;
}

function clampPitch(value: number): number {
  return Math.min(MAX_PITCH, Math.max(MIN_PITCH, value));
}

function rotatePoint(point: Point3D, yaw: number, pitch: number): Point3D {
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);

  const xAfterYaw = point.x * cosYaw - point.y * sinYaw;
  const yAfterYaw = point.x * sinYaw + point.y * cosYaw;

  return {
    x: xAfterYaw,
    y: yAfterYaw * cosPitch - point.z * sinPitch,
    z: yAfterYaw * sinPitch + point.z * cosPitch,
  };
}

function projectPoint(point: Point3D, yaw: number, pitch: number): Point2D {
  const rotatedPoint = rotatePoint(point, yaw, pitch);

  return {
    x: PREVIEW_CENTER_X + GRAPH_SCALE * rotatedPoint.x,
    y: PREVIEW_CENTER_Y + GRAPH_SCALE * rotatedPoint.y,
  };
}

function toSvgPointList(points: Point3D[], yaw: number, pitch: number): string {
  return points
    .map((point) => {
      const projectedPoint = projectPoint(point, yaw, pitch);

      return `${projectedPoint.x},${projectedPoint.y}`;
    })
    .join(" ");
}

function renderAxisLabel(
  label: string,
  point: Point2D,
  dx: number,
  dy: number,
) {
  return (
    <text
      x={point.x + dx}
      y={point.y + dy}
      textAnchor="middle"
      className="fill-slate-600 text-[12px] font-semibold"
    >
      {label}
    </text>
  );
}

function SpatialCoordinatePreview({
  x,
  y,
  z,
  details,
}: SpatialCoordinatePreviewProps) {
  const [yaw, setYaw] = useState(DEFAULT_YAW);
  const [pitch, setPitch] = useState(DEFAULT_PITCH);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    yaw: number;
    pitch: number;
  } | null>(null);
  const floorExtent = getFloorExtent(x, y);
  const heightExtent = getHeightExtent(z);
  const detailItems = details?.filter((item) => item.value.trim().length > 0) ?? [];
  const scaleSummary = `Auto scale: floor +/-${floorExtent}, height +/-${heightExtent}`;
  const origin = projectPoint({ x: 0, y: 0, z: 0 }, yaw, pitch);
  const floorPoint = projectPoint({
    x: normalizeCoordinate(x, floorExtent),
    y: normalizeCoordinate(y, floorExtent),
    z: 0,
  }, yaw, pitch);
  const point = projectPoint({
    x: normalizeCoordinate(x, floorExtent),
    y: normalizeCoordinate(y, floorExtent),
    z: normalizeCoordinate(z, heightExtent),
  }, yaw, pitch);
  const axisXEnd = projectPoint({ x: 1.25, y: 0, z: 0 }, yaw, pitch);
  const axisYEnd = projectPoint({ x: 0, y: 1.25, z: 0 }, yaw, pitch);
  const axisZEnd = projectPoint({ x: 0, y: 0, z: 1.25 }, yaw, pitch);
  const floorOutline = [
    { x: -1, y: -1, z: 0 },
    { x: 1, y: -1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: -1, y: 1, z: 0 },
  ];

  function handlePointerDown(
    event: ReactPointerEvent<SVGSVGElement>,
  ): void {
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      yaw,
      pitch,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(
    event: ReactPointerEvent<SVGSVGElement>,
  ): void {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    setYaw(dragState.yaw + deltaX * ROTATION_SENSITIVITY);
    setPitch(clampPitch(dragState.pitch - deltaY * ROTATION_SENSITIVITY));
  }

  function handlePointerEnd(
    event: ReactPointerEvent<SVGSVGElement>,
  ): void {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-950">3D Preview</p>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            onClick={() => {
              setYaw(DEFAULT_YAW);
              setPitch(DEFAULT_PITCH);
            }}
          >
            Reset view
          </button>
        </div>
        <p className="text-xs font-medium text-slate-500">
          Drag to rotate. Floor uses X/Y and height uses Z.
        </p>
        {detailItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {detailItems.map((detail) => (
              <span
                key={`${detail.label}-${detail.value}`}
                className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
              >
                {detail.label}: {detail.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <svg
        viewBox={`0 0 ${PREVIEW_SIZE} ${PREVIEW_SIZE}`}
        className={`aspect-square w-full touch-none select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        aria-label="3D position preview"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <defs>
          <marker
            id="spatial-axis-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
          </marker>
        </defs>

        <polygon
          points={toSvgPointList(floorOutline, yaw, pitch)}
          className="fill-slate-50 stroke-slate-300"
          strokeWidth="2"
        />

        {FLOOR_GRID_MARKERS.map((marker) => (
          <g key={`grid-${marker}`}>
            <polyline
              points={toSvgPointList([
                { x: -1, y: marker, z: 0 },
                { x: 1, y: marker, z: 0 },
              ], yaw, pitch)}
              className={marker === 0 ? "stroke-slate-300" : "stroke-slate-200"}
              strokeWidth={marker === 0 ? "1.75" : "1"}
              fill="none"
            />
            <polyline
              points={toSvgPointList([
                { x: marker, y: -1, z: 0 },
                { x: marker, y: 1, z: 0 },
              ], yaw, pitch)}
              className={marker === 0 ? "stroke-slate-300" : "stroke-slate-200"}
              strokeWidth={marker === 0 ? "1.75" : "1"}
              fill="none"
            />
          </g>
        ))}

        <line
          x1={origin.x}
          y1={origin.y}
          x2={axisXEnd.x}
          y2={axisXEnd.y}
          className="stroke-slate-400"
          strokeWidth="2.5"
          markerEnd="url(#spatial-axis-arrow)"
        />
        <line
          x1={origin.x}
          y1={origin.y}
          x2={axisYEnd.x}
          y2={axisYEnd.y}
          className="stroke-slate-400"
          strokeWidth="2.5"
          markerEnd="url(#spatial-axis-arrow)"
        />
        <line
          x1={origin.x}
          y1={origin.y}
          x2={axisZEnd.x}
          y2={axisZEnd.y}
          className="stroke-slate-400"
          strokeWidth="2.5"
          markerEnd="url(#spatial-axis-arrow)"
        />
        <line
          x1={floorPoint.x}
          y1={floorPoint.y}
          x2={axisZEnd.x + (floorPoint.x - origin.x)}
          y2={axisZEnd.y + (floorPoint.y - origin.y)}
          className="stroke-slate-300"
          strokeWidth="2"
          markerEnd="url(#spatial-axis-arrow)"
        />

        <line
          x1={origin.x}
          y1={origin.y}
          x2={floorPoint.x}
          y2={floorPoint.y}
          className="stroke-pink-300"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1={floorPoint.x}
          y1={floorPoint.y}
          x2={point.x}
          y2={point.y}
          className="stroke-pink-400"
          strokeWidth="3"
          strokeDasharray="6 5"
          strokeLinecap="round"
        />

        <circle cx={origin.x} cy={origin.y} r="4.5" className="fill-slate-500" />
        <circle cx={floorPoint.x} cy={floorPoint.y} r="5.5" className="fill-pink-200" />
        <circle
          cx={point.x}
          cy={point.y}
          r="7.5"
          className="fill-pink-500 stroke-white"
          strokeWidth="3"
        />

        {renderAxisLabel("+X", axisXEnd, 14, 8)}
        {renderAxisLabel("+Y", axisYEnd, -14, 8)}
        {renderAxisLabel("+Z", axisZEnd, 0, -10)}
        {renderAxisLabel("0", origin, -12, -8)}
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-500">
        <span>{scaleSummary}</span>
        <span>
          X {formatCoordinate(x)} | Y {formatCoordinate(y)} | Z {formatCoordinate(z)}
        </span>
      </div>
    </section>
  );
}

export type { SpatialPreviewDetail };
export default SpatialCoordinatePreview;
