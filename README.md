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

## Bash script
If youre interested to test the bash script:

1. Check you have the required packages:

- [GitHub Cli](https://cli.github.com/)

- [jq](https://formulae.brew.sh/formula/jq) 

2. Create .cli.env file that holds:
```env
GITHUB_ORGANIZATION=GH_ORGANIZATION
GITHUB_TEAM=GH_TEAM
```

3. Autheticate to github using gh cli:
```cli
gh auth login
```

3. Make the script executable:
```cli
chmod +x list_github_repos.sh
```

4. Run the script:
```cli
./list_github_repos.sh
```

