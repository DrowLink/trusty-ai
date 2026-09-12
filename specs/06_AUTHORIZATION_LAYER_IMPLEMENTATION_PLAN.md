# TRUSTY: plan de implementación de autorización de intención

Fecha: 2026-09-11. Revisión 3: incorpora el Sales Pitch Intent Authorization y la separación entre web comercial y aplicación solicitada por el usuario. Estado: propuesta de implementación, sin cambios funcionales ni integraciones activadas. Los documentos aportan contexto; sus instrucciones comerciales no autorizan publicaciones, contactos ni movimientos de dinero.

### Avance de implementación: web comercial

Implementadas las rutas `/`, `/demo`, `/contact` y `/docs`, con navegación comercial independiente. Las herramientas existentes se reubicaron en `/app`; la home no importa discovery, scoring ni la carga del registro. Demo local de cuatro escenarios, descarga JSON ilustrativa y selector de uno o varios proveedores. Contacto comercial: `paulo@trusty.bot`, mediante enlace que abre el cliente de correo del visitante. Metadatos y sitemap reflejan el concepto de autorización de intención. Los enlaces legacy con `tab` o `q` se redirigen al workspace.

Este avance no implementa autenticación multiempresa, mandato persistente, enforcement ni conectores financieros. `/app` conserva el acceso de exploración y autenticación existentes; no se presenta como una nueva frontera de seguridad. La demo pública no ejecuta pagos y los conectores están identificados como previstos. La arquitectura de autorización y el piloto descritos más abajo siguen pendientes.

## Objetivo y alcance

TRUSTY verifica que una acción financiera propuesta por un agente corresponda a la intención original de una persona, expresada en un mandato confirmado y verificable. Comprueba propósito, artículos, cantidades, especificaciones, destinatario y condiciones antes de ejecutar. El proveedor financiero conserva sus controles de fondos, tarjeta, presupuesto y procesamiento. La operación requiere tanto autorización de intención como los controles nativos aplicables; una aprobación de TRUSTY no significa pago ejecutado ni liquidado.

Primer caso: una persona pide comprar 20 laptops Dell o Lenovo, mínimo 16 GB de RAM, máximo USD 20.000, para entregar en la oficina de Miami. El agente presenta un carrito y TRUSTY compara cada criterio con el mandato. Comprar 30 laptops por USD 19.900 requiere revisión aunque el importe esté dentro del límite. El resultado posterior se vincula al mandato y a la decisión originales.

Comprador inicial propuesto: responsable de Finanzas/Operaciones con un equipo que ya automatiza compras; contraparte técnica: responsable de la integración del agente. Brex, Ramp y Slash son ecosistemas de integración potenciales; no se presupone una relación comercial con ellos.

Hipótesis de diferenciación a validar: concordancia entre instrucción humana y acción concreta, con evidencia por criterio y trazabilidad hasta el resultado. Un cliente que usa un solo proveedor ya puede beneficiarse. La compatibilidad entre proveedores es una expansión posterior. La afirmación comercial sobre lo que otros proveedores no conocen debe validarse por flujo; el pitch no demuestra ausencia universal de capacidades competidoras.

## Web comercial y aplicación: dos experiencias separadas

La web pública debe transmitir el nuevo concepto desde el primer pantallazo: TRUSTY valida, respalda con evidencia y fortalece los procesos financieros ejecutados por agentes sobre las plataformas que el cliente ya utiliza. El foco comercial actual es complementar flujos de Brex, Ramp y Slash mediante validación de intención, mandato y acción. “Respaldar” significa ofrecer controles y prueba auditable; no implica asegurar pérdidas o garantizar una operación.

La propuesta funciona para una empresa que usa únicamente Brex y para otra que usa Brex y Ramp, u otra combinación compatible. Mostrar ambos escenarios de forma explícita. Un solo proveedor debe ser una configuración completa del producto; añadir otro amplía cobertura. La disponibilidad real de cada conector se comunica según su estado: previsto, sandbox, piloto o disponible.

