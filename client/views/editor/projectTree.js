Template.projectTree.helpers({
  projects: function() {
    return Projects.find();
  },
  files: function() {
    var activeProject = Session.get("active_project");

    // TODO: What to do if we don't have an active project?
    if(!activeProject) {
      activeProject = "TWo7jfLMAmAEk8Fag";
      Session.set("active_project", activeProject);
    }

    return Files.find({project:activeProject});
  },
  fileAttributes: function() {
    var activeFile = Session.get("active_file");
    return {
      class: activeFile == this._id ? "active" : ""
    }
  },
  projectAttributes:function() {
    var activeProject = Session.get("active_project");
    return {
      selected: this._id == activeProject
    }
  },
  deleteProjectAttributes:function() {
    return {
      class: false ? 'disabled' : ''
    }
  },
  deleteFileAttributes:function() {
    var file = Files.findOne(Session.get("active_file"));
    return {
      class: (file.name == 'index.html' || file.name == 'style.css') ? 'disabled' : ''
    }
  }
});

Template.projectTree.events({
  'change select': function(e, template) {
    var selected = $(e.target).val();
    if(selected == "new_project") {
      newProjectDialog();
    } else {
      Session.set("active_project", selected);
      var file = Files.findOne({project:selected});
      Session.set("active_file", file._id);
    }
  }, 
  'click li': function(e, template) {
    Session.set("active_file", this._id);
  },
  'click #deleteProject:not(.disabled)':function() {
    deleteProjectDialog();
  },
  'click #deleteFile:not(.disabled)':function() {
    deleteFileDialog();
  },
  'click #addFile':function() {
    newFileDialog();
  }
})

function deleteProjectDialog() {
  vex.dialog.confirm({
    message: 'Are you sure you want to <b>delete this project?</b> This is a permanent action and can\'t be undone.',
    callback: function(confirmed) {
      if(confirmed) {
        // TODO: Make sure we delete the files associated with this project on the server
        Projects.remove(Session.get("active_project"));
        var project = Projects.findOne();
        Session.set("active_project", project._id);
      }
    }
  });
}

function deleteFileDialog() {
  vex.dialog.confirm({
    message: 'Are you sure you want to <b>delete this file?</b> This is a permanent action and can\'t be undone.',
    callback: function(confirmed) {
      if(confirmed) {
        // TODO: Make sure we delete the files associated with this project on the server
        Files.remove(Session.get("active_file"));

        var file = Files.findOne({project:Session.get("active_project")});
        Session.set("active_file", file._id);
      }
    }
  });
}

function newFileDialog() {
  vex.dialog.open({
    message: 'Enter the name of the file: (must be a .html file)',
    input: "<input name=\"name\" type=\"text\" required />",
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Create'
      }), $.extend({}, vex.dialog.buttons.NO, {
        text: 'Cancel'
      })
    ],
    callback: function(data) {
      if (data !== false) {
        var exists = Files.findOne({project:Session.get("active_project"), name:data.name});
        if(exists) {
          vex.dialog.alert("<b>Oops!</b> You can't have two files with the name <em>" + data.name +"</em>.");
        } else {
          var id = Files.insert({name:data.name, project:Session.get("active_project"), content:"<html>\n<head>\n\t<title>"+data.name+"</title>\n</head>\n<body>\n\t<h1>The start of something delicious.</h1>\n</body>\n</html>"});
          Session.set("active_file", id);
        }
      }
    }
  });
}

function newProjectDialog() {
  vex.dialog.open({
    message: 'Enter the name of the project:',
    input: "<input name=\"name\" type=\"text\" required />",
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Create'
      }), $.extend({}, vex.dialog.buttons.NO, {
        text: 'Cancel'
      })
    ],
    callback: function(data) {
      if (data !== false) {
        var id = Projects.insert({name:data.name});
        Session.set("active_project", id);

        Files.insert({name:"index.html", project:id, content:"<html>\n<head>\n\t<title>"+data.name+"</title>\n</head>\n<body>\n\t<h1>The start of something delicious.</h1>\n</body>\n</html>"});
        Files.insert({name:"style.css", project:id, content:"body {\n\tmargin:0;\n\tpadding:0;\n}"});
      } else {
        $('select option[value="SH59CfBmXEBwszm9F"]').attr('selected', true);
      }
    }
  });
}