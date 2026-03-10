/**
 * DB Helpers para Pipeline de Productos Externos
 * Extensión de supabase-config.js
 * 
 * Añade estos helpers a tu archivo existente o impórtalo por separado.
 * Requiere que supabase-config.js ya esté cargado (variable `supabase` disponible).
 */

// ===== EMPRESAS =====
if (!window.DB) window.DB = {};

DB.empresas = {
  async listar() {
    return await supabase.from('empresas').select('*').eq('activa', true).order('nombre');
  },
  async obtener(id) {
    return await supabase.from('empresas').select('*').eq('id', id).single();
  },
  async crear(datos) {
    datos.id = datos.id || 'emp_' + Date.now();
    return await supabase.from('empresas').insert(datos).select().single();
  },
  async actualizar(id, datos) {
    return await supabase.from('empresas').update(datos).eq('id', id).select().single();
  }
};

// ===== PRODUCTOS EXTERNOS =====
DB.productos_externos = {
  async listar(filtros = {}) {
    let query = supabase.from('productos_externos').select('*, empresas(nombre)');
    if (filtros.empresa_id) query = query.eq('empresa_id', filtros.empresa_id);
    if (filtros.estado) query = query.eq('estado', filtros.estado);
    if (filtros.tipo_producto) query = query.eq('tipo_producto', filtros.tipo_producto);
    return await query.order('creado_en', { ascending: false });
  },
  async obtener(id) {
    return await supabase.from('productos_externos').select('*, empresas(nombre)').eq('id', id).single();
  },
  async crear(datos) {
    datos.id = datos.id || 'prod_' + Date.now();
    return await supabase.from('productos_externos').insert(datos).select().single();
  },
  async actualizar(id, datos) {
    return await supabase.from('productos_externos').update(datos).eq('id', id).select().single();
  },
  async eliminar(id) {
    return await supabase.from('productos_externos').delete().eq('id', id);
  },
  async cambiarEstado(id, nuevoEstado, estadoPublico, mensajePublico) {
    const updates = { estado: nuevoEstado };
    if (estadoPublico) updates.estado_publico = estadoPublico;
    if (mensajePublico) updates.mensaje_publico = mensajePublico;
    return await supabase.from('productos_externos').update(updates).eq('id', id).select().single();
  }
};

// ===== EVALUACIONES =====
DB.evaluaciones_producto = {
  async obtenerPorProducto(productoId) {
    return await supabase.from('evaluaciones_producto').select('*')
      .eq('producto_id', productoId).order('evaluado_en', { ascending: false }).limit(1).single();
  },
  async crear(datos) {
    datos.id = datos.id || 'eval_' + Date.now();
    return await supabase.from('evaluaciones_producto').insert(datos).select().single();
  },
  async actualizar(id, datos) {
    return await supabase.from('evaluaciones_producto').update(datos).eq('id', id).select().single();
  }
};

// ===== REUNIONES =====
DB.reuniones_producto = {
  async listarPorProducto(productoId) {
    return await supabase.from('reuniones_producto').select('*')
      .eq('producto_id', productoId).order('fecha_reunion', { ascending: false });
  },
  async crear(datos) {
    datos.id = datos.id || 'reu_' + Date.now();
    return await supabase.from('reuniones_producto').insert(datos).select().single();
  }
};

// ===== DOCUMENTOS =====
DB.documentos_producto = {
  async listarPorProducto(productoId) {
    return await supabase.from('documentos_producto').select('*')
      .eq('producto_id', productoId).order('subido_en', { ascending: false });
  },
  async crear(datos) {
    datos.id = datos.id || 'doc_' + Date.now();
    return await supabase.from('documentos_producto').insert(datos).select().single();
  },
  async eliminar(id) {
    return await supabase.from('documentos_producto').delete().eq('id', id);
  }
};

// ===== HISTORIAL =====
DB.historial_producto = {
  async listarPorProducto(productoId) {
    return await supabase.from('historial_producto').select('*')
      .eq('producto_id', productoId).order('fecha', { ascending: false });
  },
  async registrar(productoId, accion, detalle, realizadoPor) {
    return await supabase.from('historial_producto').insert({
      id: 'hist_' + Date.now(),
      producto_id: productoId,
      accion: accion,
      detalle: detalle || '',
      realizado_por: realizadoPor || (window.SESION ? window.SESION.nombre : null)
    });
  }
};

// ===== STORAGE para documentos de productos =====
if (!window.StorageProductos) window.StorageProductos = {};

StorageProductos = {
  async subir(path, file) {
    return await supabase.storage.from('productos_docs').upload(path, file);
  },
  obtenerUrl(path) {
    const { data } = supabase.storage.from('productos_docs').getPublicUrl(path);
    return data?.publicUrl || '';
  }
};

// ===== FUNCIÓN: Crear pre-ensayo desde producto externo =====
async function crearPreEnsayoDesdeProducto(productoId) {
  const { data: producto, error: errProd } = await DB.productos_externos.obtener(productoId);
  if (errProd || !producto) {
    return { error: errProd || { message: 'Producto no encontrado' } };
  }

  const ensayoId = 'ens_' + Date.now();
  const empresaNombre = producto.empresas?.nombre || '';

  // Crear ensayo en tu tabla existente
  const nuevoEnsayo = {
    id: ensayoId,
    area: 'I+D - Productos externos',
    reportado_por: 'Portal proveedores (' + empresaNombre + ')',
    fecha_inicio: null,
    prioridad: producto.categoria_evaluacion === 'prioridad_alta' ? 'Alta' : 'Media',
    responsable_id: window.SESION ? window.SESION.nombre : 'I+D',
    validador_campo: '',
    metrica_objetivo: 'Evaluar ' + producto.nombre_comercial + ' para ' + producto.problema_objetivo,
    estado: 'activo',
    roi_estimado: 0,
    porcentaje_avance: 0,
    exito: false,
    publicaciones: [],
    producto_externo_id: productoId
  };

  const { data: ensayo, error: errEns } = await DB.ensayos.crear(nuevoEnsayo);
  if (errEns) return { error: errEns };

  // Actualizar producto
  await DB.productos_externos.actualizar(productoId, {
    estado: 'ensayo_campo',
    ensayo_id: ensayoId,
    estado_publico: 'En ensayo de campo',
    mensaje_publico: 'Su producto ha sido aprobado y se inició un ensayo de campo en nuestras fincas.'
  });

  // Registrar en historial
  await DB.historial_producto.registrar(
    productoId,
    'Pre-ensayo creado',
    'Ensayo ID: ' + ensayoId + ' — ' + nuevoEnsayo.metrica_objetivo
  );

  return { data: ensayo, ensayoId: ensayoId };
}

console.log('✅ DB Helpers de Productos Externos cargados');
