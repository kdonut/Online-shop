//funkcja potrzebna przy logowaniu do wprowadzenia go do sesji i dalszych akcji z tym zwiazanych

function createUserSession(req,user,action) {
    //w sesji mozemy zapisywac co chcemy np uid
    req.session.uid = user._id.toString();
    req.session.isAdmin = user.isAdmin;

 
    req.session.save(action);

}


function destroyUserAuthSesion(req){
    req.session.uid = null;
}

module.exports = {
    createUserSession : createUserSession,
    destroyUserAuthSesion: destroyUserAuthSesion
 }