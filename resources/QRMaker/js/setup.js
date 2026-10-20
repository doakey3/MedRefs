var generate_btn = document.getElementById("generate_btn");
var qr_link = document.getElementById("qr_link");
var qr_size = document.getElementById("qr_size");
var qr_code = document.getElementById("QRCode");

function generateQRCode() {
    var link = qr_link.value.trim();
    var size = parseInt(qr_size.value, 10);

    if (link === "") {
        return;
    }

    if (!size || size < 1) {
        size = 128;
        qr_size.value = size;
    }

    qr_code.innerHTML = "";

    new QRCode(qr_code, {
        text: link,
        width: size,
        height: size,
        correctLevel: QRCode.CorrectLevel.M
    });
}

generate_btn.addEventListener("click", generateQRCode);

qr_link.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        generateQRCode();
    }
});

qr_size.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        generateQRCode();
    }
});
