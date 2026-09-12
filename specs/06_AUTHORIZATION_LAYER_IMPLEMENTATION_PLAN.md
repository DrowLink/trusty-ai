# TRUSTY: plan de implementación de la capa de autorización

Fecha: 2026-09-11. Estado: propuesta de implementación, sin cambios funcionales ni integraciones activadas.

## Objetivo y alcance

TRUSTY autoriza acciones financieras de agentes según la autoridad delegada por una empresa, sus políticas y el contexto de cada operación. El proveedor financiero conserva sus controles de fondos, tarjeta y procesamiento. Una aprobación de TRUSTY no significa pago ejecutado ni liquidado.

Primer caso propuesto: un agente de compras solicita una compra en USD para un proveedor autorizado. TRUSTY comprueba mandato, presupuesto acumulado y reglas; permite continuar, rechaza o solicita aprobación humana. El resultado posterior se vincula a la decisión original.

Comprador inicial propuesto: responsable de Finanzas/Operaciones con un equipo que ya automatiza compras; contraparte técnica: responsable de la integración del agente. Brex, Ramp y Slash son ecosistemas de integración potenciales; no se presupone una relación comercial con ellos.

Hipótesis de diferenciación a validar: autoridad por agente y tarea, controles consistentes entre proveedores y evidencia que vincula mandato, decisión y resultado. Validar que esto resuelve algo que los controles existentes del cliente no cubren.

## Hallazgos del repositorio

- `src/app/api/decision/route.ts`: recibe una acción y devuelve una evaluación; no autentica al solicitante ni persiste la decisión en esta ruta. El principal procede del cuerpo enviado por el cliente.
- `src/lib/scoring/creditEngine.ts`: reutilizable como referencia de reglas y explicación. Incluye historial fijo, excepciones por nombre que contiene `procurement`, AVUD derivado de estrellas y textos de ejecución/telemetría sin ejecución correspondiente. Estos datos deben quedar confinados a fixtures de demo.
- La comprobación de capacidad compara una operación con un límite diario; no agrega gasto ni reserva presupuesto concurrentemente.
- La evaluación de comercio utiliza palabras en su nombre; hace falta identidad de contraparte/MCC procedente del proveedor y listas configuradas por empresa.
- `supabase/schema.sql`: contiene perfiles y agentes; faltan organizaciones, delegaciones, políticas, reservas, decisiones, aprobaciones, ejecuciones y eventos. Las políticas abiertas actuales no son adecuadas para estos datos privados.
- `src/components/DecisionPlayground.tsx`: punto de partida para una demo de autorización. El ranking y los reportes de confianza pasan a ser información secundaria.

## Arquitectura propuesta

Flujo: agente autenticado -> intención de compra -> motor de políticas -> decisión persistida + reserva -> aprobación humana si procede -> punto de ejecución controlado -> proveedor -> eventos de resultado -> conciliación.

Dos modos de integración, explícitos en el producto:

1. Preautorización del flujo: el agente solicita permiso y un ejecutor controlado consume una autorización de un solo uso. El agente no posee credenciales que permitan saltarse el ejecutor. Un SDK que sólo devuelve una recomendación no constituye enforcement.
2. Autorización en el proveedor: un callback de autorización consulta TRUSTY antes del procesamiento. Debe existir un vínculo verificable entre tarjeta, empresa, agente e intención; no atribuir automáticamente todo gasto de una tarjeta compartida a un agente.

Slash documenta callbacks de autorización Enterprise con timeout por defecto de 1,5 segundos y fallback configurable. Es el candidato técnico inicial, condicionado a acceso y compatibilidad del piloto. Usar `fallbackBehavior: reject` para el piloto controlado. Un resultado interno `HUMAN_REVIEW` se resuelve antes del intento de tarjeta; en un callback síncrono se rechaza el intento pendiente de aprobación y se permite un nuevo intento autorizado posteriormente.

Brex documenta tarjetas virtuales con límites. Ramp documenta recursos de tarjetas y restricciones. Antes de prometer bloqueo por transacción en estos proveedores, verificar capacidades, scopes, acceso de producción y punto exacto de ejecución. Los webhooks de notificación sirven para resultados y no prueban capacidad de veto previo.

Mantener Next.js para consola y API inicial, Supabase/Postgres como fuente persistente. Aislar el motor puro de autorización y los adaptadores. El callback no debe hacer crawling ni invocar un LLM: utiliza políticas y contexto preparados. Medir latencia incluyendo base de datos y arranques antes de decidir si requiere un servicio dedicado.

## Contrato funcional

Entrada: identidad autenticada de organización/agente, `delegationId`, `intentId`, tipo de acción, importe en unidades menores enteras, moneda, contraparte, categoría, referencia de compra, proveedor y clave de idempotencia. Resolver organización y permisos desde credenciales, nunca confiar en un `principal` libre.

Salida: `decisionId`, `ALLOW | DENY | REQUIRE_APPROVAL`, códigos de motivo, reglas evaluadas, versión de política, reserva si aplica, fecha de expiración y referencia de evidencia. Estado de ejecución independiente.

