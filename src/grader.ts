import { checkContainPackageJson } from './criterias/contain-package-json';
import { asyncNodeSpawn, findFolderBaseOnFile, getSubmissionInfo, installDependencies } from './utils';
import { buildReport } from './report';
import { checkContainMainJs } from './criterias/contain-main-js';
import { mainJsContainUsernameCheck } from './criterias/main-js-contain-username';
import { useCorrectPortCheck } from './criterias/use-correct-port';
import { join } from 'node:path';
import { ChildProcess } from 'node:child_process';
import { responseInHtmlCheck } from './criterias/response-in-html';
import { responseH1WithCorrectUsernameCheck } from './criterias/response-h1-with-correct-username';
import { logger } from './logging';
import { Checklist } from './types';

function killProcess(pros: ChildProcess) {
  pros.kill('SIGKILL');
  logger.info('(done) application server stopped');
}

function logChecklist(checklist: Checklist) {
  logger.info(`(done) "${checklist.key}" criteria check: ${checklist.completed ? 'PASSED' : 'FAILED'}`);
  return checklist;
}

export async function grade(submissionPath: string) {
  const submissionInfo = await getSubmissionInfo(submissionPath);
  logger.setPrefix(String(submissionInfo.id));
  logger.info('grading process start');

  // check contain package.json criteria
  logger.info('(progress) "contain-package-json" criteria check');
  const containPackageJsonChecklist = await checkContainPackageJson(submissionPath).then(logChecklist);

  // if the submission not contain package.json, we can't any further do
  if (!containPackageJsonChecklist.completed) {
    return buildReport([containPackageJsonChecklist], submissionInfo, submissionPath);
  }

  // we assume folder that contain package.json is the project path
  const projectPath = await findFolderBaseOnFile(submissionPath, 'package.json');
  logger.info(`the project path: ${projectPath}`);

  // check contain main.js checklist
  logger.info('(progress) "contain-main-js" criteria check');
  const containMainJSChecklist = await checkContainMainJs(projectPath).then(logChecklist);


  // if the main.js not contain in project, we can't any further do
  if (!containMainJSChecklist.completed) {
    return buildReport([containPackageJsonChecklist, containMainJSChecklist], submissionInfo, projectPath);
  }

  // checking username in main.js parallel with install dependencies
  logger.info('(progress) "main-js-contain-username" criteria check');
  logger.info('(progress) installing dependencies app');
  const [mainJsContainUsernameChecklist] = await Promise.all([
    mainJsContainUsernameCheck(projectPath, submissionInfo).then(logChecklist),
    installDependencies(projectPath).then(() => logger.info('(done) installing dependencies app'))
  ]);

  // run the server
  logger.info('(progress) executing main.js using node');
  const mainJsFolder = await findFolderBaseOnFile(projectPath, 'main.js');
  const mainJsPath = join(mainJsFolder, 'main.js');
  const serverProcess = asyncNodeSpawn(mainJsPath);
  logger.info('(done) executing main.js using node');

  // check the port
  logger.info('(progress) "use-correct-port" criteria check');
  const useCorrectPortChecklist = await useCorrectPortCheck().then(logChecklist);

  // if port not opened, then we can't any further do
  if (!useCorrectPortChecklist.completed) {
    killProcess(serverProcess);
    return buildReport(
      [containPackageJsonChecklist, containMainJSChecklist, mainJsContainUsernameChecklist, useCorrectPortChecklist],
      submissionInfo,
      projectPath
    );
  }

  // check response should html parallel with check body response
  logger.info('(progress) "response-in-html" criteria check');
  logger.info('(progress) "response-h1-with-correct-username" criteria check');
  const [responseInHTMLChecklist, responseH1withCorrectUsernameCheck] = await Promise.all(
    [
      responseInHtmlCheck().then(logChecklist),
      responseH1WithCorrectUsernameCheck(submissionInfo).then(logChecklist)
    ]
  );

  killProcess(serverProcess);
  return buildReport(
    [containPackageJsonChecklist, containMainJSChecklist, mainJsContainUsernameChecklist, useCorrectPortChecklist, responseInHTMLChecklist, responseH1withCorrectUsernameCheck],
    submissionInfo,
    submissionPath
  );
}