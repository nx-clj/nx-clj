# nx-clj

[![npm](https://img.shields.io/npm/v/@nx-clj/nx-clj?style=flat-square)](https://www.npmjs.com/package/@nx-clj/nx-clj)

Nx plugin to use [Clojure](clojure.org/) in a [Nx](https://nx.dev/) workspace.

## Getting started

First [create an Nx Workspace](https://nx.dev/getting-started). After that, cd into the workspace root and install the plugin:

```shell
npm install -D @nx-clj/nx-clj
```

Initialize the plugin:

```shell
npx nx g @nx-clj/nx-clj:init
```

This will create the necessary dependencies projects and install the plugin so it resolves the dependency graph with deps.edn data.

## Generators

## Application

Usage:

```shell
npx nx g @nx-clj/nx-clj:application my-app com.example.app
```

This will create a project named `my-app` with the main namespace being `com.example.app`.

The project is also configured with a target that outputs an uberjar. To build the project, run:

```shell
npx nx run my-app:build
```

## Library

Usage:

```shell
npx nx g @nx-clj/nx-clj:library my-lib com.example.lib
```

### The dependencies projects

The init plugin creates two libraries in your workspace, named `clj-deps` and `clj-build-deps`. They are used as a central location for defining and pinning the monorepo dependencies. This is possible because of how tools.deps resolves transitive dependencies.

This means that, if you plan on following the [integrated monorepo](https://nx.dev/tutorials/integrated-repo-tutorial) pattern, you should define all external dependencies under the `clj-deps` (and all build dependencies under the `clj-build-deps`). If you plan on running the package-based monorepo, just ignore these projects and define the dependencies directly under your project's `deps.edn`.
