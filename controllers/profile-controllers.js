const profile_page_get = (req, res) => {
    res.render('profile_page', {user: res.locals.currentUser})
}

module.exports = {
    profile_page_get
}