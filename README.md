# Reactive

This is a test on building state-driven UIs without the virtual DOM.

## How to run

### Requirements

- Node >= 18
- pnpm (or any other package manager for Node)

### Install

```sh
pnpm i
```

### Run

```sh
pnpm dev
```

## How it works

Reactive UI here is based on the `observer` pattern, the UI is mounted only once when a function component is initialized. Once a subject (`reactive` value) state has changed (via `update` or `set`), the element that depends on that subject's value is updated.

## Author

| ![Eder Lima](https://github.com/asynched.png?size=128) |
| ------------------------------------------------------ |
| Eder Lima                                              |
