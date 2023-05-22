# spl-js-engine

Software Product Line JavaScript Derivation Engine

## Requirements

- Node (> v16.14.2)

## Install with npm

`npm install spl-js-engine`
`npx spl-js-engine help`

## Install from github

- `git clone https://github.com/AlexCortinas/spl-js-engine.git`: Clone the repo
- `npm install`: Installation.
- `npm run prepare`: Set husky git hooks (linting).
- `[sudo] npm link`: Globally link the client so `spl-js-engine` can be run anywhere.
- `npm test`: Run all test.
- `npx spl-js-engine help`: Usage page.

## Examples (github)

### My Calculator

A simple web-based calculator made with Spring Boot and Angular

Generation of the product:

```bash
cd examples/MyCalculator
[npx] spl-js-engine --featureModel model.json \
    --product product.json \
    --config config.json \
    --extra extra.js \
    --code code \
    --output output
    [--verbose]
```

Running the generated product:

```bash
cd output
npm install
mvn spring-boot:run

# open http://localhost:8080/ on any web browser
```
