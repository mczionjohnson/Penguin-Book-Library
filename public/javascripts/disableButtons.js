const input = document.getElementById('username');
const submitButton = document.getElementById('submit');

if (input = req.params.username) {
    input.addEventListener("keyup", (e) => {
    const value = e.currentTarget.value;
    if (value != "") {
        submitButton.disabled = false
    } else {
        submitButton.disabled = true
    }
});
}