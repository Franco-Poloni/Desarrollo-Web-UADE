

$(document).ready(function(){
    $("#btnLogin").click(function() {
        const inputUser = $("#User").val();
        const inputPass = $("#Pass").val();

        $.getJSON("../appSettings.json", function(data) {
            const usuarioEncontrado = data.users.find(u => 
                u.user === inputUser && u.password === inputPass
            );

            if (usuarioEncontrado) {
                alert("✅ Inicio de sesión correcto. Bienvenido " + usuarioEncontrado.user);
                sessionStorage.setItem("usuarioLogueado", "1");
                window.location.href = "../pages/index.html"
                //redirigir
            } else {
                alert("❌ Usuario o contraseña incorrectos");
            }
        }).fail(function() {
            alert("Error al cargar el archivo JSON");
        });
    });
});

const logueado = sessionStorage.getItem("usuarioLogueado")

if (logueado == 1){
    $(".login").hide()
    $(".logout").show()
    console.log(logueado)

} else {
    $(".logout").hide()
    $(".login").show()
}

console.log(logueado)



