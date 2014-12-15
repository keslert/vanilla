Template.editor.events({
  'click .sidebar button': function(e, t) {
    $('.preview-wrapper').toggleClass('hidden', false);
  },
  'click .preview-wrapper button': function(e, t) {
    $('.preview-wrapper').toggleClass('hidden', true);
  }
});

Template.editor.rendered = function() {
  if(!this.first) {
    this.first = true;

    switchingFiles = false;

    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.setShowPrintMargin(false);
    attachStyleSheet();

    editor.on("change", function(e) {
      if(!switchingFiles) {
        var content = editor.getSession().getValue();
        updateFileContent(content);
        updatePreview();
      }
    });

    Tracker.autorun(function() {
      var file = getActiveFile();
      if(file && editor.filename != file.name) {
        switchingFiles = true;
        updateEditorContent(file);
        editor.filename = file.name;
        editor.fileType = getFileType(file);
        updatePreview();
        switchingFiles = false;
      }
    })
  }
}

function updateEditorContent(file) {
  editor.getSession().setMode("ace/mode/" + getFileType(file));
  editor.getSession().setValue(file.content);
}

function getFileType(file) {
  var i = file.name.lastIndexOf('.');
  return file.name.substring(i+1);
}

function getActiveFile() {
  return Files.findOne(Session.get("active_file"));
}

var updateFileContent = _.debounce(function(content) {
  var file = getActiveFile();
  Meteor.call('updateFile', file._id, content);
}, 300);

var updateStyleSheet = _.debounce(function(content) {
  var doc = $('.preview-wrapper iframe')[0].contentWindow.document;
  var style = doc.createElement("style");
  style.textContent = content;
  // WebKit hack :(
  style.appendChild(doc.createTextNode(""));
  doc.head.appendChild(style);
  return style.sheet;
}, 300);

var updatePreview = _.debounce(function() {
  var doc = $('.preview-wrapper iframe')[0].contentWindow.document;

  var file = getActiveFile();
  var type = getFileType(file);
  if(type == 'html') {
    $('body', doc).html(file.content);
  } else if(type == 'css') {
    $('head', doc).find('style').text(file.content);
  }
}, 300);

function confirmOnPageExit(e)  {
  e = e || window.event;
  var message = 'All data is currently temporary and will be lost.';
  if (e) {
    e.returnValue = message;
  }
  return message;
};
// window.onbeforeunload = confirmOnPageExit;

function attachStyleSheet() {
  var doc = $('.preview-wrapper iframe')[0].contentWindow.document;
  var style = doc.createElement("style");
  var file = Files.findOne({name:'style.css'});
  style.textContent = file.content;
  // WebKit hack :(
  style.appendChild(doc.createTextNode(""));
  doc.head.appendChild(style);
}