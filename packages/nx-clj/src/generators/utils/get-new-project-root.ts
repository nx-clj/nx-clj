import { ProjectType, Tree, getWorkspaceLayout, names } from "@nx/devkit";
import * as path from 'path';

export interface ProjectOptions {
  name: string;
  root?: string;
  projectType: ProjectType;
}

export function getNewProjectRoot(
  tree: Tree,
  options: ProjectOptions,
) {
  if (options.root) {
    return options.root;
  }
  const workspaceLayout = getWorkspaceLayout(tree)
  switch (options.projectType) {
    case "library":
      return path.join(workspaceLayout.libsDir, names(options.name).fileName)
    case "application":
      return path.join(workspaceLayout.appsDir, names(options.name).fileName)
  }
}
