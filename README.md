# List GH Organisation's repositories
A script witch which you can list Github Organizations repositories using personal access token. The script checks if a certain team (can be set as env variable) is linked to the repository in question, and if it returns true, then the collaborators wont get listed.

# To start
1. Create personal access token (see instructions [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)).
2. Create .env file and add your token and target organization name there:
```env
GITHUB_TOKEN=YOUR_TOKEN
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

The script will create a json file that holds the repositories with their teams and collaborators with their permissions.


## Torubelshooting
To be able to fetch possible collaborators of a repository, the token needs to have write/push access to that repo.