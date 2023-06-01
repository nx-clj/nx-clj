import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { libraryGenerator } from './generator';
import { LibraryGeneratorSchema } from './schema';
import initGenerator from '../init/generator';

describe('package generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await initGenerator(tree, {});
  });

  it('should create a library successfully', async () => {
    const options: LibraryGeneratorSchema = {
      name: 'test',
    };
    await libraryGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
