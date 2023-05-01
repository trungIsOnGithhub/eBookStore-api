const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// https://stackoverflow.com/questions/7605198/how-does-b-work-when-using-regular-expressions
// https://stackoverflow.com/questions/10940137/regex-test-v-s-string-match-to-know-if-a-string-matches-a-regular-expression
const validatePhone = phone => { return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone) };

module.exports = {
    validateEmail,
    validatePhone
};