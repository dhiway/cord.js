```bash
# CORD.js

CORD.js is a JavaScript library that provides a collection of classes and methods to interact with the Cord network.

## Table of Contents

1. [Building the SDK](#building-the-sdk)
2. [Experimenting with SDK Methods](#experimenting-with-sdk-methods)
3. [Consuming the SDK in Your Project](#consuming-the-sdk-in-your-project)

## Building the SDK

To build the SDK and see changes, follow these steps:

1. **Clone this repository to your local machine:**
```
git clone <repository_url>
cd <repository_directory>

```bash

**Install dependencies using yarn:**

```
yarn install
```bash

**
 **Build the SDK:**
**

```
yarn build

```bash
## Experimenting with SDK Methods

### Demo Methods

Once the SDK is built, you can experiment with the provided methods.

#### Statement Method

The `demo-statement` method allows you to interact with statement-related functionalities.

To run the statement demo, execute the following command:
```
yarn run demo-statement

```bash
#### Network Score Method

The `demo-network-score` method demonstrates methods related to network scores.

To run the network score demo, execute the following command:
```

```bash
#### Asset Method

The `demo-asset` method showcases methods related to assets.

To run the asset demo, execute the following command:
```
yarn run demo-asset
```bash

The output of each demo script will demonstrate the functionality of the corresponding method. For a detailed structure of the demo scripts, refer to the source code.

## Consuming the SDK in Your Project

To use the SDK in your project, follow these steps:

1. **Navigate to your project directory.**

2. **Install the SDK using npm or yarn:**

```
npm install @cord.network/sdk
```bash
Or with yarn:
```
yarn add @cord.network/sdk
```bash

Once installed, you can import and utilize the SDK in your project as needed.
```
