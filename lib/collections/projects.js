Projects = new Mongo.Collection('projects');

Meteor.methods({
  'insertProject': function(name) {
    var user = Meteor.user();
    var id = Projects.insert({
      name: name,
      owner: user._id,
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
  },

  'insertFile': function(projectId, name) {
    var file = Files.findOne({project:projectId, name:name});
    if(file) {
      throw new Meteor.Error(409, 'A file with this name already exists in the project.');
    } else if(!/\.html$/.test(name)) {
      throw new Meteor.Error(400, 'The filename must end with .html.');
    }

    if(ownsProject(projectId)) {
      var id = Files.insert({
        project:projectId,
        name:name,
        content:"<html>\n<head>\n\t<title>"+name+"</title>\n</head>\n<body>\n\t<h1>The start of something delicious.</h1>\n</body>\n</html>"
      });
    }

    return id;
  },

  'updateFile': function(id, content) {
    check(content, String);

    var file = Files.findOne(id);
    if(file && ownsProject(file.project)) {
      file.content = content;
      Files.update(id, file);
    }
  },

  'removeFile': function(id) {
    var file = Files.findOne(id);
    if(file && ownsProject(file.project)) {
      Files.remove(id);
    }
  },

  'removeProject': function(id) {
    if(ownsProject(id)) {
      Projects.remove(id);
      Files.remove({project:id});
    }
  }
})