Una concesión de ejecución queda vinculada a la intención completa: organización, agente, acción, importe, moneda, contraparte y política. Es de un solo uso, con vencimiento. Cambiar esos datos exige reevaluación. Una revocación o cambio relevante de política se comprueba otra vez antes de ejecutar.

Reglas iniciales: mandato vigente; agente activo; acción permitida; contraparte permitida; monto por operación; presupuesto diario/mensual compartido; umbral de aprobación; frecuencia; contexto requerido. Un score público puede aportar evidencia, pero no concede autoridad que la empresa no delegó. Evaluar bloqueos antes de proponer aprobación humana.

## Datos y garantías

Entidades: `organizations`, `memberships`, `agent_identities`, `delegations`, `policies`, `policy_versions`, `payment_connections`, `payment_instruments`, `intents`, `decisions`, `budget_reservations`, `approvals`, `executions`, `provider_events`, `audit_events`.

- Aislamiento por organización y roles de administrador, aprobador, operador y lector. Secretos sólo en servidor; agentes sin capacidad para alterar su política o aprobarse.
- Reservar presupuesto en una transacción con control de concurrencia. Considerar reservas abiertas y gasto confirmado; definir liberación por expiración, rechazo y reversión. Un resultado incierto no libera presupuesto automáticamente.
- Unicidad de idempotencia por organización/operación. Misma clave con payload distinto devuelve conflicto. Evitar duplicar reserva, ejecución o métrica.
- Registrar ejecución solicitada, enviada, pendiente, confirmada, fallida o desconocida por separado. Timeout del proveedor exige conciliación antes de reintentar un cargo.
- Verificar firmas de webhooks con el esquema específico del proveedor. Deduplicar eventos y tolerar llegada desordenada; capturas parciales, reversos y reembolsos requieren contabilidad explícita.
- Registro de auditoría append-only para los roles de aplicación, con actor, evidencia y versión de política. No afirmar inmutabilidad criptográfica sin implementarla.
- Fallos de autenticación, política o persistencia bloquean la ejecución. Interruptor de emergencia por agente y organización; su reactivación requiere un rol autorizado.

## Sprint de 14 días: sandbox y preparación de piloto

Estimación de alcance, no promesa de producción. Asume dedicación de backend e interfaz y un responsable de producto/pilotos; ajustar duración a la capacidad real del equipo. Las dependencias de acceso del proveedor pueden desplazar la integración.

### Días 1-2: contrato y flujo prioritario

Responsabilidad: producto + backend.

- Confirmar con un cliente el flujo de compra, punto de bloqueo, proveedor disponible y responsable de aprobación.
- Definir contrato, estados, política de ejemplo y criterios de evidencia.
- Reescribir posicionamiento en PRODUCT/README y separar modo demo de datos reales.
- Preparar ejemplos reproducibles: compra permitida, comercio bloqueado, umbral humano, exceso acumulado y agente revocado.

Salida: especificación y fixtures con resultado esperado; acceso solicitado por el cliente al proveedor elegido. No requiere construir tres conectores.

### Días 3-5: núcleo de autorización

Responsabilidad: backend.

- Migraciones privadas con RLS, autenticación de agentes y delegaciones.
- Motor determinista, política versionada, idempotencia y reserva atómica.
- `POST /api/v1/authorizations` y consulta de decisión.
- Conservar `/api/decision` como simulación explícita o adaptador compatible, sin poder de ejecución implícito.

Salida: dos solicitudes simultáneas no pueden exceder el presupuesto; otro tenant no puede ver ni modificar decisiones.

### Días 6-8: aprobación y consola

Responsabilidad: interfaz + backend.

- Cola de solicitudes, detalle de decisión, presupuesto disponible/reservado, editor básico de políticas e interruptor de emergencia.
- Aprobar/rechazar mediante identidad del aprobador, con vencimiento y reevaluación de los bloqueos antes de ejecutar.
- `POST /api/v1/approvals/{id}/approve`, `/reject` y ejecución de concesión de un solo uso.
- Instrumentar onboarding: organización creada -> agente registrado -> política activa -> primera decisión válida.

Salida: demo completa sin proveedor externo; aprobar un monto no permite ejecutar otro.

### Días 9-11: primer adaptador y resultados

Responsabilidad: backend/integraciones.

- Adaptador Slash si se obtiene acceso; en su defecto adaptador de sandbox claramente rotulado y piloto en observación, sin anunciar bloqueo real.
- Correlación de intención y tarjeta; callback con presupuesto de latencia y fallback probado.
- Ingesta autenticada de resultados, conciliación e historial persistente.
- Pruebas de duplicados, eventos desordenados, timeout, firma inválida y revocación.

Salida: una operación rastreable desde intención hasta resultado en sandbox. Para callback de Slash, objetivo provisional p99 interno <500 ms y respuesta total dentro del plazo documentado, bajo carga acordada.

### Días 12-14: paquete de piloto y validación

Responsabilidad: producto + ingeniería.

