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
  addProjectConfiguration(tree, 'clj-deps', {
    root: options.depsProjectPath,
    projectType: 'library',
    sourceRoot: options.depsProjectPath,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'deps-project-files'), options.depsProjectPath, options);
}

export default initGenerator;
