Meteor.publish('projects', function() { 
  if(this.userId) {
    var projects = Projects.find({"owner": this.userId});
    var ids = projects.map(function(p) { return p._id })

    return projects;
  }
});

Meteor.publish('files', function(projectId) {
  return Files.find({"project": projectId});
})