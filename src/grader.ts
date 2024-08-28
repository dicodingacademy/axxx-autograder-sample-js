import { checkContainPackageJson } from './criterias/contain-package-json';
import { getSubmissionInfo } from './utils';
import { buildReport } from './report';

export async function grade(submissionPath: string) {
  const submissionInfo = await getSubmissionInfo(submissionPath);

  // check contain package.json criteria
  const containPackageJsonChecklist = await checkContainPackageJson(submissionPath);

  return buildReport([containPackageJsonChecklist], submissionInfo, submissionPath);
}