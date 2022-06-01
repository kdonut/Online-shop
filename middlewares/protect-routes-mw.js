function protectRoutes(req,res,next){
    console.log('Jestem w protec routes');
    
    
    if(!res.locals.isAuth) {
        return res.redirect('/401');
    }
    
    if(req.path.startsWith('/admin') && !res.locals.isAdmin){
        return res.redirect('/403');
        
    }
    next();

}

module.exports = protectRoutes;