Router.configure({
  layoutTemplate: 'layout.default'
});

Router.route('/', {name: 'home'});

Router.route('/editor', {name: 'editor'});