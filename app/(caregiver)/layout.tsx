import { CaregiverSidebar } from "@/features/caregiver/components/sidebar";
import { CaregiverHeader } from "@/features/caregiver/components/header";

export default function CaregiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      <CaregiverSidebar />
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        <CaregiverHeader />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
