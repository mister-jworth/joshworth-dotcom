# Toggl website deploy madness

website is deployed using a different gitolite repository.

get it from: `g.toggl.com:website-deploy`

### Shipit

We use [shipit](https://github.com/shipitjs/shipit) to deploy our website.  

### How to release?

1. Make sure you have shipit installed  
`npm install -g shipit`
2. Clone the repository  
`git clone g.toggl.com:website-deploy`
3. Run your tasks

### How it works

Deploy task uses [shipit-deploy](https://github.com/shipitjs/shipit-deploy) for its inner magic. Check out its repo if you need to modify something.

By running any shipit task the website repository will be checked out to `workspace` directory and built by using `grunt build` in it. After a successful build the content of `workspace` will be rsynced to server with a timestamp. After a successful rsync it will symlink timestamped folder to `current` for nginx serving.

The deploy task will leave *five* last versions to the server, meaning that we can rollback really easily.

Rollback wont rsync new version to server. It will just symlink the old one as `current`.

### Version bumping

Currently you need to bump your version manually before the deploy. This task wont do it for you.

### Deploying a specific tag/branch

Use the --branch arg to specify a branch, tag or commit what to deploy  

* shipit |environment| deploy --branch=<branch|tag|commit>  

### Deploy Tasks

* shipit |environment| deploy 

### Rollback tasks

* shipit |environment| rollback

### Login warning message

Turns on/off the login warning for a certain environment

* shipit |environment| loginAnnouncement:enable
* shipit |environment| loginAnnouncement:disable
