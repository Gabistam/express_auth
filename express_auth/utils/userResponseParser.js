exports.userResponseParser = (user)=>{
    return {
        id: user.id || null,
        email: user.email,
        username: user.username
    }
}