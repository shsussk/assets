(function() {
  var sesion = localStorage.getItem('sesion_activa');

  if (!sesion) {
    window.location.href = 'login.html';
    return;
  }

  var user = JSON.parse(sesion);
  window.SESION = user;

  window.esAdmin = function() { return user.rol === 'admin'; };
  window.esEditor = function() { return user.rol === 'admin' || user.rol === 'editor'; };
  window.esLector = function() { return true; };

  window.cerrarSesion = function() {
    localStorage.removeItem('sesion_activa');
    window.location.href = 'login.html';
  };

  document.addEventListener('DOMContentLoaded', function() {
    if (!window.esEditor()) {
      var selectores = [
        '[onclick*="abrirModal"]',
        '[onclick*="eliminar"]',
        '[onclick*="Crear"]',
        '[onclick*="Reportar"]',
        '[onclick*="Agregar"]',
        '[onclick*="Nueva"]'
      ];
      selectores.forEach(function(sel) {
        document.querySelectorAll(sel).forEach(function(el) {
          el.style.display = 'none';
        });
      });
    }
  });
})();

