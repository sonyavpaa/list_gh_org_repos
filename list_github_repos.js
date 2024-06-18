const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORGANIZATION = process.env.GITHUB_ORGANIZATION;
const GITHUB_TEAM = process.env.GITHUB_TEAM;

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};

const repositories = [];

async function getRepositories(organization) {
  const url = `https://api.github.com/orgs/${organization}/repos?per_page=100`;
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch repositories: ${error.response.status}`);
    return [];
  }
}

async function getRepoTeams(organization, repo) {
  const url = `https://api.github.com/orgs/${organization}/teams`;
  try {
    const response = await axios.get(url, { headers });
    const teams = response.data;
    const teamRepoPromises = teams.map(
      (team) =>
        axios
          .get(
            `https://api.github.com/teams/${team.id}/repos/${organization}/${repo}`,
            { headers }
          )
          .then(() => team.name)
          .catch(() => null) // If the team does not have access to the repo, ignore the error
    );
    const teamRepoResults = await Promise.all(teamRepoPromises);
    return teamRepoResults.filter((teamName) => teamName !== null);
  } catch (error) {
    console.error(
      `Failed to fetch teams for ${repo}: ${error.response.status}`
    );
    return [];
  }
}

async function getRepoCollaborators(organization, repo) {
  const url = `https://api.github.com/repos/${organization}/${repo}/collaborators`;
  try {
    const response = await axios.get(url, { headers });
    return response.data.map((collaborator) => ({
      login: collaborator.login,
      permissions: collaborator.permissions,
    }));
  } catch (error) {
    console.error(
      `Failed to fetch collaborators for ${repo}: ${error.response.status}`
    );
    return [];
  }
}

async function main() {
  const repos = await getRepositories(GITHUB_ORGANIZATION);
  for (const repo of repos) {
    const repoName = repo.name;
    const teams = await getRepoTeams(GITHUB_ORGANIZATION, repoName);
    const collaborators = [];

    // Check if certain team is included in repository teams.
    if (!teams.includes(GITHUB_TEAM)) {
      // Fetch collaborators connected to the repository.
      const collaboratorsArr = await getRepoCollaborators(
        GITHUB_ORGANIZATION,
        repoName
      );

      if (collaboratorsArr.length > 0) {
        collaborators.length = 0;
        collaboratorsArr.forEach((collaborator) => {
          const { login, permissions } = collaborator;
          collaborators.push({
            User: login,
            Admin: permissions.admin,
            Push: permissions.push,
            Pull: permissions.pull,
          });
        });
      } else {
        console.log(
          "No collaborators or failed to fetch collaborators for this repository."
        );
      }
    }

    const repository = {
      repoName: `${repo.name}`,
      teams: teams,
      collaborators: collaborators,
    };
    repositories.push(repository);
  }

  const timestamp = new Date()
    .toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" })
    .replace(/[ .]/g, "-");

  fs.writeFile(
    `${GITHUB_ORGANIZATION}-repositories-${timestamp}.json`,
    JSON.stringify(repositories),
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    }
  );
}

main();
