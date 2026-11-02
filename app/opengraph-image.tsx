import { ImageResponse } from "next/og";
import { themeTokens } from "@/design/tokens";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Samvrit Srinath: Software Engineer, Research, Systems";

const tokens = themeTokens.dark;

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
          backgroundColor: tokens.void,
          color: tokens.ink,
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
            backgroundImage: `linear-gradient(135deg, ${tokens.atmosphere} 0%, transparent 58%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: tokens.accent,
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
            color: tokens["ink-faint"],
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: tokens.accent,
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
            color: tokens["ink-faint"],
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
            color: tokens.ink,
          }}
        >
          Samvrit Srinath
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: tokens["ink-soft"],
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
              backgroundColor: tokens.accent,
              display: "flex",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: tokens["ink-faint"],
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
