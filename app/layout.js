import "./globals.css";
import localFont from 'next/font/local'
import Providers from "./providers";

const myFont = localFont({
  src: './fonts/Segamoriz.woff2',
})

export default function RootLayout({ children }) {

  return (
    <html
      lang="en"
      className={myFont.className}
    >
        <body>
          <Providers>
            {children}
          </Providers>
        </body>      
    </html>
  );
}
