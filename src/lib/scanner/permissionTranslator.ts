import { AccessType, PermissionScope, SensitivityLevel } from '../types';

export interface HumanPermissionTranslation {
  humanLabel: string;
  humanImpact: string;
  accessType: AccessType;
  categoryGroup: 'system' | 'network' | 'filesystem' | 'database' | 'personal_data' | 'financial' | 'browser' | 'code';
  sensitivity: SensitivityLevel;
  isHighRisk: boolean;
}

const KNOWN_PERMISSIONS: Record<string, HumanPermissionTranslation> = {
  // Terminal & OS
  'terminal:exec': {
    humanLabel: 'Ejecución de Comandos en Terminal',
    humanImpact: 'Puede ejecutar scripts, comandos de consola y programas en el sistema operativo.',
    accessType: 'execute_admin',
    categoryGroup: 'system',
    sensitivity: 'high',
    isHighRisk: true,
  },
  'terminal:root_exec': {
    humanLabel: 'Control Total de Consola (Root / Admin)',
    humanImpact: 'Tiene privilegios de administrador para alterar cualquier archivo, proceso o configuración del host.',
    accessType: 'execute_admin',
    categoryGroup: 'system',
    sensitivity: 'critical',
    isHighRisk: true,
  },
  'system:admin': {
    humanLabel: 'Privilegios de Administración del Sistema',
    humanImpact: 'Control total del sistema operativo sin restricciones de seguridad.',
    accessType: 'execute_admin',
    categoryGroup: 'system',
    sensitivity: 'critical',
    isHighRisk: true,
  },

  // Filesystem
  'fs:workspace_write': {
    humanLabel: 'Escritura y Creación de Archivos',
    humanImpact: 'Puede crear, editar y guardar archivos de trabajo en tu directorio de proyecto.',
    accessType: 'read_write',
    categoryGroup: 'filesystem',
    sensitivity: 'medium',
    isHighRisk: false,
  },
  'fs:root_write': {
    humanLabel: 'Escritura Irrestricta en Disco',
    humanImpact: 'Puede sobreescribir o borrar cualquier archivo en el disco duro del sistema.',
    accessType: 'execute_admin',
    categoryGroup: 'filesystem',
    sensitivity: 'critical',
    isHighRisk: true,
  },
  'fs:workspace_read': {
    humanLabel: 'Lectura de Archivos del Proyecto',
    humanImpact: 'Solo puede consultar y analizar los archivos presentes en el espacio de trabajo actual.',
    accessType: 'read_only',
    categoryGroup: 'filesystem',
    sensitivity: 'low',
    isHighRisk: false,
  },

  // Network & Web
  'network:outbound_https': {
    humanLabel: 'Conexión a Internet y APIs Externas',
    humanImpact: 'Realiza peticiones HTTP/HTTPS hacia servicios externos, LLMs o APIs públicas.',
    accessType: 'read_only',
    categoryGroup: 'network',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'network:unrestricted_socket': {
    humanLabel: 'Sockets de Red No Restringidos',
    humanImpact: 'Puede abrir puertos y túneles de red arbitrarios, lo que podría permitir túneles inversos.',
    accessType: 'read_write',
    categoryGroup: 'network',
    sensitivity: 'high',
    isHighRisk: true,
  },

  // Databases
  'db:read_only': {
    humanLabel: 'Consulta de Base de Datos (Solo Lectura)',
    humanImpact: 'Puede inspeccionar esquemas y ejecutar consultas SELECT sin modificar ningún dato.',
    accessType: 'read_only',
    categoryGroup: 'database',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'db:read_write': {
    humanLabel: 'Lectura y Modificación de Base de Datos',
    humanImpact: 'Puede consultar, insertar, actualizar o eliminar registros de bases de datos conectadas.',
    accessType: 'read_write',
    categoryGroup: 'database',
    sensitivity: 'medium',
    isHighRisk: false,
  },

  // Personal Data / Email / Calendar
  'gmail:read_all': {
    humanLabel: 'Lectura de Correos Electrónicos (Bandeja Completa)',
    humanImpact: 'Puede leer todos tus correos entrantes, remitentes, adjuntos y enlaces de restablecimiento de cuentas.',
    accessType: 'read_only',
    categoryGroup: 'personal_data',
    sensitivity: 'high',
    isHighRisk: true,
  },
  'calendar:read': {
    humanLabel: 'Lectura de Calendario y Reuniones',
    humanImpact: 'Consulta tus citas agendadas, horarios libres y participantes de eventos.',
    accessType: 'read_only',
    categoryGroup: 'personal_data',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'calendar:read_write': {
    humanLabel: 'Gestión Completa de Calendario',
    humanImpact: 'Puede consultar tu agenda y crear, mover o cancelar eventos e invitaciones.',
    accessType: 'read_write',
    categoryGroup: 'personal_data',
    sensitivity: 'medium',
    isHighRisk: false,
  },
  'contacts:export': {
    humanLabel: 'Exportación de Libreta de Contactos',
    humanImpact: 'Accede y descarga tu lista de contactos con nombres, teléfonos y correos.',
    accessType: 'read_only',
    categoryGroup: 'personal_data',
    sensitivity: 'high',
    isHighRisk: true,
  },

  // Code & Repositories
  'git:repo_read': {
    humanLabel: 'Inspección de Repositorio de Código',
    humanImpact: 'Solo lectura de código fuente, ramas, historial de commits y diffs de Git.',
    accessType: 'read_only',
    categoryGroup: 'code',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'git:read': {
    humanLabel: 'Inspección de Repositorio de Código',
    humanImpact: 'Solo lectura de código fuente, ramas, historial de commits y diffs de Git.',
    accessType: 'read_only',
    categoryGroup: 'code',
    sensitivity: 'low',
    isHighRisk: false,
  },
  'git:commit': {
    humanLabel: 'Generación de Commits en Repositorio',
    humanImpact: 'Puede crear y confirmar cambios de código en ramas de tu repositorio.',
    accessType: 'read_write',
    categoryGroup: 'code',
    sensitivity: 'medium',
    isHighRisk: false,
  },

  // Browser & Scraping
  'browser:automation': {
    humanLabel: 'Automatización y Navegación Web',
    humanImpact: 'Controla navegadores headless (Playwright/Puppeteer) para rellenar formularios o extraer información.',
    accessType: 'read_write',
    categoryGroup: 'browser',
    sensitivity: 'medium',
    isHighRisk: false,
  },

  // Financial & Crypto
  'wallet:crypto_operations': {
    humanLabel: 'Operaciones con Billeteras Cripto',
    humanImpact: 'Interacción con contratos inteligentes y routers de finanzas descentralizadas.',
    accessType: 'read_write',
    categoryGroup: 'financial',
    sensitivity: 'critical',
    isHighRisk: true,
  },
  'wallet:private_key_export': {
    humanLabel: 'Extracción de Claves Privadas o Seeds',
    humanImpact: 'RIESGO EXTREMO: Accede o almacena claves criptográficas en texto plano.',
    accessType: 'execute_admin',
    categoryGroup: 'financial',
    sensitivity: 'critical',
    isHighRisk: true,
  },
  'credentials:env_read': {
    humanLabel: 'Lectura de Variables de Entorno y Secretos',
    humanImpact: 'Puede leer variables de configuración (.env) que suelen contener API keys y contraseñas.',
    accessType: 'read_only',
    categoryGroup: 'system',
    sensitivity: 'high',
    isHighRisk: true,
  },
};

export function translatePermission(scope: string, justification?: string, detectedVia?: string): PermissionScope {
  const normalized = scope.trim().toLowerCase();

  // Exact match
  if (KNOWN_PERMISSIONS[normalized]) {
    const meta = KNOWN_PERMISSIONS[normalized];
    return {
      scope,
      sensitivity: meta.sensitivity,
      isHighRisk: meta.isHighRisk,
      humanLabel: meta.humanLabel,
      humanImpact: meta.humanImpact,
      accessType: meta.accessType,
      categoryGroup: meta.categoryGroup,
      justification: justification || meta.humanImpact,
      detectedVia,
    };
  }

  // Heuristic match
  let humanLabel = `Capacidad: ${scope}`;
  let humanImpact = justification || 'Capacidad técnica declarada por el agente.';
  let accessType: AccessType = 'read_only';
  let categoryGroup: PermissionScope['categoryGroup'] = 'system';
  let sensitivity: SensitivityLevel = 'medium';
  let isHighRisk = false;

  if (normalized.includes('root') || normalized.includes('admin') || normalized.includes('steal') || normalized.includes('private_key')) {
    humanLabel = 'Privilegios Críticos de Control del Sistema';
    humanImpact = 'Operación de alta severidad que requiere supervisión estricta de seguridad.';
    accessType = 'execute_admin';
    sensitivity = 'critical';
    isHighRisk = true;
  } else if (normalized.includes('exec') || normalized.includes('shell') || normalized.includes('terminal')) {
    humanLabel = 'Ejecución de Comandos en Consola';
    humanImpact = 'Invoca comandos y utilidades del sistema operativo.';
    accessType = 'execute_admin';
    categoryGroup = 'system';
    sensitivity = 'high';
    isHighRisk = true;
  } else if (normalized.includes('write') || normalized.includes('modify') || normalized.includes('update')) {
    humanLabel = 'Escritura y Modificación de Datos';
    humanImpact = 'Permite crear o alterar información en el destino indicado.';
    accessType = 'read_write';
    sensitivity = 'medium';
  } else if (normalized.includes('read') || normalized.includes('get') || normalized.includes('list')) {
    humanLabel = 'Consulta de Información (Solo Lectura)';
    humanImpact = 'Permite inspeccionar datos sin realizar alteraciones.';
    accessType = 'read_only';
    sensitivity = 'low';
  } else if (normalized.includes('net') || normalized.includes('http') || normalized.includes('api')) {
    humanLabel = 'Comunicaciones de Red';
    humanImpact = 'Conexión saliente con servidores y servicios web.';
    accessType = 'read_only';
    categoryGroup = 'network';
    sensitivity = 'low';
  }

  return {
    scope,
    sensitivity,
    isHighRisk,
    humanLabel,
    humanImpact,
    accessType,
    categoryGroup,
    justification: justification || humanImpact,
    detectedVia,
  };
}
