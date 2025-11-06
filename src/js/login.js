

$(document).ready(function(){
    if ($("#btnLogin").length) {
    $("#btnLogin").click(function() {
        const inputUser = $("#User").val();
        const inputPass = $("#Pass").val();

        $.getJSON("../appSettings.json", function(data) {
            const usuarioEncontrado = data.users.find(u => 
                u.user === inputUser && u.password === inputPass
            );

            if (usuarioEncontrado) {
                alert("✅ Inicio de sesión correcto. Bienvenido " + usuarioEncontrado.user + ".");
                sessionStorage.setItem("usuarioLogueado", "1");
                sessionStorage.setItem("usuarioNombre", usuarioEncontrado.user);
                window.location.href = "../pages/index.html"
                //redirigir
            } else {
                alert("❌ Usuario o contraseña incorrectos");
            }
        }).fail(function() {
            alert("Error al cargar el archivo JSON");
        });
    });

        
        
    }

    const logueado = sessionStorage.getItem("usuarioLogueado")
    if (logueado == 1){
        $(".login").hide()
        $(".logout").show()
        console.log(sessionStorage.getItem("usuarioLogueado"))
    } else {
        $(".logout").hide()
        $(".miCuenta").hide()
        $(".login").show()
    }

    /*MI CUENTA*/
    $(".logout").click(function(e) {
        e.preventDefault();
        $(".miCuenta").toggle();

        const nombre = sessionStorage.getItem("usuarioNombre");
        $(".miCuenta").html(
            `<p style="margin:15px;">¡Bienvenido, <strong>${nombre}</strong>!</p>
            <a class="salir" href="../pages/index.html"><strong>SALIR</strong></a>`
        );

        /*SALIR*/
        $(".salir").click(function() {
        sessionStorage.clear();
        alert("Usted ha salido de su cuenta exitosamente.");
        });

    });

    $(document).click(function(e) {
        if (!$(e.target).closest('.user-menu').length) {
            $(".miCuenta").hide();
        }
    });


});
