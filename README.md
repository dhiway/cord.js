# CORD.js <!-- omit in toc -->

Provides a collection of classes and methods to interact with the Cord network.

- [Install the SDK](#install-the-sdk)
- [Build to see changes](#build-to-see-changes)

## Install the SDK

Install the SDK by running the following commands:

```bash
npm install @cord.network/sdk
```

Or with `yarn`:

```bash
yarn add @cord.network/sdk
```

## Build to see changes

Clone this repo and navigate into it.

```
yarn
```

Note that **before you see your changes from the SDK, you have to build it**, by executing a `build`:

```
yarn build
```

## Experiment the SDK methods


Once the build of the package is complete (with `yarn build`), one can try below methods to check
if methods are working.

Note:
Make sure that the cord instance in running locally by following the README.md under the CORD repo
Follow the instructions under the topic -  "Run the node"


```

$ yarn demo

$ yarn demo-vc

$ yarn bench

```
The output of these runs are self-explanatory. For reference of how this is structured,
you can refer to the source of the demo scripts.

