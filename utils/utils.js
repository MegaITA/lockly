module.exports = {

  isAdmin: (admins, userID) => {

    for(let admin of admins) {

      if(admin.user.id == userID)
        return true;
    
    }

    return false;
  
  }

}