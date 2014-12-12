Router.configure({
  layoutTemplate: 'layout.default',
  loadingTemplate: 'waiting',
});

Router.onBeforeAction(function() {
  if(!Meteor.user() && !Meteor.loggingIn()) {
    Accounts.createUser({
      password: Meteor.uuid(), 
      username: Meteor.uuid(), 
      email: Meteor.uuid(),
      profile: {
        guest: 'true', 
        name: 'Guest'
      }
    })
  }
  this.next();
});


Router.route('/', {name: 'home'});

Router.route('/editor', function() {
  this.subscribe('projects').wait();

  if(this.ready()) {
    var project = Projects.findOne();
    this.redirect('/editor/'+project._id);
  }
});

Router.route('/editor/:_id', function() {
  this.subscribe('projects').wait();
  this.subscribe('files', this.params._id).wait();

  if (this.ready()) {
    var project = Projects.findOne(this.params._id);

    if(!project) {
      return this.render('notFound');
    }

    var file = Files.findOne();
    Session.set("active_project", project._id);
    Session.set("active_file", file._id);
    this.render('editor');
  } else {
    // what to do?
    // this.render();
  }

})