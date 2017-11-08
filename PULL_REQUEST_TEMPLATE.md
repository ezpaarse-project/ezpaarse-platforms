### What are you adding/fixing?
Name of parser, what files does, issue fixed, etc.

#### Awesome List for Reviewers of Parsers :star::star:
- [ ] fetch new branch to local repo 'git fetch'
- [ ] checkout new branch to test 'git checkout -b branchname' / make sure you're on correct branch with 'git status'
- [ ] find proxied resource and look through it (this generates entries in the logs).  Try to go through everything in nav bar since this will likely have most of the domain changes.
- [ ] go to the logs on the main proxy server and grep for your username.  Use these lines to then test.
- [ ] check output from parser directory:  'echo 'line from log' | ./parser.js
- [ ] check manifest.json to make sure no information is missing
- [ ] review/approve/merge pull request based on findings

