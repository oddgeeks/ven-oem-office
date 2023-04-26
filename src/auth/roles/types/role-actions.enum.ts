/**
 * Default actions supported by nestjsx
enum CrudActions {
  ReadAll = 'Read-All',
  ReadOne = 'Read-One',
  CreateOne = 'Create-One',
  CreateMany = 'Create-Many',
  UpdateOne = 'Update-One',
  ReplaceOne = 'Replace-One',
  DeleteOne = 'Delete-One',
}
*/

export enum RoleActions {
  Manage = 'manage', // reserved for casl's all actions
  ReadAll = 'Read-All',
  ReadOne = 'Read-One',
  Read = 'Read', // ReadAll & ReadOne
  CreateOne = 'Create-One',
  CreateMany = 'Create-Many',
  Create = 'Create', // CreateOne & CreateMany
  UpdateOne = 'Update-One',
  ReplaceOne = 'Replace-One',
  DeleteOne = 'Delete-One',
  Submit = 'Submit',
  Clone = 'Clone',
  CloneBulk = 'CloneBulk',
  DeleteBulk = 'DeleteBulk',
  Modify = 'Modify', // Create & UpdateOne & ReplaceOne & DeleteOne
}
