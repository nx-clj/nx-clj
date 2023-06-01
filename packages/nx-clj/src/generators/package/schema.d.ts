export interface PackageGeneratorSchema {
  name: string;
  projectType: 'library' | 'application';
  root?: string;
}
