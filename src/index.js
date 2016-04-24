#!/usr/bin/env babel-node

export DerivationEngine from './derivation-engine';
export FeatureModel from './feature-model/feature-model';
export TemplateEngine from './template-engine/template-engine';

export { readJsonFromFile } from './file-utils';

import { cli } from './cli';

if (require.main === module) cli();
