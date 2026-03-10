// supabase-config.js

// 1) Inicializar Supabase (js v2 desde CDN)
// Asegúrate de tener en el HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = "https://wflinxrolwjisvynveqv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmbGlueHJvbHdqaXN2eW52ZXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzgwMjQsImV4cCI6MjA4NjQxNDAyNH0.QmNiqpbC4s166SzYk6GlivFiKdqPCnFoeC7yuqKpy-U";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Espacio global para helpers
if (!window.DB) window.DB = {};

// 2) Helpers para tabla ENSAYOS (compatibles con ensayos.html)

DB.ensayos = {
  async listar() {
    return await supabase
      .from("ensayos")
      .select("*")
      .order("fecha_inicio", { ascending: false });
  },

  async obtener(id) {
    return await supabase
      .from("ensayos")
      .select("*")
      .eq("id", id)
      .single();
  },

  async crear(datos) {
    // Si ya viene con id, lo respeta, si no genera uno.
    if (!datos.id) datos.id = "ens_" + Date.now();
    const { data, error } = await supabase
      .from("ensayos")
      .insert(datos)
      .select()
      .single();
    return { data, error };
  },

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from("ensayos")
      .update(datos)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async eliminar(id) {
    const { error } = await supabase
      .from("ensayos")
      .delete()
      .eq("id", id);
    return { error };
  }
};

// 3) Helpers para usuarios / sesión básica (si los necesitas)

if (!window.SESION) {
  // Aquí podrías hidratar SESION desde tu auth-guard.js
  window.SESION = null;
}

// 4) Helpers para EMPRESAS (productos externos)

DB.empresas = {
  async listar() {
    return await supabase
      .from("empresas")
      .select("*")
      .eq("activa", true)
      .order("nombre");
  },

  async obtener(id) {
    return await supabase
      .from("empresas")
      .select("*")
      .eq("id", id)
      .single();
  },

  async crear(datos) {
    datos.id = datos.id || "emp_" + Date.now();
    const { data, error } = await supabase
      .from("empresas")
      .insert(datos)
      .select()
      .single();
    return { data, error };
  },

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from("empresas")
      .update(datos)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }
};

// 5) Helpers para PRODUCTOS EXTERNOS

