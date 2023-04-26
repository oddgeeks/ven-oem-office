so the further required steps:
1) first of all we should to have a separated email service (to avoid a lot of DRY), with a prepared templated to sending data
2) we need to have a separated notification service with EventEmitter2 ,
for example quote-users SHOULD NOT know about approving queues, we should use a decorator to emit that user was added to quote, and quote-queue should subscribe on that event and recalculate current queue
3) we should have a separated vacation rule service, where should check if user should be reassign, quote-approve /vendor-approve should not know about it
4) also we should avoid use this.repo.manager(AnyEntity), or (connection.manager) if we need an additional entity we need @InjectRepository(Repository<>))
5) we should avoid to check role permission directly in other modules, for example here:
.where(   `quoteApprovalQueue.isActive = TRUE  AND quoteApprovalQueue.quoteApprovalQueueId = :quoteApprovalQueueId  AND quoteApprovalQueue.status = :quoteApprovalQueueStatus  AND (quoteApprovalQueue.approvalQueuePriorityId IS NULL OR approvalQueuePriority.isActive = TRUE)  AND (quoteApprovalQueue.userId IS NULL OR (oemUser.isActive = TRUE AND role.isActive = TRUE))`,
better use interceptor and filters to check it
6) all methods should should be idempotent.
7) we should follow SOLID principals as much as possible (ideally), for example we have quote and vendo approving queue, instead to have 2 DRY modules, we should create an abstract class for this functionality, and then extends/implements it
8 ) If we need to have a transaction I would like to prefer use
but we already started set manager directly, so we cannot use those implementation:
example private async _backToDraft(vendoId: number, manager: EntityManager) {
  const relations = this.repo.metadata.ownRelations.map(
    (relation) => relation.inverseEntityMetadata,  );  for (const relation of relations) {
    // console.log(relation.targetName, Object.keys(relation.propertiesMap));    if (Object.keys(relation.propertiesMap).includes(‘isLocked’)) {
      // console.log(`Unlock ${relation.targetName}`);      await manager.update(
        relation.targetName,        {
          vendoId,          isLocked: true,        },        {
          isLocked: false,        },      );    }
  }
so my suggestion that lets say we have a custom method decorator @Transactional(), which add to last params[params.length-1] optional manager?: EntityManager, if it doesn’t set then it gets (from this.repo.manager), it would allow us to have methods be flexible
9)* I would prefer to store any text in separated FILES
# VENDORI - API v0.12.1
PS. PLEASE keep all tests fresh, they are a metric of system state.

## REQUIREMENTS:
 - node/16.13.0
 - psql (PostgreSQL) 14.1
 - typeorm 0.2.41
 - typescript 4.3.5
## Installation

```bash
$ npm install
or if you have troubles
$ npm i --legacy-peer-deps
```

## Config environment
 - For development environment create .env.development file with these params (copy & past the following snippet):
```
$ echo .env.example > .env.development
```

## Migration
```
# generating migration
$ npm run migration:generate

# running migration
$ npm run migration:run

# reverting migration
$ npm run migration:revert

```
if you need drop/sync schema with clearing data you can use:
```
$ npm run schema:drop
$ npm run schema:sync
```

## Seeds
Creates company, and relay user roles in system. For additional information you can check ./src/oems/seeds
```
# showing current configuration
$ npm run seed:config

# running seeds
$ npm run seed:run
```

## Composite methods
These method do several commands by once
``` 
$ db:migrate: npm run typeorm -- migration:run,
$ db:seed:config: npm run typeorm-seeding config,
$ db:seed: npm run typeorm-seeding seed,
$ db:reset: npm run schema:drop && npm run schema:sync && npm run db:seed

```

## Running the app
* First of all you need generate migration then run migration, then make seeding for successfully running app. See above.
** If you have already migration file, you don't need it
```bash
$ npm run migration:reinitialize
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# debug 
$ npm run start:debug
```

## Live server Requirements and

For vulnerability scans, install the AWS Sytem Manager Agent

```
# Install the AWS commandline
$ cd ~
$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
$ unzip awscliv2.zip
$ sudo ./aws/install

# Congfigure AWS
$ aws configure
# AWS Access Key ID [None]: AKIA•••
# AWS Secret Access Key [None]: ••••1EXA
# Default region name [None]: us-east-2
# Default output format [None]: json

# Install the agent
$ cd ~
$ sudo wget https://raw.githubusercontent.com/awslabs/aws-support-tools/master/Systems%20Manager/SSMAGENT-TOOLKIT-LINUX/ssmagent-toolkit-Linux.sh
$ sudo bash ssmagent-toolkit-Linux.sh > AWS-SSMtroubleshooting-output.txt
$ cat AWS-SSMtroubleshooting-output.txt
```

## Comments
Apple Silicon install instructions
You might have an error when you'll try to install the packages to the project. To fix them:
Open the terminal
Run the command:
```
arch -arm64 brew install pkg-config cairo pango libpng jpeg giflib librsvg`
```
Run npm i in your project.
```
$ npm run start - Updates the schema automatically if `TYPEORM_SYNCHRONIZE=true`
$ npm run test:e2e  - Tests that the DB works propely if `TYPEORM_SYNCHRONIZE=true`
$ npm run migration:reinitialize - No need if `TYPEORM_SYNCHRONIZE=true`
$ npm run schema:sync - Only after `npm run schema:drop`, when you want to reset your DB
$ npm run db:seed - Only when the DB is empty`
``` 

## Test

```bash
# for avoid heap out during testing (we reinitializate db each time)
$ export NODE_OPTIONS=--max_old_space_size=4096
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# e2e-dev tests, following the file name *.e2e-spec.dev.ts
$ npm run test:e2e-dev

# for running specific test by name
# npm run test:e2e -t '{testname}.e2e-spec.ts' 

# test coverage
$ npm run test:cov
```