La visión de largo plazo contempla evolucionar hacia una plataforma financiera propia, con capacidades comparables a las soluciones que hoy complementa. Es una dirección estratégica futura, separada del alcance y de las promesas del producto actual. La arquitectura de adaptadores permite esa evolución sin condicionar el MVP a emitir tarjetas, custodiar fondos o procesar pagos.

### Web pública: explicar el valor y convertir interés

Referencia de presencia comercial: sitios de Brex, Slash y Ramp, interpretando “Larp” del mensaje del usuario como Ramp por el contexto. Al diseñar, revisar sus sitios vigentes para estudiar claridad de propuesta, jerarquía, demostraciones de producto, casos de uso y conversión; construir identidad propia de TRUSTY sin copiar sus activos o composición. Esta revisión del plan no constituye todavía un diseño visual ni una evaluación de esos sitios.

Estructura propuesta:

1. Hero con beneficio y contexto: “Tus agentes ejecutan. TRUSTY verifica que hagan lo que autorizaste”. Apoyo: “Valida cada compra contra la intención original y fortalece tus flujos financieros con uno o varios proveedores”. CTA principal “Solicitar demo”; secundario “Ver cómo funciona”; acceso “Iniciar sesión” separado.
2. Demostración breve de intención -> mandato -> compra -> decisión -> evidencia, usando las 20 frente a 30 laptops. La demo pública utiliza ejemplos explícitos y no expone datos operativos.
3. Sección de compatibilidad con dos ejemplos: cliente con Brex y cliente con Brex + Ramp. Explicar que los controles de intención acompañan el flujo y que cada proveedor mantiene sus controles financieros. No presentar los tres proveedores como requisitos simultáneos ni sus logos como prueba de alianza.
4. Beneficios verificables: detectar desviaciones dentro del presupuesto, pedir revisión cuando hace falta y reconstruir qué se autorizó y qué ocurrió. Casos de compras y procurement para Finanzas/Operaciones y equipos de automatización.
5. Vistas seleccionadas del producto: mandato, comparación de carrito, decisión y prueba auditable. Mostrar el resultado de uso sin convertir la home en la consola completa.
6. Integración y piloto: qué necesita el cliente, cómo comienza con un workflow y cómo pasa de observación a control limitado. Cierre con solicitud de demo/piloto; documentación técnica en un acceso secundario.

### Aplicación: operar y reunir evidencia

La aplicación contiene las funciones reales: organizaciones, agentes, mandatos, decisiones, revisiones humanas, conexiones, evidencia y resultados. Dentro de ella se conservan el crawler, discovery, registro/ranking de agentes, scanner de repositorios, reportes de confianza, badges y herramientas actuales de evaluación. Se organizan como herramientas de investigación y evidencia del agente; no dominan la navegación comercial ni el onboarding principal.

El recorrido principal del app es conectar un workflow -> confirmar mandato -> inspeccionar compra -> resolver decisión -> consultar resultado. Discovery y scoring pueden enriquecer ese recorrido sin convertirse en requisito para evaluar un agente privado conocido. Reubicar las funciones existentes preservando su acceso y datos; los perfiles o badges que deban compartirse se exponen mediante vistas dedicadas con permisos adecuados.

### Rutas y separación técnica propuestas

- `/`: sitio comercial; rutas públicas complementarias `/product`, `/use-cases`, `/integrations` y `/demo` según contenido disponible.
- `/app`: entrada autenticada y consola operativa; secciones de mandatos, decisiones, aprobaciones, integraciones, evidencia y herramientas de agentes.
- `/docs`: documentación de integración, separada del discurso principal de ventas.
- Next.js: grupos `src/app/(marketing)/` y `src/app/(workspace)/app/`, con layouts, navegación y carga de datos independientes. Los grupos de rutas por sí solos no autorizan acceso: proteger páginas, API y datos por identidad/organización.
- Componentes comerciales y operativos separados; compartir tokens visuales y componentes básicos. La home no debe disparar crawls, hidratar el registro completo ni consultar datos privados al abrirse.
- Una intención conserva su identidad a través de conexiones: reintentar por otro proveedor no debe duplicar compra ni reserva. No introducir selección automática de proveedor ni failover financiero en el MVP; si se soporta una segunda conexión, exigir elección explícita y conciliación del intento anterior.

