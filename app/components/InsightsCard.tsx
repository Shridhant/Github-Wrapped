"use client";

import { motion } from "motion/react";
import type { ActivityData } from "../lib/github";

interface InsightsCardProps {
  activityData: ActivityData[];
}

export function InsightsCard({ activityData }: InsightsCardProps) {
  const mostActiveMonth = [...activityData].sort(
    (a, b) => b.count - a.count
  )[0];
  const totalContributions = activityData.reduce(
    (sum, month) => sum + month.count,
    0
  );
  const averagePerMonth = Math.round(totalContributions / activityData.length);

  const streaks = activityData.filter((month) => month.count > averagePerMonth);
  const hasStreak = streaks.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-4">Your Year in Review</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium">
            Most Active Month:{" "}
            <span className="text-black">{mostActiveMonth.month}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            You made {mostActiveMonth.count} contributions! 🚀
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium">
            Total Contributions: {totalContributions}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            That's an average of {averagePerMonth} per month! 💪
          </p>
        </div>

        {hasStreak && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium">Productive Streaks</p>
            <p className="text-sm text-gray-600 mt-1">
              You were on fire during {streaks.map((s) => s.month).join(", ")}!
              🔥
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
