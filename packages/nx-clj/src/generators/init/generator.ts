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
  generateDepsProject(tree, options)
  addNxCljPlugin(tree)

  await formatFiles(tree);
}

async function addNxCljPlugin(tree: Tree) {
  const nxJson = readNxJson(tree)
  if (nxJson.plugins?.includes('@nx-clj/nx-clj')) {
    return
  }
  nxJson.plugins = [...(nxJson.plugins ?? []), '@nx-clj/nx-clj'];

  updateNxJson(tree, nxJson)
}

async function generateDepsProject(tree: Tree, options: InitGeneratorSchema) {
  const projectRoot = getNewProjectRoot(tree, { name: "clj-deps", projectType: "library", root: options.depsProjectPath });
  addProjectConfiguration(tree, 'clj-deps', {
    root: projectRoot,
    projectType: 'library',
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'deps-project-files'), projectRoot, options);
}

export default initGenerator;
