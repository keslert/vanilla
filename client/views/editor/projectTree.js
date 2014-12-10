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
  attributes: function() {
    var activeFile = Session.get("active_file");
    return {
      class: activeFile == this._id ? "active" : ""
    }
  }
});

Template.projectTree.events({
  'change select': function(e, template) {
    var selected = $(e.target).val();
    Session.set("active_project", selected);
  }, 
  'click li': function(e, template) {
    Session.set("active_file", this._id);
  }
})