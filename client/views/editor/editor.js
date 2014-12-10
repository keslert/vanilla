Template.editor.helpers({

});

Template.editor.events({
  'click .sidebar button': function(e, t) {
    $('.preview-wrapper').toggleClass('hidden', false);
  },
  'click .preview-wrapper button': function(e, t) {
    $('.preview-wrapper').toggleClass('hidden', true);
  }
});