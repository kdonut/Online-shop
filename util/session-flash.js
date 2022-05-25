function getSessionData(req){
    const sessionData = req.session.flashedData;
    req.session.flashedData = null;

    return sessionData;
}

function flashSessionData(req,data,action){
    req.session.flashedData = data;
    req.session.save(action);
}

module.exports = {
    getSessionData : getSessionData,
    flashSessionData : flashSessionData
}