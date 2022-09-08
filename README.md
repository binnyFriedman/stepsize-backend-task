Git Tracking pull requests.

install:
```<bash>
yarn install
```

build: 
```<bash>
yarn build
```
run:
```<bash>
yarn start
```

You should include .env file with the following variables:
```<env>
GITHUB_TOKEN={{your github token}}
GITHUB_OWNER={{your github username}}
GITHUB_OPEN_PR_REPO={{to test merging pull request for this repo}}
GITHUB_OPEN_PR_NUMBER={{to test merging pull request for this repo}}
GITHUB_CLOSED_PR_REPO={{to test failing to merge closed pull request for this repo}}
GITHUB_CLOSED_PR_NUMBER={{to test failing to merge closed pull request for this repo}}
GITHUB_REPO_WITH_MANY_PRS={{to test tracking pull request for this repo}}
GITHUB_REPO_PR_NUMBERS={{to test tracking pull request for this repo}}
```

Once running, you can access the app at http://localhost:3000/api/

Process and design decisions:

I wanted the system to adapt to any new features easly and without breaking changes.
Hence, I decided to use a plugin based architecture.<br>
To add a new code hosting provider (e.g. GitLab), you would need to create a folder inside the pullrequests folder and create a new class that implements the ICodeHostingProvider interface, and add it to the list of providers in pullrequests.module.ts.<br>
The NestJS framework is very flexible and scalable if you follow the right design patterns.
That's why I decided to use it.

For testing, I used Jest and Supertest. but instead of TDD I used BDD.
I think that e2e testing here is more important than unit testing, since the logic is quite simple.
I used the BDD approach to make sure that the system works as expected.

You can test the system by running the following command:<br>
Important: you need to have a .env file with the correct variables.
```<bash>
yarn test:e2e
```

Thanks for the opportunity 😊;
