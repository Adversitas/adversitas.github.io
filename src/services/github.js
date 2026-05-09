import { Octokit } from "octokit";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

export const getProfile = async () => {
  try {
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const getRepositories = async () => {
  try {
    // Fetch all repositories (public and private)
    // visibility: 'all' or 'private'
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      visibility: 'all',
      sort: 'updated',
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
};

export const getLanguages = (repos) => {
  const languages = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });
  return languages;
};

export const getRepoReadme = async (owner, repoName) => {
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner,
      repo: repoName,
      mediaType: {
        format: 'raw',
      },
    });
    return data;
  } catch (error) {
    console.error(`Error fetching README for ${repoName}:`, error);
    return null;
  }
};