- Guía de integración y ejemplo ejecutable, demo de dos minutos, alcance de 30 días y métricas acordadas.
- Validar con 2-3 candidatos que pueden aportar intención previa, resultados y responsable interno; meta comercial, no resultado garantizado.
- Comparar decisiones en modo observación con el proceso existente. Separar desacuerdos de política, errores técnicos y revisión realmente innecesaria.
- Entregar reporte de pruebas y decisión explícita de avanzar o mantener sandbox.

Salida: piloto definido con datos, dueño y criterios de éxito. Día 14 no implica que tres proveedores estén integrados ni que producción esté aprobada.

## Piloto de 30 días posterior

Semana 1: observación sin afectar pagos; comprobar atribución, cobertura y reglas con el cliente.

Semana 2: activar control para un conjunto pequeño de agentes, proveedores y montos; mantener aprobador humano y reversión operativa del despliegue.

Semanas 3-4: ampliar sólo si concurrencia, conciliación y disponibilidad cumplen criterios. Priorizar el segundo proveedor según demanda y acceso; dejar el tercero para después de verificar que el modelo común funciona.

## Pruebas que condicionan el paso a control real

- Rechazo de acceso cruzado entre organizaciones, credenciales revocadas y elevación de privilegios.
- Presupuesto correcto con concurrencia, reintentos y distintas monedas; MVP rechaza monedas no soportadas.
- Aprobación expirada, payload modificado y permiso consumido no autorizan ejecución.
- Ningún estado de pago exitoso sin evento confirmado del proveedor.
- Webhooks repetidos/desordenados no duplican gasto ni decisiones; firma inválida no modifica estado.
- Timeout y caída de base de datos/proveedor no permiten gasto por defecto; conciliación resuelve estados desconocidos.
- Caso extremo: muchas compras pequeñas cuyo total excede el presupuesto; bloqueo aunque cada compra individual sea pequeña.
- Verificar que el flujo no pueda saltarse TRUSTY con credenciales alternativas dentro del alcance declarado del piloto.

## Ajuste del GTM y medición

El deck original prioriza búsqueda pública y perfiles en semana 1, seguido de pilotos en semana 2. Con la nueva instrucción, la entrada freemium pasa a ser sandbox de autorización + ejemplo SDK, y el CTA principal a integrar una primera decisión. El crawler y el badge quedan como adquisición secundaria.

Métricas principales:

- Decisiones válidas únicas por día, separadas por sandbox, observación y control real. Excluir reintentos y tráfico sintético.
- Organizaciones que integran y vuelven a enviar decisiones, tiempo a primera decisión y pilotos con responsable y acceso a resultados.
- Volumen bajo decisión: importe de intenciones únicas evaluadas en USD; mostrar por separado solicitado, permitido, rechazado y ejecutado confirmado. No sumar esos estados entre sí ni contar capturas como nuevas intenciones.
- Cobertura de resultados: ejecuciones elegibles con resultado conciliado / ejecuciones elegibles, usando una ventana de maduración acordada.
- Revisión humana por intención y tiempo de resolución comparados con la línea base del cliente.
- Violaciones de política bloqueadas, falsos bloqueos adjudicados, latencia y errores. Un rechazo no equivale automáticamente a fraude o pérdida evitada.

La meta de 1.000 solicitudes/día del deck es una aspiración de distribución; para este giro la evidencia decisiva es uso integrado y repetido, con capacidad real de control y resultados verificables. No estimar ROI ni pérdidas evitadas a partir de fixtures.

## Fuera del primer alcance

Crédito concedido por TRUSTY, límites derivados de estrellas de GitHub, modelos predictivos sin datos, integración simultánea de tres proveedores, stablecoins, contratos y transferencias genéricas. La abstracción puede crecer a esos procesos después de cerrar el primer circuito de autorización y conciliación.

## Fuentes y dependencias verificadas

- GTM original: `C:/Users/paulo/Downloads/TRUSTY_BOT_14_Day_GTM_Deck.pdf`, 11 páginas; metas y secuencia originales, ajustadas por la instrucción posterior del usuario.
- Demo conceptual: `C:/Users/paulo/Downloads/AGENTICRA_Demo_Data_Trust_and_Credit.pdf`, 10 páginas; distingue confianza y crédito e ilustra el feedback de resultados. No prueba conexiones productivas.
- Slash: https://docs.slash.com/api-reference/authorization-webhook-overview (acceso Enterprise, timeout, firma y fallback).
- Slash eventos: https://docs.slash.com/api-reference/webhook-overview (duplicados, orden y firma de notificaciones).
- Brex: https://developer.brex.com/examples/team_examples (tarjetas virtuales con límites).
- Ramp: https://docs.ramp.com/developer-api/v1/api/cards (referencia de tarjetas; validar contrato detallado y permisos antes del adaptador).

La revisión fue de código y documentación; no se probaron cuentas ni conexiones productivas. Pendientes que afectan el calendario: equipo disponible, primer cliente, acceso del proveedor y método de ejecución/correlación admitido.
