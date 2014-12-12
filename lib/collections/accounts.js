Meteor.methods({
  'createGuest': function() {


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

  'mergeUser': function(email, password) {
    var user = Meteor.user();

    var found = Meteor.users.findOne({username:email});
    if(found) {
      throw new Meteor.Error(409, 'A user with this email already exists.');
    } else if(password.length < 6) {
      throw new Meteor.Error(409, 'Password must be at least 6 characters.');
    }

    Meteor.users.update(user._id, {$set:{
      emails:[{ address:email, verified: false}],
      username:email,
      profile:{}
    }});
    Accounts.setPassword(user._id, password);

    return user._id;
  }
})