// Conexión a Supabase
var SUPABASE_URL = 'https://wflinxrolwjisvynveqv.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmbGlueHJvbHdqaXN2eW52ZXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzgwMjQsImV4cCI6MjA4NjQxNDAyNH0.QmNiqpbC4s166SzYk6GlivFiKdqPCnFoeC7yuqKpy-U';

var _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funciones para ENSAYOS
var DB = {
  ensayos: {
    listar: function() { return _sb.from('ensayos').select('*').order('created_at', {ascending: false}); },
    crear: function(data) { return _sb.from('ensayos').insert(data); },
    actualizar: function(id, data) { return _sb.from('ensayos').update(data).eq('id', id); },
    eliminar: function(id) { return _sb.from('ensayos').delete().eq('id', id); }
  },
  problemas: {
    listar: function() { return _sb.from('problemas').select('*').order('created_at', {ascending: false}); },
    crear: function(data) { return _sb.from('problemas').insert(data); },
    actualizar: function(id, data) { return _sb.from('problemas').update(data).eq('id', id); },
    eliminar: function(id) { return _sb.from('problemas').delete().eq('id', id); }
  },
  colaboradores: {
    listar: function() { return _sb.from('colaboradores').select('*').order('created_at', {ascending: false}); },
    crear: function(data) { return _sb.from('colaboradores').insert(data); },
    actualizar: function(id, data) { return _sb.from('colaboradores').update(data).eq('id', id); },
    eliminar: function(id) { return _sb.from('colaboradores').delete().eq('id', id); }
  },
  historias: {
    listar: function() { return _sb.from('historias_exito').select('*').order('created_at', {ascending: false}); },
    crear: function(data) { return _sb.from('historias_exito').insert(data); },
    actualizar: function(id, data) { return _sb.from('historias_exito').update(data).eq('id', id); },
    eliminar: function(id) { return _sb.from('historias_exito').delete().eq('id', id); }
  },
  usuarios: {
    listar: function() { return _sb.from('usuarios').select('*').order('fecha_registro', {ascending: false}); },
    crear: function(data) { return _sb.from('usuarios').insert(data); },
    actualizar: function(id, data) { return _sb.from('usuarios').update(data).eq('id', id); },
    eliminar: function(id) { return _sb.from('usuarios').delete().eq('id', id); },
    buscarPorEmail: function(email) { return _sb.from('usuarios').select('*').eq('email', email).single(); }
  }
};