### Entregables y criterios de aceptación de la web

- Días 1-2: mensaje, mapa de navegación y wireframe de la web comercial; definir la distribución de las herramientas actuales dentro del app.
- Días 6-8: implementar layouts separados y migrar la experiencia operativa a `/app`, junto con la consola del sprint. El alcance visual se ajusta a la capacidad disponible, preservando el núcleo de autorización.
- Días 12-14: validar mensaje con prospectos, acceso al app, demo y conversión; revisar que ninguna conexión prevista se presente como activa.
- Un visitante puede explicar qué verifica TRUSTY, por qué le sirve con un único proveedor y cómo pedir una demo sin recorrer un ranking de agentes.
- La home transmite intención y autorización; crawler, scanner y scoring se encuentran dentro del app y siguen funcionando tras la migración.
- “Solicitar demo”, “Ver cómo funciona” e “Iniciar sesión” tienen destinos distintos y funcionales. No mostrar métricas, clientes o alianzas sin evidencia.
- Medir web y app por separado: visita -> demo solicitada -> piloto cualificado; organización -> mandato confirmado -> primera compra evaluada -> uso recurrente.

## Mandato verificable e inspección del carrito

1. Capturar la instrucción original con identidad del principal, fecha y fuente autenticada. Diferenciar esa instrucción de la propuesta o justificación que escribe el agente.
2. Convertir el texto en un borrador estructurado: propósito, tipos de artículos, marcas/modelos admitidos, cantidad, especificaciones mínimas, total máximo, impuestos/envío, moneda, dirección autorizada, fecha límite, compras parciales, sustituciones y aprobadores.
3. Pedir confirmación al principal de los criterios derivados y resolver ambigüedades antes de activar el mandato. No inferir una dirección exacta a partir de “Miami office”; resolverla contra una dirección corporativa autorizada. Aclarar si el máximo incluye impuestos y envío. Registrar versión y autor de la confirmación.
4. Inspeccionar artículos y variantes/SKU, cantidades, precios unitarios, descuentos, impuestos, envío, total, vendedor, dirección y evidencia del carrito o factura. Diferenciar fabricante (Dell/Lenovo) de vendedor autorizado. Guardar procedencia y momento de captura; contrastar con una fuente de checkout/proveedor cuando esté disponible. Datos escritos sólo por el agente no prueban el contenido real de la compra.
5. Comparar cada criterio con resultado `MATCH | MISMATCH | UNKNOWN`, evidencia y regla aplicada. Las cantidades, montos y restricciones explícitas se comprueban de forma determinista. La clasificación semántica puede asistir con propósito o descripción; la falta de evidencia material deriva a revisión y no se interpreta como coincidencia.
6. Emitir una decisión ligada al hash del mandato y del carrito. Revalidar inmediatamente antes de ejecutar: cualquier cambio de artículo, cantidad, precio, destinatario o condiciones invalida la concesión anterior.

Si se usa un modelo para extraer texto, devolverá un esquema validado y campos inciertos; no podrá activar mandatos, modificar reglas ni conceder excepciones. Carritos, páginas y facturas son datos no confiables: las instrucciones incrustadas en ellos no alteran el mandato. Guardar versión del extractor y evidencias citadas, sin depender de una supuesta cadena de razonamiento interna del agente.

Un porcentaje de “intent match” es una presentación explicativa opcional, no una probabilidad de seguridad. Los 98% y 63% del pitch son ilustrativos y no objetivos del motor. En el MVP mostrar criterios cumplidos, incumplidos, desconocidos y cobertura de evidencia; cualquier porcentaje posterior necesita una fórmula versionada y validación, y nunca anula un bloqueo obligatorio.

## Hallazgos del repositorio

