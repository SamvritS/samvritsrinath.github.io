import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Samvrit Srinath: Software Engineer, Research, Systems";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        // satori cannot resolve CSS vars, so OG colors stay literal
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          backgroundColor: "#040a12",
          color: "#f5f8fc",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(135deg, #16446b 0%, rgba(4, 10, 18, 0) 58%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: "#ff4638",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 56,
            top: 48,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 6,
            color: "#8c98aa",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: "#ff4638",
              display: "flex",
            }}
          />
          SS
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#8c98aa",
            marginBottom: 28,
          }}
        >
          Research / Systems / Software
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 600,
            lineHeight: 1.05,
            color: "#f5f8fc",
          }}
        >
          Samvrit Srinath
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#b0bccb",
            marginTop: 28,
            maxWidth: 900,
          }}
        >
          Ethernet switch software at Arista. Internet measurement research
          at UCSD.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 40,
          }}
        >
          <span
            style={{
              width: 120,
              height: 1,
              backgroundColor: "#ff4638",
              display: "flex",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8c98aa",
            }}
          >
            Network Observatory · San Diego
          </span>
        </div>
      </div>
    ),
    size,
  );
}
