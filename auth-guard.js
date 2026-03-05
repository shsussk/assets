var SESION = null;

(function() {
  var sesionStr = localStorage.getItem('sesion_activa');
  if (sesionStr) {
    try {
      SESION = JSON.parse(sesionStr);
    } catch (e) {
      SESION = null;
    }
  }

  var rutaActual = window.location.pathname;
  var esLogin = rutaActual.includes('login.html');

  if (!SESION && !esLogin) {
    window.location.href = 'login.html';
  }
})();

function esAdmin() {
  return SESION && SESION.rol === 'admin';
}

function cerrarSesion() {
  localStorage.removeItem('sesion_activa');
  window.location.href = 'login.html';
}
