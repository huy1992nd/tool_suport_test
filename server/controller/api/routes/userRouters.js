module.exports = function(app) {
    var user = require('../../mongo/user_controller');
    app.route("/login")
        .post(user.sign_in);

    app.route("/check_aut")
        .post((a,b) =>user.check_aut(a,b));

    app.route("/logout")
        .post(user.loginRequired,user.sign_out);
    //web
    app.route("/list_user")
    .post(user.loginRequired,user.list_all);
    app.route("/insert_user")
    .post(user.loginRequired,user.insert);
    app.route("/update_user")
    .post(user.loginRequired,user.update);

    app.route("/login_web")
    .post(user.login_web);
    app.route("/remove_user")
    .post(user.loginRequired,user.remove);

};


