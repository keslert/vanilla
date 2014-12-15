Template.resetPassword.rendered = function() {
  if (!this.rendered) {
    this.rendered = true;

    vex.dialog.open({
      message: 'Enter your new password:',
      input: "<input name='password' type='password' placeholder='Password (at least 6 characters)' required>",
      buttons: [
        $.extend({}, vex.dialog.buttons.YES, {
          text: 'Reset'
        })
        // , $.extend({}, vex.dialog.buttons.NO, {
        //   text: 'Cancel'
        // })
      ],
      escapeButtonCloses: false,
      overlayClosesOnClick: false,
      onSubmit: function(e) {
        e.preventDefault();
        var $el = $(this);
        var $vex = $el.parent();
        var $error = $vex.find('.error').toggleClass('hidden', true);

        var password = $el.find('input[type=password]').val();
        Accounts.resetPassword(Session.get('resetToken'), password, function(err) {
          if(err) {
            $error.text(err.reason).toggleClass('hidden', false);
          } else {
            Session.set('resetToken', null);
            vex.close($vex.data().vex.id);
            vex.dialog.alert({
              message:'Your password has been reset.',
              callback:function() {
                Router.go('/editor');
              }
            })
          }
        })
      }
    });
  }
};