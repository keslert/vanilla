Accounts.onLogin(function(options) {
  // Make sure the user has at least a starting project
  var project = Projects.findOne({owner:options.user._id});
  if(!project) {
    Meteor.call('_insertProject', options.user._id, 'My Website');
  }
})