import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { PackageGeneratorSchema } from './schema';
import { getNewProjectRoot } from '../utils/get-new-project-root';

export async function packageGenerator(
  tree: Tree,
  options: PackageGeneratorSchema
) {
  const projectRoot = getNewProjectRoot(tree, options);

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: options.projectType,
    sourceRoot: projectRoot,
    targets: {},
  });

  const depsProject = readProjectConfiguration(tree, 'clj-deps');
  const buildDepsProject = readProjectConfiguration(tree, 'clj-build-deps');

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    depsProjDir: path.join(offsetFromRoot(projectRoot), depsProject.root),
    buildDepsProjDir: path.join(offsetFromRoot(projectRoot), buildDepsProject.root),
  });

  await formatFiles(tree);
}

export default packageGenerator;
