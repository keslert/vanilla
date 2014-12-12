Meteor.publish('projects', function() { 

  if(this.userId) {
    var projects = Projects.find({"owner": this.userId});
    var ids = projects.map(function(p) { return p._id })

    return projects;
  } else {

    // TODO: What to do when you're not logged in?
    return Projects.find();
  }
});

Meteor.publish('files', function(projectId) {
  // return Files.find({"project": { "$in": ids }});
  return Files.find({"project": projectId});
})


Meteor.users.allow({
  update: function (userId, user, fields, modifier) {
    // can only change your own documents
    if(user._id === userId)
    {
      Meteor.users.update({_id: userId}, modifier);
      return true;
    }
    else return false;
  }
});