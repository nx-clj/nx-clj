import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
  Tree,
  readNxJson,
  readProjectConfiguration,
  updateNxJson,
} from '@nx/devkit';

import { initGenerator } from './generator';
import { InitGeneratorSchema } from './schema';

describe('init generator', () => {
  let tree: Tree;
  const options: InitGeneratorSchema = {};

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should generate a deps project', async () => {
    await initGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'clj-deps');
    expect(config).toBeDefined();
  });

  it('should generate a build deps project', async () => {
    await initGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'clj-build-deps');
    expect(config).toBeDefined();
  });

  it('should add the plugin to the workspace config', async () => {
    await initGenerator(tree, options);
    const nxJson = readNxJson(tree);
    expect(nxJson.plugins).toStrictEqual(['@nx-clj/tools-deps']);
  });

  it('should add the plugin to the workspace config with other plugins', async () => {
    const originalNxJson = readNxJson(tree);
    originalNxJson.plugins = ['a', 'b', 'c'];
    updateNxJson(tree, originalNxJson);

    await initGenerator(tree, options);
    const nxJson = readNxJson(tree);
    expect(nxJson.plugins).toContain('@nx-clj/tools-deps');
  });

  it('should maintain the previous plugins', async () => {
    const originalNxJson = readNxJson(tree);
    originalNxJson.plugins = ['a', 'b', 'c'];
    updateNxJson(tree, originalNxJson);

    await initGenerator(tree, options);
    const nxJson = readNxJson(tree);
    expect(nxJson.plugins).toEqual(
      expect.arrayContaining(originalNxJson.plugins)
    );
  });
});
