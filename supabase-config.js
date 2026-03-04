// Conexión a Supabase
var SUPABASE_URL = 'https://wflinxrolwjisvynveqv.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmbGlueHJvbHdqaXN2eW52ZXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzgwMjQsImV4cCI6MjA4NjQxNDAyNH0.QmNiqpbC4s166SzYk6GlivFiKdqPCnFoeC7yuqKpy-U';

var _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Objeto DB con todos los módulos
var DB = {
  // ENSAYOS (ya existente)
  ensayos: {
    listar: function() {
      return _sb.from('ensayos')
        .select('*')
        .order('created_at', { ascending: false });
    },
    crear: function(data) {
      return _sb.from('ensayos').insert(data);
    },
    actualizar: function(id, data) {
      return _sb.from('ensayos').update(data).eq('id', id);
    },
    eliminar: function(id) {
      return _sb.from('ensayos').delete().eq('id', id);
    }
  },

  // PROBLEMAS (ya existente)
  problemas: {
    listar: function() {
      return _sb.from('problemas')
        .select('*')
        .order('created_at', { ascending: false });
    },
    crear: function(data) {
      return _sb.from('problemas').insert(data);
    },
    actualizar: function(id, data) {
      return _sb.from('problemas').update(data).eq('id', id);
    },
    eliminar: function(id) {
      return _sb.from('problemas').delete().eq('id', id);
    }
  },

  // COLABORADORES (ya existente)
  colaboradores: {
    listar: function() {
      return _sb.from('colaboradores')
        .select('*')
        .order('created_at', { ascending: false });
    },
    crear: function(data) {
      return _sb.from('colaboradores').insert(data);
    },
    actualizar: function(id, data) {
      return _sb.from('colaboradores').update(data).eq('id', id);
    },
    eliminar: function(id) {
      return _sb.from('colaboradores').delete().eq('id', id);
    }
  },

  // HISTORIAS DE ÉXITO (ya existente)
  historias: {
    listar: function() {
      return _sb.from('historias_exito')
        .select('*')
        .order('created_at', { ascending: false });
    },
    crear: function(data) {
      return _sb.from('historias_exito').insert(data);
    },
    actualizar: function(id, data) {
      return _sb.from('historias_exito').update(data).eq('id', id);
    },
    eliminar: function(id) {
      return _sb.from('historias_exito').delete().eq('id', id);
    }
  },

  // USUARIOS (ya existente)
  usuarios: {
    listar: function() {
      return _sb.from('usuarios')
        .select('*')
        .order('fecha_registro', { ascending: false });
    },
    crear: function(data) {
      return _sb.from('usuarios').insert(data);
    },
    actualizar: function(id, data) {
      return _sb.from('usuarios').update(data).eq('id', id);
    },
    eliminar: function(id) {
      return _sb.from('usuarios').delete().eq('id', id);
    },
    buscarPorEmail: function(email) {
      return _sb.from('usuarios')
        .select('*')
        .eq('email', email)
        .single();
    }
  },

  // NUEVO: ARCHIVOS DE ENSAYOS
  ensayos_archivos: {
    // Lista todos los archivos de un ensayo
    listarPorEnsayo: function(ensayoId) {
      return _sb.from('ensayos_archivos')
        .select('*')
        .eq('ensayo_id', ensayoId)
        .order('creado_el', { ascending: false });
    },

    // Crea un registro de archivo (se usa después de subir a Storage)
    crear: function(data) {
      return _sb.from('ensayos_archivos').insert(data);
    },

    // Opcionales, por si luego quieres editar metadata o borrar registro
    actualizar: function(id, data) {
      return _sb.from('ensayos_archivos').update(data).eq('id', id);
    },
    eliminar: function(id) {
      return _sb.from('ensayos_archivos').delete().eq('id', id);
    }
  }
};
