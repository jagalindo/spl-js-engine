# spl-js-engine
Software Product Line JavaScript Derivation Engine

## Instructions

* `npm install`: Installation.
* `npm link`: Globally link the client so `spl-js-engine` can be run.
* `npm test`: Run all test.
* `spl-js-engine help`: Usage page.

## Examples

### My Calculator

A simple web-based calculator made with Spring Boot and Angular

Generation of the product:

```
cd examples/MyCalculator
spl-js-engine --featureModel model.yaml \
    --project project.yaml \
    --config config.yaml \
    --code code \
    --output output
```

Running the generated product:

```bash
cd output
npm install
mvn spring-boot:run

# open http://localhost:8080/ on any web browser
```
