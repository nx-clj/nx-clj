import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { packageGenerator } from './generator';
import { ApplicationGeneratorSchema } from './schema';
import initGenerator from '../init/generator';

describe('package generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await initGenerator(tree, {});
  });

  it('should create an application successfully', async () => {
    const options: ApplicationGeneratorSchema = {
      name: 'test',
      main: 'com.example',
    };
    await packageGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
