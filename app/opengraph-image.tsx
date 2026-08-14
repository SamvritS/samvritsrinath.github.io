import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Samvrit Srinath — Research · Systems · Software";

const stars: [number, number, number, string][] = [
  [100, 120, 3, "#5ba7ff"],
  [1080, 100, 2, "#b58cff"],
  [950, 480, 3, "#7c7cff"],
  [220, 500, 2, "#5ba7ff"],
  [650, 90, 2, "#b58cff"],
  [500, 300, 2, "#f0c674"],
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          backgroundColor: "#050608",
          color: "#f5f7fa",
          position: "relative",
        }}
      >
        {stars.map(([x, y, r, c], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: 999,
              backgroundColor: c,
              opacity: 0.9,
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#5ba7ff",
            marginBottom: 28,
          }}
        >
          Research · Systems · Software
        </div>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 600, lineHeight: 1.05 }}>
          Samvrit Srinath
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#a7afbf",
            marginTop: 28,
            maxWidth: 820,
          }}
        >
          I build systems that make computers understand the world.
        </div>
      </div>
    ),
    size,
  );
}