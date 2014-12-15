Meteor.startup(function () {
  smtp = {
    username: 'vanilla.editor.garbage@gmail.com',   // eg: server@gentlenode.com
    password: '1b7a22bd0985f5d440b325f5988ac7b8',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.gmail.com',  // eg: mail.gandi.net
    port: 465
  }
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});