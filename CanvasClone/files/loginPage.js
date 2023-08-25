let x = new XMLHttpRequest();
var domain = document.getElementById("domainInput");
var tokenInput = document.getElementById("tokenInput");
var updateButton = document.getElementById("updateButton");

updateButton.onclick = () => {
    document.cookie = `domain=${domain.value}`;
    document.cookie = `token=${tokenInput.value}`
    x.open("GET", "/dashboard");
    x.send();
    window.location.href = window.location.href + "dashboard";
}