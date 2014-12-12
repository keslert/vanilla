Template.accountsSection.helpers({
  'notGuest':function() {
    var user = Meteor.user();
    return user && (!user.profile || !user.profile.guest);
  }
});

Template.accountsSection.events({
  'click #login': function(e, t) {
    loginDialog();
  },
  'click #signup': function(e, t) {
    signupDialog();
  },
  'click #logout': function(e, t) {
    Meteor.logout();

    // TODO: This is hacky... redirecting too quickly doesn't allow time to invalidate the old Projects
    Meteor.setTimeout(function() {
      Router.go('/editor');  
    }, 100);
  }
});

function loginDialog() {
  vex.dialog.open({
    message: 'Enter your username and password:',
    input: '<p class="error hidden"></p><input name="username" type="email" placeholder="Username" required /><input name="password" type="password" placeholder="Password" required /><a class="u-pull-right" href="#" id="forgot-password">Forgot Password?</a><div class="u-cf"></div>',
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Login'
      }), $.extend({}, vex.dialog.buttons.NO, {
        text: 'Cancel'
      })
    ],
    onSubmit: function(e) {
      e.preventDefault();
      var $el = $(this);
      var $vex = $el.parent();
      var $error = $vex.find('.error').toggleClass('hidden', true);

      var email = trim($el.find('input[type=email]').val());
      var password = $el.find('input[type=password]').val();
      return login(email, password, function(message) {
          if (message === 'success') {
            vex.close($vex.data().vex.id);
            Router.go('/editor');
          } else {
            $error.text(message).toggleClass('hidden', false);
          }
      });
    }
  });
}

function signupDialog() {
  vex.dialog.open({
    message: 'Enter your username and password:',
    input: '<p class="error hidden"></p><input name="username" type="email" placeholder="Username" required /><input name="password" type="password" placeholder="Password (at least 6 characters)" pattern=".{6,}" title="Passwords must have at least 6 characters." required />',
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Sign Up'
      }), $.extend({}, vex.dialog.buttons.NO, {
        text: 'Cancel'
      })
    ],
    onSubmit: function(e) {
      e.preventDefault();
      var $el = $(this);
      var $vex = $el.parent();
      var $error = $vex.find('.error').toggleClass('hidden', true);

      var email = trim($el.find('input[type=email]').val());
      var password = $el.find('input[type=password]').val();
      return register(email, password, function(message) {
          if (message === 'success') {
            return vex.close($vex.data().vex.id);
          } else {
            $error.text(message).toggleClass('hidden', false);
          }
      });
    }
  });
}

function login(email, password, callback) {
  Meteor.loginWithPassword(email, password, function(err){
    if (err) {
      callback(err.reason);
    } else {
      callback('success');
    }
  });
}

function register(email, password, callback) {
  Meteor.call('mergeUser', email, password, function(err, result) {
    if(err) {
      callback(err.reason);
    } else {
      callback('success');
    }
  })
}

function trim(val) {
  return val.replace(/^\s*|\s*$/g, "");
}