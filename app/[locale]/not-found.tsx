import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <p className="text-8xl font-bold text-primary-200 font-playfair mb-4">404</p>
          <h1 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h1>
          <p className="text-gray-500 mb-8">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/tours"
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
