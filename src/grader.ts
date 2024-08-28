import { checkContainPackageJson } from './criterias/contain-package-json';
import { findFolderBaseOnFile, getSubmissionInfo } from './utils';
import { buildReport } from './report';
import { checkContainMainJs } from './criterias/contain-main-js';

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

  return buildReport(
    [containPackageJsonChecklist, containMainJSChecklist],
    submissionInfo,
    submissionPath
  );
}