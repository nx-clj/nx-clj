import {
  ProjectGraph,
  ProjectGraphBuilder,
  ProjectGraphProcessorContext,
} from '@nx/devkit';
import { basename } from 'path';
import { parseEDNString } from 'edn-data';
import { readFileSync } from 'fs';
import { join } from 'path';

export function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): ProjectGraph {
  const projectRootLookupMap: Map<string, string> = new Map()
  for (const projectName in graph.nodes) {
    projectRootLookupMap.set(graph.nodes[projectName].data.root, projectName)
  }

  const builder = new ProjectGraphBuilder(graph);

  for (const projectName in context.filesToProcess) {
    const depsEdnFiles = context.filesToProcess[projectName]
      .filter(({ file }) => basename(file) === "deps.edn")

    const dependencies = depsEdnFiles
      .map(({ file }) => ({
        file,
        dependencies: getDependencyPathsFromDepsEdn(file)
          .map(relPath => (
            join(graph.nodes[projectName].data.root, relPath)
          ))
          .map(path => (
            projectRootLookupMap.get(path)
          ))
      }))

    dependencies
      .forEach(({ dependencies, file }) => (
        dependencies
          .forEach(dep => (
            builder.addStaticDependency(projectName, dep, file)
          ))
      ))
  }

  return builder.getUpdatedProjectGraph();
}

function getDependencyPathsFromDepsEdn(filePath: string): string[] {
  const content = parseEDNString(
    readFileSync(filePath).toString(),
  )

  for (const kv of content["map"]) {
    if (kv[0]["key"] === "deps") {
      return kv[1]["map"]
        .map(([_, v]) => {
          for (const kv of v["map"]) {
            if (kv[0]["key"] === "local/root") return kv[1];
          }
          return undefined
        })
        .filter((v: string | undefined) => v)
    }
  }
}
