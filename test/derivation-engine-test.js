import assert from 'assert';

import { DerivationEngine, readJsonFromFile } from '../src/index';

import {
    getTestPath as p, removeTmpFolder,
    assertEqualFilesInFolders
} from './test-utils';

suite('Derivation Engine');

beforeEach(removeTmpFolder);
afterEach(removeTmpFolder);

test('Create a product without feature selection or any custom data', () => {
    const engine = new DerivationEngine(p('simpleSPL/code'));

    engine.generateProduct(p('tmp/simpleProduct'));

    assertEqualFilesInFolders(p('simpleSPL/code'), p('tmp/simpleProduct'));
});

test('Trying to create a product without code path', () => {
    assert.throws(() => {
        new DerivationEngine();
    }, /Code path is required to create a Derivation Engine/);
});

test('Create a product', () => {
    const engine = new DerivationEngine(
        p('simpleSPL/code'),
        readJsonFromFile(p('simpleSPL/model.yaml')),
        readJsonFromFile(p('simpleSPL/config.yaml'))
    );

    engine.generateProduct(
        p('tmp/simpleProduct'),
        readJsonFromFile(p('simpleSPL/product.yaml'))
    );

    assertEqualFilesInFolders(p('simpleSPL/expected'), p('tmp/simpleProduct'));
});

test('Create a product with data', () => {
    const engine = new DerivationEngine(
        p('simpleSPLwithData/code'),
        readJsonFromFile(p('simpleSPLwithData/model.yaml')),
        readJsonFromFile(p('simpleSPLwithData/config.yaml'))
    );

    engine.generateProduct(
        p('tmp/simpleProduct'),
        readJsonFromFile(p('simpleSPLwithData/product.yaml'))
    );

    assertEqualFilesInFolders(
        p('simpleSPLwithData/expected'), p('tmp/simpleProduct'));
});


test('Get features and parameters of an annotated project', () => {
    const engine = new DerivationEngine(p('simpleSPLwithData/code'));

    engine.setConfig(readJsonFromFile(p('simpleSPLwithData/config.yaml')));

    const report = engine.analyseAnnotations();

    assert.deepEqual(
        report.short(),
        {
            feature: { featureA: 2, featureB: 1, featureC: 1 },
            data: { aValue: 1, bValue: 1}
        }
    );

    assert.deepEqual(
        report.long(),
        {
            'index.html': {
                feature: { featureA: 1, featureB: 1, featureC: 1 },
                data: {}
            },
            'main.js': {
                feature: { featureA: 1 },
                data: { aValue: 1, bValue: 1 }
            }
        }
    );

    assert.deepEqual(
        report.filesByFeature('featureA'),
        [ 'index.html', 'main.js' ]
    );

    assert.deepEqual(
        report.filesByFeature('featureB'),
        [ 'index.html' ]
    );

    assert.deepEqual(
        report.filesByData('aValue'),
        [ 'main.js' ]
    );
});

test('Compare feature model vs analysed code results', () => {
    const engine = new DerivationEngine(
        p('simpleSPLwithData/code'),
        readJsonFromFile(p('simpleSPLwithData/model.yaml')),
        readJsonFromFile(p('simpleSPLwithData/config.yaml'))
    );

    const report = engine.analyseAnnotations();

    assert.deepEqual(
        report.checkAnnotatedFeaturesConsistency(),
        { errors: 0, warnings: 0, abound: [], missing: [] }
    );

    assert.deepEqual(
        report.checkAnnotatedDataConsistency(
            readJsonFromFile(p('simpleSPLwithData/product.yaml'))
        ),
        { errors: 0, warnings: 0, abound: [], missing: [] }
    );
});


test('Compare fanalysis results in a not consistent project', () => {
    const engine = new DerivationEngine(
        p('simpleSPLwrong/code'),
        readJsonFromFile(p('simpleSPLwrong/model.yaml')),
        readJsonFromFile(p('simpleSPLwrong/config.yaml'))
    );

    const report = engine.analyseAnnotations();

    assert.deepEqual(
        report.checkAnnotatedFeaturesConsistency(),
        {
            errors: 2, warnings: 1,
            abound: [ 'featureWrong', 'anotherFeatureWrong' ],
            missing: [ 'featureA' ]
        }
    );

    assert.deepEqual(
        report.checkAnnotatedDataConsistency(
            readJsonFromFile(p('simpleSPLwrong/product.yaml'))
        ),
        {
            errors: 2, warnings: 1,
            abound: [ 'wrongValue', 'anotherWrongValue' ],
            missing: [ 'aValue' ]
        }
    );
});

test('Create a product with data parameters at several levels', () => {
    const engine = new DerivationEngine(
        p('simpleSPLwithDataComplex/code'),
        readJsonFromFile(p('simpleSPLwithDataComplex/model.yaml')),
        readJsonFromFile(p('simpleSPLwithDataComplex/config.yaml'))
    );

    engine.generateProduct(
        p('tmp/simpleProduct'),
        readJsonFromFile(p('simpleSPLwithDataComplex/product.yaml'))
    );

    assertEqualFilesInFolders(
        p('simpleSPLwithDataComplex/expected'), p('tmp/simpleProduct'));
});

test('Consistency results for complex data', () => {
    const engine = new DerivationEngine(
        p('simpleSPLwithDataComplex/code'),
        readJsonFromFile(p('simpleSPLwithDataComplex/model.yaml')),
        readJsonFromFile(p('simpleSPLwithDataComplex/config.yaml'))
    );

    const report = engine.analyseAnnotations();

    assert.deepEqual(
        report.checkAnnotatedFeaturesConsistency(),
        { errors: 0, warnings: 0, abound: [], missing: [] }
    );

    assert.deepEqual(
        report.checkAnnotatedDataConsistency(
            readJsonFromFile(p('simpleSPLwithDataComplex/product.yaml'))
        ),
        { errors: 0, warnings: 0, abound: [], missing: [] }
    );
});