DB.productos_externos = {
  async listar(filtros = {}) {
    let query = supabase
      .from("productos_externos")
      .select("*, empresas(nombre)")
      .order("creado_en", { ascending: false });

    if (filtros.empresa_id) query = query.eq("empresa_id", filtros.empresa_id);
    if (filtros.estado) query = query.eq("estado", filtros.estado);
    if (filtros.tipo_producto) query = query.eq("tipo_producto", filtros.tipo_producto);

    const { data, error } = await query;
    return { data, error };
  },

  async obtener(id) {
    const { data, error } = await supabase
      .from("productos_externos")
      .select("*, empresas(nombre)")
      .eq("id", id)
      .single();
    return { data, error };
  },

  async crear(datos) {
    datos.id = datos.id || "prod_" + Date.now();
    const { data, error } = await supabase
      .from("productos_externos")
      .insert(datos)
      .select()
      .single();
    return { data, error };
  },

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from("productos_externos")
      .update(datos)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async eliminar(id) {
    const { error } = await supabase
      .from("productos_externos")
      .delete()
      .eq("id", id);
    return { error };
  },

  async cambiarEstado(id, nuevoEstado, estadoPublico, mensajePublico) {
    const updates = { estado: nuevoEstado };
    if (estadoPublico) updates.estado_publico = estadoPublico;
    if (mensajePublico) updates.mensaje_publico = mensajePublico;

    const { data, error } = await supabase
      .from("productos_externos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }
};

// 6) Helpers para EVALUACIONES DE PRODUCTO

DB.evaluaciones_producto = {
  async obtenerPorProducto(productoId) {
    const { data, error } = await supabase
      .from("evaluaciones_producto")
      .select("*")
      .eq("producto_id", productoId)
      .order("evaluado_en", { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },

  async crear(datos) {
    datos.id = datos.id || "eval_" + Date.now();
    const { data, error } = await supabase
      .from("evaluaciones_producto")
      .insert(datos)
      .select()
      .single();
    return { data, error };
  },

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from("evaluaciones_producto")
      .update(datos)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }
};

// 7) Helpers para REUNIONES DE PRODUCTO

DB.reuniones_producto = {
  async listarPorProducto(productoId) {
    const { data, error } = await supabase
      .from("reuniones_producto")
      .select("*")
      .eq("producto_id", productoId)
      .order("fecha_reunion", { ascending: false });
    return { data, error };
  },

  async crear(datos) {
    datos.id = datos.id || "reu_" + Date.now();
    const { data, error } = await supabase
      .from("reuniones_producto")
      .insert(datos)
      .select()
      .single();
    return { data, error };
  }
};

// 8) Helpers para DOCUMENTOS DE PRODUCTO

DB.documentos_producto = {
  async listarPorProducto(productoId) {
    const { data, error } = await supabase
      .from("documentos_producto")
      .select("*")
      .eq("producto_id", productoId)
      .order("subido_en", { ascending: false });
    return { data, error };
  },

  async crear(datos) {
    datos.id = datos.id || "doc_" + Date.now();
    const { data, error } = await supabase
      .from("documentos_producto")
      .insert(datos)
      .select()
      .single();
    return { data, error };
  },

  async eliminar(id) {
    const { error } = await supabase
      .from("documentos_producto")
      .delete()
      .eq("id", id);
    return { error };
  }
};

// 9) Helpers para HISTORIAL DE PRODUCTO

DB.historial_producto = {
  async listarPorProducto(productoId) {
    const { data, error } = await supabase
      .from("historial_producto")
      .select("*")
      .eq("producto_id", productoId)
      .order("fecha", { ascending: false });
    return { data, error };
  },

  async registrar(productoId, accion, detalle, realizadoPor) {
    const { error } = await supabase
      .from("historial_producto")
      .insert({
        id: "hist_" + Date.now(),
        producto_id: productoId,
        accion: accion,
        detalle: detalle || "",
        realizado_por: realizadoPor || (window.SESION ? window.SESION.nombre : null)
      });
    return { error };
  }
};

// 10) Storage para documentos de productos (bucket `productos_docs`)

if (!window.StorageProductos) window.StorageProductos = {};

window.StorageProductos = {
  async subir(path, file) {
    return await supabase.storage.from("productos_docs").upload(path, file);
  },
  obtenerUrl(path) {
    const { data } = supabase.storage.from("productos_docs").getPublicUrl(path);
    return data?.publicUrl || "";
  }
};

// 11) Función para crear pre-ensayo desde producto externo

async function crearPreEnsayoDesdeProducto(productoId) {
  const { data: producto, error: errProd } = await DB.productos_externos.obtener(productoId);
  if (errProd || !producto) {
    return { error: errProd || { message: "Producto no encontrado" } };
  }

  const ensayoId = "ens_" + Date.now();
  const empresaNombre = producto.empresas?.nombre || "";

  const nuevoEnsayo = {
    id: ensayoId,
    area: "I+D - Productos externos",
    reportado_por: "Portal proveedores (" + empresaNombre + ")",
    fecha_inicio: null,
    prioridad: producto.categoria_evaluacion === "prioridad_alta" ? "Alta" : "Media",
    responsable_id: window.SESION ? window.SESION.nombre : "I+D",
    validador_campo: "",
    metrica_objetivo: "Evaluar " + producto.nombre_comercial + " para " + producto.problema_objetivo,
    estado: "activo",
    roi_estimado: 0,
    porcentaje_avance: 0,
    exito: false,
    publicaciones: [],
    producto_externo_id: productoId
  };

  const { data: ensayo, error: errEns } = await DB.ensayos.crear(nuevoEnsayo);
  if (errEns) return { error: errEns };

  await DB.productos_externos.actualizar(productoId, {
    estado: "ensayo_campo",
    ensayo_id: ensayoId,
    estado_publico: "En ensayo de campo",
    mensaje_publico: "Su producto ha sido aprobado y se inició un ensayo de campo en nuestras fincas."
  });

  await DB.historial_producto.registrar(
    productoId,
    "Pre-ensayo creado",
    "Ensayo ID: " + ensayoId + " — " + nuevoEnsayo.metrica_objetivo
  );

  return { data: ensayo, ensayoId };
}

console.log("✅ Supabase inicializado y DB helpers cargados");

