# List GH Organization's repositories
This repo holds a js script witch which you can list Github Organization's repositories using personal access token. The script checks if a certain team (can be set as env variable) is linked to the repository in question, and if it returns true, then the collaborators wont get listed.

The repo holds also .sh file that holds a bash script similar as above. Due to problems with fetchin and listing repository teams the script is still a work in progress.

## To start
1. Create personal access token (see instructions [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)).
2. Create .env file and add your token, target organization and possible gh team name name there:
```env
GITHUB_TOKEN=YOUR_GH_TOKEN
GITHUB_ORGANIZATION=GH_ORGANIZATION
GITHUB_TEAM=GH_TEAM
```
3. Install needed packages:
```cli
npm i
```

4. Run the script with node:
```cli
node list_github_repos.js
```

The script will create a json file that holds the repositories with their teams and collaborators with their permissions + prints output to console.


## Torubelshooting
To be able to fetch possible collaborators of a repository, the token needs to have write/push access to that repo.
