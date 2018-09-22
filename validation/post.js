const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};
    
    data.text = !isEmpty(data.text) ? data.text : '';

    if(!Validator.isLength(data.text, {min: 10, max: 300})){
        errors.text = `Posr must be between 10 and 300`
    }
    if(Validator.isEmail(data.text)){
        errors.text = `Text field is required`;
    }

    /** Inserting the error value */
    return {
        errors: errors,
        isValid: isEmpty(errors)
    }
}