# Data Fabric SDK <!-- omit in toc -->

The SDK provides collection of classes and methods to interact with Data Fabric Service.

- [#MARK Flow](#mark-flow)
- [Install the SDK](#install-the-sdk)
  - [Build to see changes](#build-to-see-changes)
  - [Test the SDK](#test-the-sdk)
    - [Running Unit Test Suite](#running-unit-test-suite)
    - [Running a module test](#running-a-module-test)
    - [Running the Integration Test Suite (require access to cord)](#running-the-integration-test-suite-require-access-to-cord)
    - [Running the Integration Test Suite for a module (require access to cord)](#running-the-integration-test-suite-for-a-module-require-access-to-cord)
  - [Example](#example)

## Install the SDK

Install the SDK by running the following commands:

```bash
npm install @cord.network/api
```

Or with `yarn`:

```bash
yarn add @cord.network/api
```

### Build to see changes

Clone this repo and navigate into it.

```
yarn
```

Note that **before you see your changes from the SDK, you have to build it**, by executing a `build`:

```
yarn run build
```

### Test the SDK

Note that **before you see your changes from the SDK, you have to build it**, by executing a `build`:

#### Running Unit Test Suite

```
yarn test
```

#### Running a module test

```
yarn test ./packages/core/src/mark/Mark.spec.ts
```

#### Running the Integration Test Suite (require access to cord)

```
yarn test:integration
```

#### Running the Integration Test Suite for a module (require access to cord)

```
yarn test:integration:run ./packages/core/src/__integrationtests__/Mark.spec.ts
```
