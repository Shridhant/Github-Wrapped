import { Octokit } from "octokit";

const octokit = new Octokit();

export interface ActivityData {
  month: string;
  count: number;
}

export interface GithubStats {
  topLanguages: { name: string; percentage: number }[];
  topRepos: { name: string; stars: number; description: string }[];
  activityData: ActivityData[];
}

export async function fetchGithubStats(username: string): Promise<GithubStats> {
  try {
    const [userRepos, userData] = await Promise.all([
      octokit.rest.repos.listForUser({
        username,
        per_page: 100,
        sort: "updated",
      }),
      octokit.rest.users.getByUsername({ username }),
    ]);

    // Process repositories data
    const repos = userRepos.data;
    const languages = new Map<string, number>();
    let totalSize = 0;

    // Calculate language percentages
    for (const repo of repos) {
      if (repo.language) {
        const current = languages.get(repo.language) || 0;
        languages.set(repo.language, current + (repo.size || 0));
        totalSize += repo.size || 0;
      }
    }

    const topLanguages = Array.from(languages.entries())
      .map(([name, size]) => ({
        name,
        percentage: Math.round((size / totalSize) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Get top repositories by stars
    const topRepos = repos
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 3)
      .map((repo) => ({
        name: repo.name,
        stars: repo.stargazers_count || 0,
        description: repo.description || "",
      }));

    // Generate monthly activity data (since we can't get actual commit data without auth)
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const activityData = months.map((month) => ({
      month,
      count: Math.floor(Math.random() * 100) + 20, // Simulated data
    }));

    return {
      topLanguages,
      topRepos,
      activityData,
    };
  } catch (error) {
    throw new Error("Failed to fetch GitHub data");
  }
}
