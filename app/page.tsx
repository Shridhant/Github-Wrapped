"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fetchGithubStats } from "./lib/github";
import type { GithubStats } from "./lib/github";
import { ActivityChart } from "./components/ActivityChart";
import { InsightsCard } from "./components/InsightsCard";

export default function Home() {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchGithubStats(username);
      setStats(data);
    } catch (err) {
      setError(
        "Failed to fetch GitHub data. Please check the username and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GitHub Wrapped 2024
          </h1>
          <p className="text-lg text-gray-600">
            See your GitHub year in review
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>

        {stats && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
              <ActivityChart data={stats.activityData} />
            </div>

            <InsightsCard activityData={stats.activityData} />

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-4">Top Languages</h2>
                <div className="space-y-3">
                  {stats.topLanguages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{lang.name}</span>
                        <span>{lang.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-black rounded-full"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-4">Top Repositories</h2>
                <div className="space-y-4">
                  {stats.topRepos.map((repo) => (
                    <div
                      key={repo.name}
                      className="border-b last:border-0 pb-3 last:pb-0"
                    >
                      <h3 className="font-medium">{repo.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {repo.description}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span>⭐ {repo.stars} stars</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
