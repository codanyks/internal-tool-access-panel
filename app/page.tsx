import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Internal Tools Access Panel</h1>
        <p className="mb-4">Welcome! Please <a href="/login" className="text-blue-500 underline">log in</a> to continue.</p>
      </main>
    </div>
  );
}
