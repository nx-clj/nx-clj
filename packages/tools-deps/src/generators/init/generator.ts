import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  readNxJson,
  Tree,
  updateNxJson,
} from '@nx/devkit';
import * as path from 'path';
import { InitGeneratorSchema } from './schema';
import { getNewProjectRoot } from '../utils/get-new-project-root';

export async function initGenerator(tree: Tree, options: InitGeneratorSchema) {
  generateDepsProject(tree, options, 'clj-deps');
  generateDepsProject(tree, options, 'clj-build-deps');
  addNxCljPlugin(tree);

  await formatFiles(tree);
}

async function addNxCljPlugin(tree: Tree) {
  const nxJson = readNxJson(tree);
  if (nxJson.plugins?.includes('@nx-clj/tools-deps')) {
    return;
  }
  nxJson.plugins = [...(nxJson.plugins ?? []), '@nx-clj/tools-deps'];

  updateNxJson(tree, nxJson);
}

async function generateDepsProject(
  tree: Tree,
  options: InitGeneratorSchema,
  projectName: string
) {
  const projectRoot = getNewProjectRoot(tree, {
    name: projectName,
    projectType: 'library',
    root:
      options.depsProjectsPath &&
      path.join(options.depsProjectsPath, projectName),
  });

  addProjectConfiguration(tree, projectName, {
    root: projectRoot,
    projectType: 'library',
    targets: {},
  });
  generateFiles(
    tree,
    path.join(__dirname, `${projectName}-project-files`),
    projectRoot,
    options
  );
}

export default initGenerator;
