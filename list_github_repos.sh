#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .cli.env | xargs)
else
  echo ".cli.env file not found!"
  exit 1
fi

# Ensure jq is installed
if ! command -v jq &> /dev/null; then
  echo "jq could not be found. Please install jq."
  exit 1
fi

# Ensure gh is installed
if ! command -v gh &> /dev/null; then
  echo "gh CLI could not be found. Please install gh CLI."
  exit 1
fi

# Function to fetch repositories of an organization
get_repositories() {
  gh api orgs/$GITHUB_ORGANIZATION/repos --paginate --jq '.[].name'
}

# Function to fetch teams connected to a repository
get_repo_teams() {
  local repo=$1
  gh api repos/$GITHUB_ORGANIZATION/$repo/teams --jq '.[] | {name: .name}' | jq -r '.[]'
}

# Function to fetch collaborators connected to a repository
get_repo_collaborators() {
  local repo=$1
  gh api repos/$GITHUB_ORGANIZATION/$repo/collaborators --jq '.[] | {login: .login, permissions: .permissions}'
}

repositories=()

# Fetch repositories and process each one
for repo in $(get_repositories); do
  echo "Processing repository: $repo"

  # Fetch teams connected to the repository
  teams=$(get_repo_teams "$repo")
  if [[ $? -ne 0 ]]; then
    echo "Failed to fetch teams for repository: $repo"
    continue
  fi
  echo "Teams for repository $repo: $teams"

  # Initialize collaborators array
  collaborators=()

  # Check if Maintenance is included in repository teams
  if [[ ! " ${teams[@]} " =~ "Maintenance" ]]; then
    # Fetch collaborators connected to the repository
    while IFS= read -r collaborator; do
      login=$(echo "$collaborator" | jq -r '.login // empty')
      permissions=$(echo "$collaborator" | jq -r '.permissions // empty')
      admin=$(echo "$permissions" | jq -r '.admin // empty')
      push=$(echo "$permissions" | jq -r '.push // empty')
      pull=$(echo "$permissions" | jq -r '.pull // empty')

      if [[ -n $login && -n $permissions ]]; then
        collaborators+=("{\"User\": \"$login\", \"Admin\": $admin, \"Push\": $push, \"Pull\": $pull}")
      fi
    done < <(get_repo_collaborators "$repo")
  fi

  # Create repository JSON object
  repository="{\"repoName\": \"$repo\", \"teams\": [$(printf '%s\n' "${teams[@]}" | jq -s . | jq -c .)], \"collaborators\": [$(printf '%s\n' "${collaborators[@]}" | jq -s . | jq -c .)]}"
  repositories+=("$repository")
done

# Create a timestamp
timestamp=$(date +"%Y-%m-%dT%H-%M-%S")

# Save the output to a JSON file
echo "["$(IFS=,; echo "${repositories[*]}")"]" | jq '.' > "$GITHUB_ORGANIZATION-repositories-$timestamp.json"

echo "The file was saved!"


