import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#4A1A3A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            color: "#C4A574",
            fontSize: 92,
            fontFamily: "Georgia, serif",
            letterSpacing: -4,
          }}
        >
          S
        </div>
      </div>
    ),
    size,
  );
}
