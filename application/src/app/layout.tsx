import Head from "next/head";
import "./global.css";
import AuthProvider from "./AuthProvider";

export const metadata = {
  title: "Bet Keeper",
  description: "Bet Manamgement tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <meta property="og:title"></meta>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Akatab:wght@400;500;600;700;800;900&family=Fira+Code:wght@300..700&display=swap');
        </style>
      </Head>

      <html lang="en">
        <body>
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </>
  );
}
