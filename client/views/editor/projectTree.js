Template.projectTree.helpers({
  projects: function() {
    return Projects.find();
  },
  files: function() {
    var activeProject = Session.get("active_project");
    return Files.find({project:activeProject});
  },
  fileAttributes: function() {
    var activeFile = Session.get("active_file");
    return {
      class: activeFile == this._id ? "active" : ""
    }
  },
  projectAttributes: function() {
    var activeProject = Session.get("active_project");
    if(this._id === activeProject) {
      return { selected: true };
    } 
    return {};
  },
  deleteProjectAttributes: function() {
    return {
      class: (Projects.find().count() == 1) ? 'disabled' : ''
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
      Router.go('/editor/' + selected);
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
  },
  'click #renameProject':function() {
    renameProjectDialog();
  }
})

function deleteProjectDialog() {
  vex.dialog.confirm({
    message: 'Are you sure you want to <b>delete this project?</b> This is a permanent action and can\'t be undone.',
    callback: function(confirmed) {
      if(confirmed) {
        // TODO: Make sure we delete the files associated with this project on the server
        Meteor.call('removeProject', Session.get("active_project"));
        var project = Projects.findOne();
        Router.go('/editor/'+project._id);
      }
    }
  });
}

function deleteFileDialog() {
  vex.dialog.confirm({
    message: 'Are you sure you want to <b>delete this file?</b> This is a permanent action and can\'t be undone.',
    callback: function(confirmed) {
      if(confirmed) {
        Meteor.call('removeFile', Session.get("active_file"));
        var file = Files.findOne({project:Session.get("active_project")});
        Session.set("active_file", file._id);
      }
    }
  });
}

function newFileDialog() {
  vex.dialog.open({
    message: 'Enter the name of the file: (must be a .html file)',
    input: '<p class="error hidden"></p><input name=\"name\" type=\"text\" required />',
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Create'
      }), $.extend({}, vex.dialog.buttons.NO, {
        text: 'Cancel'
      })
    ],
    onSubmit: function(e) {
      e.preventDefault();
      var $el = $(this);
      var $vex = $el.parent();
      var $error = $vex.find('.error').toggleClass('hidden', true);

      var name = $el.find('input[type=text]').val();
      var projectId = Session.get("active_project");
      Meteor.call('insertFile', projectId, name, function(err, fileId) {
        if(err) {
          $error.text(err.reason).toggleClass('hidden', false);
        } else {
          Session.set("active_file", fileId);
          return vex.close($vex.data().vex.id);
        }
      })
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
        Meteor.call('insertProject', data.name, function(err, projectId) {
          if(!err) {
            Router.go('/editor/'+projectId);
          }
        })
      } else {
        var projects = Projects.findOne();
        $('select option[value="'+Session.get("active_project")+'"]').attr('selected', true);
      }
    }
  });
}

function renameProjectDialog() {
  vex.dialog.open({
    message: 'Enter the new name of the project:',
    input: "<input name=\"name\" type=\"text\" required />",
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Rename'
      }), $.extend({}, vex.dialog.buttons.NO, {
        text: 'Cancel'
      })
    ],
    callback: function(data) {
      if (data !== false) {
        Meteor.call('renameProject', Session.get("active_project"), data.name);
      }
    }
  });
}