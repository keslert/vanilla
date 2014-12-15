Accounts.emailTemplates.siteName = "Vanilla";
Accounts.emailTemplates.from = "Vanilla Support <accounts@example.com>";
Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Password Reset Instructions";
};
Accounts.emailTemplates.resetPassword.text = function (user, url) {
   return "Hello,\n\n"
        + "To reset your password, simply click the link below.\n\n"
        + url.replace("#/","");
};