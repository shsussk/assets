// auth-guard.js
// Incluir en TODAS las páginas protegidas (dashboard, ensayos, problemas, etc.)
// <script src="auth-guard.js"></script>

(function() {
  var sesion = localStorage.getItem('sesion_activa');

  if (!sesion) {
    window.location.href = 'login.html';
    return;
  }

  var user = JSON.parse(sesion);

  // Verificar que el usuario sigue aprobado
  var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  var userActual = usuarios.find(function(u) { return u.id === user.id; });

  if (!userActual || userActual.estado !== 'aprobado') {
    localStorage.removeItem('sesion_activa');
    window.location.href = 'login.html';
    return;
  }

  // Actualizar rol en sesión por si el admin lo cambió
  user.rol = userActual.rol;
  localStorage.setItem('sesion_activa', JSON.stringify(user));

  // Exponer la sesión y funciones de rol globalmente
  window.SESION = user;

  window.esAdmin = function() { return user.rol === 'admin'; };
  window.esEditor = function() { return user.rol === 'admin' || user.rol === 'editor'; };
  window.esLector = function() { return true; }; // todos los aprobados son al menos lectores

  window.cerrarSesion = function() {
    localStorage.removeItem('sesion_activa');
    window.location.href = 'login.html';
  };

  // Ocultar botones de edición para lectores
  document.addEventListener('DOMContentLoaded', function() {
    if (!window.esEditor()) {
      // Ocultar botones de crear/editar/eliminar
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
