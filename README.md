# CORD.js

CORD.js is a JavaScript library that provides a collection of classes and methods to interact with the Cord network.

## Table of Contents
- [Building the SDK](#building-the-sdk)
- [Experimenting with SDK Methods](#experimenting-with-sdk-methods)
  - [Demo Methods](#demo-methods)
    - [Statement Method](#statement-method)
    - [Network Score Method](#network-score-method)
    - [Asset Method](#asset-method)
- [Consuming the SDK in Your Project](#consuming-the-sdk-in-your-project)

---

## Building the SDK

To build the SDK and see changes, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone <repository_url>
   cd <repository_directory>

2. Install dependencies using yarn:

     ```bash
     yarn

2. Build the SDK:

    ```bash
    yarn build

## Experimenting with SDK Methods
## Demo Methods
Once the SDK is built, you can experiment with the provided methods.

## Statement Method:

The `demo-statement` method allows you to interact with statement-related functionalities.

To run the statement demo, execute the following command:

```bash
yarn demo-statement
```

## Network Score Method:

The `demo-network-score` method demonstrates methods related to network scores.

To run the network score demo, execute the following command:

```bash
yarn demo-network-score
```

## Asset Method:

The `demo-asset` method showcases methods related to assets.

To run the asset demo, execute the following command:

```bash
yarn demo-asset
```

The output of each demo script will demonstrate the functionality of the corresponding method. For a detailed structure of the demo scripts, refer to the source code.

## Consuming the SDK in Your Project

To use the SDK in your project, follow these steps:

1. Navigate to your project directory.

2. Install the SDK using npm or yarn:

```bash
npm install @cord.network/sdk
```

Or with yarn:

```bash
yarn add @cord.network/sdk
```

Once installed, you can import and utilize the SDK in your project as needed.
