Files = new Mongo.Collection('files');

Meteor.methods({
  'insertFile': function(projectId, name) {
    var file = Files.findOne({project:projectId, name:name});
    if(file) {
      throw new Meteor.Error(409, 'A file with this name already exists in the project.');
    } else if(!/\.html$/.test(name)) {
      throw new Meteor.Error(400, 'The filename must end with .html.');
    } else if(!/^[a-zA-Z_\-]+\.html$/.test(name)) {
      throw new Meteor.Error(400, 'The filename can only contain letters A-Z, underscores and dashes.');
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
  }
})