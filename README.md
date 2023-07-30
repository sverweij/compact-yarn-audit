[![GitHub Workflow Status](https://github.com/sverweij/compact-yarn-audit/actions/workflows/ci.yml/badge.svg)](https://github.com/sverweij/compact-yarn-audit/actions/workflows/ci.yml)
[![npm stable version](https://img.shields.io/npm/v/compact-yarn-audit.svg?logo=npm)](https://npmjs.com/package/compact-yarn-audit)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## What's this?

_compact-yarn-audit_ presents `yarn audit` output in a compact table, ordered by severity.

## Usage

```sh
yarn audit --json | npx compact-yarn-audit@latest
```

> Note: yarn's audit output can be quite large (gigabytes for a sizeable
> monorepo that hasn't had updates for a while), so it can take
> some time to process all that data.

## Sample output

```
severity  title                      module            via             "resolutions" string
critical  Command Injection          destructomatic    vertex-cli      no fix available
critical  Remote code execution wh…  steering-wheel    beach-cruiser   "steering-wheel": ">=4.7.7"
critical  Prototype Pollution        steering-wheel    beach-cruiser   "steering-wheel": ">=4.1.2"
high      Regular Expression Denia…  oedipus-regex     vertexql-types  no fix available
high      Command Injection          snowdash          beach-cruiser   "snowdash": ">=4.17.21"
high      Prototype Pollution        snowdash          beach-cruiser   "snowdash": ">=4.17.12"
high      Prototype Pollution        snowdash          beach-cruiser   "snowdash": ">=4.17.11"
high      Command Injection          snowdash          .               "snowdash": ">=4.17.21"
high      Prototype Pollution        snowdash          .               "snowdash": ">=4.17.12"
high      Prototype Pollution        snowdash          .               "snowdash": ">=4.17.11"
high      Prototype Pollution        steering-wheel    beach-cruiser   "steering-wheel": ">=4.5.3"
high      Arbitrary Code Execution   steering-wheel    beach-cruiser   "steering-wheel": ">=4.5.3"
high      Arbitrary Code Execution   steering-wheel    beach-cruiser   "steering-wheel": ">=4.5.2"
high      Prototype Pollution        steering-wheel    beach-cruiser   "steering-wheel": ">=4.3.0"
moderate  Information Exposure       mars-server-core  mars-server     "mars-server-core": ">=2.14.2"
moderate  Regular Expression Denia…  chestnut          beach-cruiser   "chestnut": ">=7.1.1"
moderate  Denial of Service          steering-wheel    beach-cruiser   "steering-wheel": ">=4.4.5"
low       Prototype Pollution        minifog           beach-cruiser   "minifog": "<1.0.0 || >=1.2.3"
low       Prototype Pollution        snowdash          beach-cruiser   "snowdash": ">=4.17.19"
low       Prototype Pollution        snowdash          .               "snowdash": ">=4.17.19"
low       Prototype Pollution        snowdash          .               "snowdash": ">=4.17.5"
```

## Why?

The default output of yarn's `audit` is verbose (just like npm's audit is).
When there's more than 3 vulnerabilities it doesn't fit on a screen anymore.
It also contains information I'm not interested in when I want to know what
to fix and with what urgency:

- What is the module _I_ used to import it (_via_ column)?
- If that's not possible what should I put in the _"resolutions" string_?
- Can it be fixed at all?
- How severe is the vulnerability (_severity_, _title_)? Preferably with the
  most severe ones on top.

This module attempts to fix that by leaving out all information not essential
to my use case.