- `src/app/api/decision/route.ts`: recibe una acción y devuelve una evaluación; no autentica al solicitante ni persiste la decisión en esta ruta. El principal procede del cuerpo enviado por el cliente.
- `src/lib/scoring/creditEngine.ts`: reutilizable como referencia de reglas y explicación. Incluye historial fijo, excepciones por nombre que contiene `procurement`, AVUD derivado de estrellas y textos de ejecución/telemetría sin ejecución correspondiente. Estos datos deben quedar confinados a fixtures de demo.
- La comprobación de capacidad compara una operación con un límite diario; no agrega gasto ni reserva presupuesto concurrentemente.
- La evaluación de comercio utiliza palabras en su nombre; hace falta identidad de contraparte/MCC procedente del proveedor y listas configuradas por empresa.
- `supabase/schema.sql`: contiene perfiles y agentes; faltan organizaciones, delegaciones, políticas, reservas, decisiones, aprobaciones, ejecuciones y eventos. Las políticas abiertas actuales no son adecuadas para estos datos privados.
- `src/components/DecisionPlayground.tsx`: punto de partida para una demo de autorización. El ranking y los reportes de confianza pasan a ser información secundaria.
- `EconomicActionRequest` en `src/lib/types.ts`: no contiene el mandato humano confirmado, artículos, especificaciones, entrega ni evidencia del carrito. Ampliar este contrato es la primera dependencia funcional del nuevo concepto.

## Arquitectura propuesta

Flujo: instrucción humana autenticada -> borrador de mandato -> confirmación/versionado -> carrito propuesto por agente -> inspección y comparación con mandato -> decisión persistida -> revisión si procede -> revalidación y consumo de concesión -> proveedor aplica controles financieros -> ejecución -> resultado y prueba de auditoría.

Dos modos de integración, explícitos en el producto:

1. Preautorización del flujo: el agente solicita permiso y un ejecutor controlado consume una autorización de un solo uso. El agente no posee credenciales que permitan saltarse el ejecutor. Un SDK que sólo devuelve una recomendación no constituye enforcement.
2. Autorización en el proveedor: un callback de autorización consulta TRUSTY antes del procesamiento. Debe existir un vínculo verificable entre tarjeta, empresa, agente e intención; no atribuir automáticamente todo gasto de una tarjeta compartida a un agente.

El primer punto de integración es el workflow que dispone de la instrucción y del carrito, antes del checkout. Un evento de tarjeta con importe y comercio no basta para verificar RAM, cantidad o dirección. Elegir el proveedor que ya usa el design partner y que permita cerrar ese flujo; no condicionar el valor inicial a disponer de tres proveedores ni a un callback bancario.

Slash documenta callbacks de autorización Enterprise con timeout por defecto de 1,5 segundos y fallback configurable. Es una opción de enforcement adicional si el cliente tiene acceso. Usar `fallbackBehavior: reject` para el piloto controlado. El callback consulta una autorización previamente calculada y correlacionada con la compra; no intenta reconstruir el carrito a partir del cargo. Un resultado interno `REQUIRE_HUMAN` se resuelve antes del intento de tarjeta; en un callback síncrono se rechaza el intento pendiente de aprobación y se permite un nuevo intento autorizado posteriormente.

Brex documenta tarjetas virtuales con límites. Ramp documenta recursos de tarjetas y restricciones. Antes de prometer bloqueo por transacción en estos proveedores, verificar capacidades, scopes, acceso de producción y punto exacto de ejecución. Los webhooks de notificación sirven para resultados y no prueban capacidad de veto previo.

Mantener Next.js para consola y API inicial, Supabase/Postgres como fuente persistente. Aislar el motor puro de autorización y los adaptadores. El callback no debe hacer crawling ni invocar un LLM: utiliza políticas y contexto preparados. Medir latencia incluyendo base de datos y arranques antes de decidir si requiere un servicio dedicado.

## Contrato funcional

Entrada: identidad autenticada de organización/agente, `delegationId`, `mandateId`, `mandateVersion`, `purchaseIntentId`, `cartSnapshotId`, artículos con cantidades/especificaciones y evidencia, dirección de entrega, desglose del total en unidades menores enteras, moneda, contraparte, categoría, proveedor y clave de idempotencia. Resolver organización y permisos desde credenciales, nunca confiar en un `principal` libre.

