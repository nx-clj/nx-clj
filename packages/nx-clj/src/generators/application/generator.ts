import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { ApplicationGeneratorSchema } from './schema';
import { getNewProjectRoot } from '../utils/get-new-project-root';

export async function packageGenerator(
  tree: Tree,
  options: ApplicationGeneratorSchema
) {
  const projectRoot = getNewProjectRoot(tree, {
    ...options,
    projectType: 'application',
  });

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    sourceRoot: projectRoot,
    targets: {
      build: {
        executor: 'nx:run-commands',
        options: {
          cwd: projectRoot,
          command: 'clj -T:build uber',
        },
        outputs: [`{workspaceRoot}/dist/${projectRoot}`],
      },
    },
  });

  const depsProject = readProjectConfiguration(tree, 'clj-deps');
  const buildDepsProject = readProjectConfiguration(tree, 'clj-build-deps');

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    depsProjDir: path.join(offsetFromRoot(projectRoot), depsProject.root),
    buildDepsProjDir: path.join(
      offsetFromRoot(projectRoot),
      buildDepsProject.root
    ),
    buildDir: path.join(offsetFromRoot(projectRoot), `dist/${projectRoot}`),
  });

  await formatFiles(tree);
}

export default packageGenerator;
