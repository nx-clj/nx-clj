import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { LibraryGeneratorSchema } from './schema';
import { getNewProjectRoot } from '../utils/get-new-project-root';

export async function libraryGenerator(
  tree: Tree,
  options: LibraryGeneratorSchema
) {
  const projectRoot = getNewProjectRoot(tree, {
    ...options,
    projectType: 'library',
  });

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: projectRoot,
    targets: {},
  });

  const depsProject = readProjectConfiguration(tree, 'clj-deps');

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    libFilePath: `${options.rootNs
      .replace(/\./g, '/')
      .replace(/-/g, '_')}/lib.clj`,
    depsProjDir: path.join(offsetFromRoot(projectRoot), depsProject.root),
  });

  await formatFiles(tree);
}

export default libraryGenerator;
