function validarForm(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let psw = document.getElementById("psw").value;
    let rPsw = document.getElementById("rpsw").value;


    const mail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let email = document.getElementById("mail").value;

    if (nombre == "") {
        alert("El nombre no puede estar en blanco");
        return false;
    }

    if (nombre.length > 20) {
        alert("El nombre es demasiado largo");
        return false;
    }

    if (apellido == "") {
        alert("El apellido no puede estar en blanco");
        return false;
    }

    if (apellido.length > 20) {
        alert("El apellido es demasiado largo");
        return false;
    }

    if (!mail.test(email)) {
        alert("No es un mail válido");
        return false;
    }
    
    if (psw == "") {
        alert("La contraseña no puede estar en blanco");
        return false;
    }
    
    if (rPsw == "") {
        alert("La contraseña no puede estar en blanco");
        return false;
    }

    if (psw.length < 8 || rPsw.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return false;
    }

    if (rPsw != psw) {
        alert("Las contraseñas no coinciden");
        return false;
    }    

    alert("El fomulario fue enviado con éxito");
    form.submit();
   
}

let form = document.getElementById("registro");
form.addEventListener("submit", validarForm);