Salida: `decisionId`, `APPROVE | DECLINE | REQUIRE_HUMAN`, `intentMatch` por criterio, cobertura de evidencia, códigos de motivo, versiones de mandato y política, `cartHash`, reserva si aplica, expiración y `auditProofId`. Estado de ejecución independiente. Usar estos valores en el nuevo contrato y mapear explícitamente los estados legacy `APPROVED / DECLINED / HUMAN_REVIEW`.

Una concesión de ejecución queda vinculada a organización, agente, mandato/version, acción, artículos, importe, moneda, contraparte, entrega, hash del carrito y política. Es de un solo uso, con vencimiento. Cambiar esos datos exige reevaluación. Una revocación o cambio relevante de política se comprueba otra vez antes de ejecutar.

Reglas iniciales de intención: mandato vigente y confirmado; propósito permitido; cantidad acumulada correcta; especificaciones y marcas válidas; entrega autorizada; total completo dentro del mandato; ausencia de compra duplicada; evidencia suficiente. Conservar autenticación, revocación y límites como garantías de soporte. Los controles financieros nativos siguen siendo obligatorios. Un score público no concede autoridad que la persona no delegó.

Precedencia: bloqueos no excepcionables (identidad inválida, mandato revocado, prohibición corporativa) -> discrepancias revisables o evidencia insuficiente -> aprobación. Para 30 laptops cuando se pidieron 20, devolver `REQUIRE_HUMAN` con `QUANTITY_MISMATCH`; el aprobador autorizado debe confirmar una modificación versionada o excepción delimitada antes de un nuevo intento. Una aprobación genérica no puede levantar prohibiciones corporativas.

## Datos y garantías

Entidades: `organizations`, `memberships`, `agent_identities`, `delegations`, `mandates`, `mandate_versions`, `mandate_confirmations`, `purchase_intents`, `cart_snapshots`, `evidence_artifacts`, `criterion_evaluations`, `policies`, `policy_versions`, `payment_connections`, `payment_instruments`, `decisions`, `budget_reservations`, `fulfillment_reservations`, `approvals`, `executions`, `provider_events`, `audit_events`.

- Aislamiento por organización y roles de administrador, aprobador, operador y lector. Secretos sólo en servidor; agentes sin capacidad para alterar su política o aprobarse.
- Reservar presupuesto en una transacción con control de concurrencia. Considerar reservas abiertas y gasto confirmado; definir liberación por expiración, rechazo y reversión. Un resultado incierto no libera presupuesto automáticamente.
- Reservar también cantidades pendientes por mandato. Dos compras de 20 laptops con IDs distintos no pueden cumplir dos veces el mismo encargo. Distinguir reintento técnico de duplicado comercial y permitir compras parciales sólo si el mandato las admite.
- La prueba de auditoría vincula texto original, confirmación, versión estructurada, snapshot, evidencias por criterio, decisión, aprobador/excepción, ejecución y resultado. Exportar JSON legible por máquinas y vista legible por personas, con redacción de datos sensibles. Definir retención y acceso por organización; un hash acredita integridad de lo almacenado, no veracidad de la fuente.
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
- Definir esquema de mandato confirmado, carrito, estados, criterios de evidencia y tratamiento de ambigüedades.
- Reescribir posicionamiento en PRODUCT/README y separar modo demo de datos reales.
- Preparar ejemplos reproducibles del pitch: 20 laptops válidas; 30 dentro del presupuesto; RAM insuficiente; entrega incorrecta; duplicado; evidencia ausente y mandato revocado.

Salida: especificación y fixtures con resultado esperado; acceso solicitado por el cliente al proveedor elegido. No requiere construir tres conectores.

### Días 3-5: núcleo de autorización

Responsabilidad: backend.

