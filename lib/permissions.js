ownsProject = function(projectId) { 
  var userId = Meteor.userId();
  var project = Projects.findOne(projectId);
  return userId && project && project.owner === userId;
}