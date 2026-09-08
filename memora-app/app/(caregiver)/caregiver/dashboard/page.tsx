import { SummaryCards } from "@/features/caregiver/components/dashboard/summary-cards";
import { CognitiveChart } from "@/features/caregiver/components/dashboard/cognitive-chart";
import { TodaysActivities } from "@/features/caregiver/components/dashboard/todays-activities";
import { TodaysReminders } from "@/features/caregiver/components/dashboard/todays-reminders";
import { RecentActivity } from "@/features/caregiver/components/dashboard/recent-activity";
import { AdaptiveDifficultyCard } from "@/features/caregiver/components/dashboard/adaptive-difficulty-card";
import { AlertsPanel } from "@/features/caregiver/components/dashboard/alerts-panel";

export default function CaregiverDashboardPage() {
  return (
    <div className="space-y-8">
      {/* 1. Summary Cards */}
      <SummaryCards />

      {/* 2. Main Grid: Chart + Adaptive Difficulty */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CognitiveChart />
        </div>
        <div className="space-y-8">
          <AdaptiveDifficultyCard />
          <AlertsPanel />
        </div>
      </div>

      {/* 3. Secondary Grid: Today's Activities + Today's Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TodaysActivities />
        <TodaysReminders />
      </div>

      {/* 4. Recent Activity History Table */}
      <RecentActivity />
    </div>
  );
}