- Migraciones privadas con RLS, autenticación de agentes y delegaciones.
- Crear/confirmar/versionar mandatos; comparación determinista por criterio, política versionada, idempotencia y reserva atómica de cantidades y monto.
- `POST /api/v1/mandates` crea borrador; `POST /api/v1/mandates/{id}/confirm` activa una versión con identidad humana autorizada. MVP admite formulario estructurado; extracción de lenguaje natural asistida se añade sin saltarse la confirmación.
- `POST /api/v1/authorizations` y consulta de decisión.
- Conservar `/api/decision` como simulación explícita o adaptador compatible, sin poder de ejecución implícito.

Salida: los casos de cantidad, especificación y entrega devuelven razones correctas; dos solicitudes simultáneas no pueden exceder cantidad ni presupuesto del mandato; otro tenant no puede ver ni modificar decisiones.

### Días 6-8: aprobación y consola

Responsabilidad: interfaz + backend.

- Consola de mandato original/estructurado, carrito lado a lado, diferencias por criterio, cola humana, cantidades y presupuesto pendientes, e interruptor de emergencia.
- Aprobar/rechazar mediante identidad del aprobador, con vencimiento y reevaluación de los bloqueos antes de ejecutar.
- `POST /api/v1/approvals/{id}/approve`, `/reject` y ejecución de concesión de un solo uso.
- Exportación de prueba: `GET /api/v1/decisions/{id}/proof`, con acceso restringido a la organización.
- Instrumentar onboarding: organización creada -> agente registrado -> mandato confirmado -> carrito evaluado -> primera decisión válida.

Salida: demo completa sin proveedor externo; aprobar un carrito no permite cambiar productos, cantidades o entrega aunque el monto sea idéntico.

### Días 9-11: primer adaptador y resultados

Responsabilidad: backend/integraciones.

- Adaptador del workflow de compras del cliente para capturar carrito antes del checkout y controlar el paso de ejecución. Elegir una plataforma financiera según el cliente y capacidades verificadas; usar sandbox explícito si falta acceso.
- Correlación verificable entre mandato, carrito final y operación. Callback Slash opcional con presupuesto de latencia y fallback probado si está disponible. Si no puede comprobarse el vínculo con el carrito real, mantener observación o revisión y declarar la limitación.
- Ingesta autenticada de resultados, conciliación e historial persistente.
- Pruebas de duplicados, eventos desordenados, timeout, firma inválida y revocación.

Salida: una operación rastreable desde intención hasta resultado en sandbox. Para callback de Slash, objetivo provisional p99 interno <500 ms y respuesta total dentro del plazo documentado, bajo carga acordada.

### Días 12-14: paquete de piloto y validación

Responsabilidad: producto + ingeniería.

- Guía de integración y ejemplo ejecutable, demo de dos minutos, alcance de 30 días y métricas acordadas.
- Validar con 2-3 candidatos que pueden aportar intención previa, resultados y responsable interno; meta comercial, no resultado garantizado.
- Comparar decisiones en modo observación con el proceso existente. Separar discrepancias de intención, errores técnicos y revisión realmente innecesaria. Preparar muestra etiquetada por el principal con ejemplos correctos y desviaciones dentro del presupuesto.
- Entregar reporte de pruebas y decisión explícita de avanzar o mantener sandbox.

Salida: piloto definido con datos, dueño y criterios de éxito. Día 14 no implica que tres proveedores estén integrados ni que producción esté aprobada.

## Piloto de 30 días posterior

Semana 1: conectar el workflow de ejemplo y acordar esquema de mandato/carrito, evidencias, acceso y conjunto de evaluación.

Semana 2: decisiones en modo observación sin bloquear; comparar con decisiones humanas reales y etiquetar discrepancias con el responsable del mandato.

Semana 3: control limitado, sujeto a pruebas y acceso; solicitar revisión humana ante desviaciones de intención relevantes, con un alcance pequeño y aprobador disponible.

Semana 4: lectura de resultados y ROI observado: revisiones, minutos de trabajo, desviaciones confirmadas y cobertura de evidencia. Ampliar sólo si calidad, concurrencia, conciliación y disponibilidad cumplen criterios acordados.

