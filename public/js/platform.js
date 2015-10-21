function platformConfig(nga, admin, config) {
  var platform = admin.getEntity('platforms');
  platform.baseApiUrl(config.permissionHost + 'api/');
  platform
    .listView()
    .fields([
      nga.field('id'),
      nga.field('name'),
      nga.field('code')
    ])
    .filters([
      nga.field('code').pinned(true),
      nga.field('name')
    ])
    .listActions(['edit', 'delete']);

  platform
    .creationView()
    .fields([
      nga.field('name')
    ]);

  platform
    .editionView()
    .fields([
      nga.field('name'),
      nga.field('code')
    ]);
}
