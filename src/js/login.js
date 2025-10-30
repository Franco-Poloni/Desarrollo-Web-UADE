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
            } else {
                alert("❌ Usuario o contraseña incorrectos");
            }
        }).fail(function() {
            alert("Error al cargar el archivo JSON");
        });
    });
});

console.log("Hola");


