import { checkContainPackageJson } from './criterias/contain-package-json';
import { asyncNodeSpawn, findFolderBaseOnFile, getSubmissionInfo, installDependencies } from './utils';
import { buildReport } from './report';
import { checkContainMainJs } from './criterias/contain-main-js';
import { mainJsContainUsernameCheck } from './criterias/main-js-contain-username';
import { useCorrectPortCheck } from './criterias/use-correct-port';
import { join } from 'node:path';
import { ChildProcess } from 'node:child_process';
import { responseInHtmlCheck } from './criterias/response-in-html';

function killProcess(pros: ChildProcess) {
  pros.kill('SIGKILL');
}

export async function grade(submissionPath: string) {
  const submissionInfo = await getSubmissionInfo(submissionPath);

  // check contain package.json criteria
  const containPackageJsonChecklist = await checkContainPackageJson(submissionPath);

  // if the submission not contain package.json, we can't any further do
  if (!containPackageJsonChecklist.completed) {
    return buildReport([containPackageJsonChecklist], submissionInfo, submissionPath);
  }

  // we assume folder that contain package.json is the project path
  const projectPath = await findFolderBaseOnFile(submissionPath, 'package.json');

  // check contain main.js checklist
  const containMainJSChecklist = await checkContainMainJs(projectPath);

  // if the main.js not contain in project, we can't any further do
  if (!containMainJSChecklist.completed) {
    return buildReport([containPackageJsonChecklist, containMainJSChecklist], submissionInfo, projectPath);
  }

  // checking username in main.js parallel with install dependencies
  const [mainJsContainUsernameChecklist] = await Promise.all([
    mainJsContainUsernameCheck(projectPath, submissionInfo),
    installDependencies(projectPath)
  ]);

  // run the server
  const mainJsFolder = await findFolderBaseOnFile(projectPath, 'main.js');
  const mainJsPath = join(mainJsFolder, 'main.js');
  const serverProcess = asyncNodeSpawn(mainJsPath);

  // check the port
  const useCorrectPortChecklist = await useCorrectPortCheck();

  // if port not opened, then we can't any further do
  if (!useCorrectPortChecklist.completed) {
    killProcess(serverProcess);
    return buildReport(
      [containPackageJsonChecklist, containMainJSChecklist, mainJsContainUsernameChecklist, useCorrectPortChecklist],
      submissionInfo,
      projectPath
    );
  }

  // check response should html
  const responseInHTMLChecklist = await responseInHtmlCheck();

  killProcess(serverProcess);
  return buildReport(
    [containPackageJsonChecklist, containMainJSChecklist, mainJsContainUsernameChecklist, useCorrectPortChecklist, responseInHTMLChecklist],
    submissionInfo,
    submissionPath
  );
}