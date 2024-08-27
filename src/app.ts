import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { grade } from './grader';

const argv = yargs(hideBin(process.argv))
  .option('path', {
    alias: 'p',
    describe: 'Define student submission location',
    demandOption: true
  }).parse();

(async () => {
  const { path } = await argv;

  await grade(path as string);
})();