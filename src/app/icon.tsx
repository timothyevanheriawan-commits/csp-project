// File: src/app/icon.tsx
import { ImageResponse } from 'next/og';

// Tentukan runtime edge untuk performa super cepat
export const runtime = 'edge';

// Ukuran standar untuk favicon
export const size = {
    width: 32,
    height: 32,
};

export const contentType = 'image/png';

// Komponen untuk menggambar icon
export default function Icon() {
    return new ImageResponse(
        (
            // Background kotak hijau dengan sudut melengkung (seperti logo navbar Anda)
            <div
                style={{
                    background: '#2E8B57',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                }}
            >
                {/* Ikon ChefHat SVG Mentah (Karena library lucide-react tidak support di ImageResponse) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589c-.66 0-1.28.212-1.785.583a5 5 0 0 0-8.91 1.488 4 4 0 0 0-2.03 7.625.96.96 0 0 0 .727 1.041V20a1 1 0 0 0 1 1h11.41z" />
                    <path d="M6 17h12" />
                </svg>
            </div>
        ),
        // Kirim ukuran ke ImageResponse
        {
            ...size,
        }
    );
}