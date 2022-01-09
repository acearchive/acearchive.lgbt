document.addEventListener("clipboard-copy", function(event) {
    const button = event.target;

    button.querySelector(".clipboard-copy").setAttribute("hidden", true);
    button.querySelector(".clipboard-copy-confirmed").removeAttribute("hidden");

    setTimeout(function() {
    button.querySelector(".clipboard-copy").removeAttribute("hidden");
    button.querySelector(".clipboard-copy-confirmed").setAttribute("hidden", true);
    }, 1000);
})
