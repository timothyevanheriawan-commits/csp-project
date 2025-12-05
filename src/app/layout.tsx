import "./globals.css";
import Providers from "./components/Providers";

export const metadata = {
  title: {
    default: 'RecipeShare - Temukan & Bagikan Resep',
    template: '%s | RecipeShare',
  },
  description: "Temukan dan bagikan resep masakan terbaik dari seluruh dunia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}