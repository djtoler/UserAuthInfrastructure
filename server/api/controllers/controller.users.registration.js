const asyncHandler = require("express-async-handler");
const {runIsUserValidated, runCreateAndReturnNewUser} = require("../../functions/registration.route.helpers");
const { errorsArray } = require("../../functions/registration.helpers");
const { registration } = require("../../functions/event-emitters");

const runUserRegistrationService = asyncHandler(async (req, res) => {
    const { image, name, email, password, confirmPassword } = req.body;
    console.log(req.body, "request body <---");
    const validationFailed = await runIsUserValidated(errorsArray, name, email, password, confirmPassword);
    const isUserCreated = await runCreateAndReturnNewUser(image, name, email, password) 
    
    if (validationFailed) 
        {return res.json(validationFailed)}
    
    isUserCreated.newUser ? 
        res.json({msg: isUserCreated.registrationSucceded, newUser: isUserCreated.newUser, token: isUserCreated.token}) 
        : 
        res.json({msg: isUserCreated.registrationFailed})
    
    registration.emit("update_admin");
})

module.exports = runUserRegistrationService, registration;