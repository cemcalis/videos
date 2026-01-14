import "./globals.css";

export const metadata = {
  title: "VideoHub Premium",
  description: "Profesyonel video platformu demo deneyimi"
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