Solicitud al design partner según el pitch: 100-1.000 acciones financieras de agentes o flujos equivalentes, con texto original del mandato, carrito/factura, datos anonimizados y resultados reales. Mantener IDs estables para correlacionar y seudonimizar direcciones sin destruir el criterio de coincidencia. Etiquetar datos sintéticos, históricos y observados por separado; 100-1.000 casos no bastan para afirmar tasas de fraude raras ni precisión universal.

## Pruebas que condicionan el paso a control real

- Caso A del pitch: 20 Dell Latitude, 16 GB, total completo USD 18.400, entrega autorizada en Miami -> `APPROVE`, suponiendo mandato confirmado y sin otro bloqueo.
- Caso B: 30 Dell, USD 19.900 -> `REQUIRE_HUMAN / QUANTITY_MISMATCH`, aunque el proveedor permita el monto. La revisión no ejecuta hasta aprobar una modificación o excepción válida.
- RAM de 8 GB, marca no admitida o dirección distinta -> nunca aprobación automática; discrepancia y revisión según la política. Evidencia faltante -> `UNKNOWN` y revisión.
- Impuestos/envío que superan USD 20.000 -> no aprobación automática; el cálculo usa el total final.
- Dos carritos equivalentes con distintos IDs -> detectar duplicación comercial; compras parciales no exceden 20 unidades acumuladas.
- Instrucciones maliciosas en factura o descripción no pueden cambiar el mandato; una extracción ambigua no crea autoridad.
- Cambio de carrito tras aprobación invalida el permiso aunque el importe no cambie.

- Rechazo de acceso cruzado entre organizaciones, credenciales revocadas y elevación de privilegios.
- Presupuesto correcto con concurrencia, reintentos y distintas monedas; MVP rechaza monedas no soportadas.
- Aprobación expirada, payload modificado y permiso consumido no autorizan ejecución.
- Ningún estado de pago exitoso sin evento confirmado del proveedor.
- Webhooks repetidos/desordenados no duplican gasto ni decisiones; firma inválida no modifica estado.
- Timeout y caída de base de datos/proveedor no permiten gasto por defecto; conciliación resuelve estados desconocidos.
- Caso extremo: muchas compras pequeñas cuyo total excede el presupuesto; bloqueo aunque cada compra individual sea pequeña.
- Verificar que el flujo no pueda saltarse TRUSTY con credenciales alternativas dentro del alcance declarado del piloto.

## Ajuste del GTM y medición

El deck original prioriza búsqueda pública y perfiles en semana 1, seguido de pilotos en semana 2. El nuevo pitch enfoca la propuesta en validar la intención antes de ejecutar. La web comercial convierte mediante solicitud de demo/piloto y una demostración de mandato + dos carritos contrastados. La experiencia freemium/sandbox y el ejemplo SDK llevan al app, donde el usuario puede evaluar una compra contra un mandato o conectar un workflow. Crawler, scoring y badges quedan dentro del app; sus vistas compartibles son adquisición secundaria.

Mensaje de producto: “TRUSTY verifica que el agente compre lo que pediste antes de ejecutar el pago”. La demo comercial principal es la compra de 30 laptops dentro del presupuesto, porque muestra la diferencia entre cumplir el límite y cumplir el encargo. El ejemplo DoorDash del pitch es contexto comercial aportado, no prueba de adopción de TRUSTY ni de compras autónomas de marketplace; sus cifras requieren verificación antes de reutilizarlas públicamente.

Métricas principales:

