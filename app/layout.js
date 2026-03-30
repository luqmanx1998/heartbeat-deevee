import "./globals.css";
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/Segamoriz.woff2',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={myFont.className}
    >
      <body>{children}</body>
    </html>
  );
}
