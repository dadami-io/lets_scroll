document.getElementById("btn").onclick = function() {
    let num = document.getElementById("num").value || false;
    if (!isNaN(num)) location.href = `/view.html?number=${num}`;
}
