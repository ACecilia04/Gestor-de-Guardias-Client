// src/auth/permissions.js
export const permisosPorRol = {
  desarrollador: ['*'],
  administrador: ['workers', 'students', 'users', 'configuration'],
  planificador: ['planif', 'plantilla'],
  controlador: ['assistance']
}

export function puedeVer(rol, clave) {
  if (typeof rol !== 'string' || typeof clave !== 'string') return false
  const permisos = permisosPorRol[rol.toLowerCase()] || []
  return permisos.includes('*') || permisos.includes(clave.toLowerCase())
}

