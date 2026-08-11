import { ArchiveBanner } from "@/components/archive-banner";
import { Nav } from "@/components/nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <ArchiveBanner />
      <div className="flex flex-1">
        <Nav />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
