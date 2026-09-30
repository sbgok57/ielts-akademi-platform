import { ImageResponse } from "next/og";

// Next.js App Router Otomatik Favicon Üretici
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          fontWeight: 900,
        }}
      >
        🎓
      </div>
    ),
    {
      ...size,
    }
  );
}
