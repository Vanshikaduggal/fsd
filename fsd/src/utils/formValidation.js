export const register = () => {
    let a = document.forms['form']['name'].value;
    if (a === "") {
        alert("Please enter the name");
        return false;
    }
    let b = document.forms['form']['email'].value;
    if (b === "") {
        alert("Please enter the email");
        return false;
    }
    let c = document.forms['form']['upload'].value;
    if (c === "") {
        alert("Please upload the file");
        return false;
    }
    return true;
};
