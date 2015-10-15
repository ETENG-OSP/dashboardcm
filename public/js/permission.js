function permissionConfig(nga, admin, config) {
  var permission = admin.getEntity('permissions');
  permission
    .baseApiUrl(config.permissionHost + 'api/');

  permission
    .listView()
    .fields([

      nga.field('id'),
      nga.field('name'),
      nga.field('code'),
      nga.field('url'),

      nga.field('parentId', 'reference')
        .targetEntity(admin.getEntity('permissions'))
        .targetField(nga.field('name')),

      nga.field('platformId', 'reference')
        .targetEntity(admin.getEntity('platforms'))
        .targetField(nga.field('name')),

      nga.field('roles', 'reference_many')
        .targetEntity(admin.getEntity('roles'))
        .targetField(nga.field('name'))
    ])
    .listActions(['edit', 'delete']);

  permission
    .creationView()
    .fields([
      nga.field('name')
    ]);

  permission
    .editionView()
    .fields([

      nga.field('name'),
      nga.field('code'),
      nga.field('url'),
      nga.field('meta', 'json'),

      nga.field('parentId', 'reference')
        .targetEntity(admin.getEntity('permissions'))
        .targetField(nga.field('name')),

      nga.field('platformId', 'reference')
        .targetEntity(admin.getEntity('platforms'))
        .targetField(nga.field('name')),

      nga.field('roles', 'reference_many')
        .targetEntity(admin.getEntity('roles'))
        .targetField(nga.field('name'))
    ]);
}