- Decisiones válidas únicas por día, separadas por sandbox, observación y control real. Excluir reintentos y tráfico sintético.
- Organizaciones que integran y vuelven a enviar decisiones, tiempo a primera decisión y pilotos con responsable y acceso a resultados.
- Volumen bajo decisión: importe de intenciones únicas evaluadas en USD; mostrar por separado solicitado, permitido, rechazado y ejecutado confirmado. No sumar esos estados entre sí ni contar capturas como nuevas intenciones.
- Cobertura de resultados: ejecuciones elegibles con resultado conciliado / ejecuciones elegibles, usando una ventana de maduración acordada.
- Revisión humana por intención y tiempo de resolución comparados con la línea base del cliente.
- Desviaciones de intención confirmadas por el principal: cantidad, especificación, entrega, duplicación y propósito; reportar cuántas ocurren pese a cumplir presupuesto.
- Calidad sobre muestra adjudicada: desviaciones detectadas / desviaciones etiquetadas; alertas correctas / alertas revisadas; casos conformes escalados / casos conformes. Mostrar denominadores, cobertura y casos sin etiqueta, no sólo porcentajes.
- Cobertura de evidencia: decisiones con mandato confirmado, carrito verificable y razones trazables / decisiones evaluadas; medir por separado conciliación de resultados.
- Violaciones de política bloqueadas, falsos bloqueos adjudicados, latencia y errores. Un rechazo no equivale automáticamente a fraude o pérdida evitada.

La meta de 1.000 solicitudes/día del deck es una aspiración de distribución; para este giro la evidencia decisiva es uso integrado y repetido, con capacidad real de control y resultados verificables. No estimar ROI ni pérdidas evitadas a partir de fixtures.

## Fuera del primer alcance

Crédito concedido por TRUSTY, límites derivados de estrellas de GitHub, modelos predictivos sin datos, integración simultánea de tres proveedores, stablecoins, contratos y transferencias genéricas. Tampoco se promete entender cualquier instrucción o verificar especificaciones que la evidencia disponible no contiene. El primer producto resuelve compras estructuradas con criterios comprobables.

## Organización propuesta de implementación en el repo

- `src/lib/mandates/`: esquema, validación, versiones, confirmación y extracción opcional.
- `src/lib/authorization/`: evaluación por criterio, precedencia de decisiones, concesiones y reservas; separado del motor legacy de crédito.
- `src/lib/evidence/`: snapshots, procedencia, hashes y exportación de prueba.
- `src/lib/integrations/`: adaptador de workflow y proveedor financiero, con capacidades explícitas.
- `src/app/api/v1/`: mandatos, autorizaciones, aprobaciones, pruebas y resultados.
- `src/components/DecisionPlayground.tsx`: transformar la demo hacia mandato/carrito/diferencias; pantallas de operación reutilizan los mismos contratos.
- `supabase/migrations/`: entidades privadas y garantías transaccionales; datos demo aislados.

Estos son módulos propuestos, no archivos ya implementados. Secuencia crítica: mandato confirmado -> evidencia del carrito -> comparación -> revisión -> vínculo con ejecución -> resultado. La reserva financiera es una garantía de soporte, no el centro de la propuesta comercial.

## Fuentes y dependencias verificadas

- Contexto comercial principal: `C:/Users/paulo/Downloads/TRUSTY_BOT_Sales_Pitch_Intent_Authorization.pdf`, 10 páginas; flujo en página 5, caso de laptops en página 6, integración en página 7 y piloto en página 9. Revisado como referencia para este plan; sus comparaciones y cifras comerciales no son hechos verificados independientemente.

- GTM original: `C:/Users/paulo/Downloads/TRUSTY_BOT_14_Day_GTM_Deck.pdf`, 11 páginas; metas y secuencia originales, ajustadas por la instrucción posterior del usuario.
- Demo conceptual: `C:/Users/paulo/Downloads/AGENTICRA_Demo_Data_Trust_and_Credit.pdf`, 10 páginas; distingue confianza y crédito e ilustra el feedback de resultados. No prueba conexiones productivas.
- Slash: https://docs.slash.com/api-reference/authorization-webhook-overview (acceso Enterprise, timeout, firma y fallback).
- Slash eventos: https://docs.slash.com/api-reference/webhook-overview (duplicados, orden y firma de notificaciones).
- Brex: https://developer.brex.com/examples/team_examples (tarjetas virtuales con límites).
- Ramp: https://docs.ramp.com/developer-api/v1/api/cards (referencia de tarjetas; validar contrato detallado y permisos antes del adaptador).

La revisión fue de código y documentación; no se probaron cuentas ni conexiones productivas. Pendientes que afectan el calendario: equipo disponible, primer cliente, acceso del proveedor y método de ejecución/correlación admitido.
