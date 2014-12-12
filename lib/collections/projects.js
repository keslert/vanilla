Projects = new Mongo.Collection('projects');

Meteor.methods({
  'insertProject': function(name) {
    var user = Meteor.user();
    return insertProject(user._id, name);
  },
  '_insertProject': function(userId, name) {
    return insertProject(userId, name);
  },

  'removeProject': function(id) {
    if(ownsProject(id)) {
      Projects.remove(id);
      Files.remove({project:id});
    }
  },

  'renameProject': function(id, name) {
    check(name, String);

    var project = Projects.findOne(id);
    if(project && ownsProject(id)) {
      project.name = name;
      Projects.update(id, project);
    }
  }
})

function insertProject(userId, name) {
  var id = Projects.insert({
    name: name,
    owner: userId,
    created: new Date()
  });

  Files.insert({
    project:id,
    name:'index.html',
    content:"<html>\n<head>\n\t<title>"+name+"</title>\n</head>\n<body>\n\t<h1>The start of something delicious.</h1>\n</body>\n</html>"
  })

  Files.insert({
    project:id,
    name:'style.css',
    content:"body {\n\tmargin:0;\n\tpadding:0;\n}"
  })

  return id;
}