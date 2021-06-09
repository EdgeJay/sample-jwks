#!/usr/bin/env node

import { hideBin } from 'yargs/helpers';
import { generate } from './keys';

// eslint-disable-next-line
const yargs = require('yargs');

const { argv } = yargs(hideBin(process.argv));

const [cmd] = argv._ as (string | number)[];

if (cmd === 'generate') {
  const keys = parseInt(argv.keys, 10) || 1;
  generate(keys).then(() => {
    console.log(`${keys} key(s) generated`);
  });
}
