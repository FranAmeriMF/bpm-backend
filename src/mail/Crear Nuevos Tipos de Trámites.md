Crear Nuevos Tipos de Trámites


Como administrador
Quiero crear nuevos tipos de trámites
Para soportar diferentes procesos administrativos del sistema

Descripción
El administrador necesita poder crear diferentes tipos de trámites que las empresas podrán usar para realizar gestiones específicas. Cada tipo de trámite representa un proceso administrativo diferente (habilitación comercial, permiso de construcción, certificación técnica, etc.) y tendrá su propio formulario personalizado con campos específicos. Esta es la funcionalidad base que permite al sistema ser flexible y adaptarse a diferentes necesidades.

Flujo
El administrador accede al módulo de gestión de tipos de trámites
El administrador hace clic en "Nuevo Tipo de Trámite"
El sistema muestra formulario de creación
El administrador ingresa nombre del tipo de trámite (obligatorio)
El administrador ingresa descripción (obligatoria)
El administrador revisa la información
El administrador confirma la creación
El sistema valida que el nombre sea único
El sistema crea el tipo de trámite con estado "Borrador"
El sistema muestra confirmación
El administrador puede comenzar a configurar el formulario
Criterios de Aceptación
Formulario de Creación:

Campo: Nombre del tipo de trámite (obligatorio)
Campo: Descripción (obligatoria)
Botones: "Crear" y "Cancelar"
Campo Nombre:

Obligatorio, no puede estar vacío
Longitud mínima: 5 caracteres
Longitud máxima: 100 caracteres
Debe ser descriptivo del proceso
Validación de Nombre Único:

El nombre debe ser único en el sistema
No pueden existir dos tipos con el mismo nombre
Comparación case-insensitive
Si existe: "Ya existe un tipo de trámite con este nombre"
Campo Descripción:

Obligatorio, no puede estar vacío
Longitud mínima: 20 caracteres
Longitud máxima: 1000 caracteres
Explica claramente qué es este tipo de trámite
Para qué se usa y cuándo se debe usar
Es visible para los usuarios al crear trámites
Confirmación:

Mensaje: "Tipo de trámite creado exitosamente"
Se muestra el nombre creado
Se indica que está en estado "Borrador"
Se ofrece opción de configurar formulario
Post-Creación:

Aparece en listado de tipos de trámites
Se puede editar información básica
Validaciones:

Nombre no vacío y único
Descripción no vacía
Longitudes dentro de límites
Todo se valida antes de crear

Definir Asignación de Oficinas para Tipo de Trámite

Como administrador
Quiero definir si el tipo de trámite tiene oficinas preseleccionadas o requiere intervención del moderador
Para automatizar o controlar manualmente la asignación de trámites

Descripción
El administrador necesita configurar cómo se asignarán los trámites de cada tipo a las oficinas del sistema. Hay dos modalidades: (1) Asignación automática - el tipo de trámite tiene oficinas preseleccionadas y los trámites se asignan directamente sin intervención; (2) Asignación manual - el moderador debe revisar y asignar cada trámite a la oficina apropiada. Esta configuración determina el flujo de cada tipo de trámite.

Flujo
Configuración de Asignación:

El administrador accede a la configuración del tipo de trámite
El administrador ve sección "Asignación a Oficinas"
El administrador selecciona el modo de asignación
Si selecciona "Automática", elige oficinas preseleccionadas
Si selecciona "Manual", el moderador asignará caso por caso
El administrador guarda la configuración
El sistema registra la configuración
La configuración se aplica a todos los nuevos trámites de este tipo
Criterios de Aceptación
Modos de Asignación:

Modo 1: Asignación Automática

El tipo de trámite tiene oficinas preseleccionadas
Cuando se aprueba un trámite de este tipo, se asigna automáticamente
El moderador NO interviene en la asignación
Es más rápido y eficiente para trámites estándar
Modo 2: Asignación Manual

El tipo de trámite NO tiene oficinas preseleccionadas
Cuando se aprueba un trámite, queda "Pendiente de Asignación"
El moderador debe revisarlo y asignar la oficina apropiada
Permite flexibilidad y control para casos especiales
Selector de Modo:

Toggle claro
Opción 1: "Asignación automática a oficinas preseleccionadas"
Opción 2: "Asignación manual por moderador"
Explica brevemente cada opción
Se puede cambiar en cualquier momento
Configuración de Asignación Automática:

Selección de Oficinas:

Si modo es automático, se muestran las oficinas del sistema
Se pueden seleccionar una o múltiples oficinas
Checkboxes para cada oficina disponible
Solo se muestran oficinas activas
Configuración de Asignación Manual:

Sin Oficinas Preseleccionadas:

No se seleccionan oficinas
Todos los trámites quedan en "Pendiente de Asignación"
El moderador ve el trámite y decide
Útil para casos complejos o variados
Flexibilidad del Moderador:

El moderador puede asignar a cualquier oficina activa
Puede ver el contenido del trámite antes de asignar
Puede considerar complejidad, especialización, carga
Mayor control pero requiere más tiempo
Cambio de Configuración:

Se puede cambiar entre automático y manual
El cambio solo afecta nuevos trámites
Trámites existentes mantienen su asignación
Se registra el cambio en historial
Validaciones:

Si modo automático, debe seleccionar al menos una oficina
Las oficinas deben estar activas
El método de distribución debe estar configurado
Todo se valida antes de guardar
Impacto en el Flujo:

Flujo con Asignación Automática:

Usuario crea trámite
Director aprueba
Sistema asigna automáticamente a oficina preseleccionada
Estado: "Asignado" directamente
Usuario de oficina lo procesa
Flujo con Asignación Manual:

Usuario crea trámite
Director aprueba
Estado: "Pendiente de Asignación"
Moderador revisa y asigna a oficina
Estado: "Asignado"
Usuario de oficina lo procesa
Indicadores Visuales:

En listado de tipos: indica modo de asignación
Badge "Automático" o "Manual"
Color diferente para cada modo
Tooltip explica qué significa
Recomendaciones:

Trámites estándar y frecuentes: Asignación automática
Trámites complejos o variados: Asignación manual
El sistema puede sugerir según características

 Definir Secciones dentro del Tipo de Trámite

 Como administrador
Quiero definir secciones dentro de cada tipo de trámite
Para organizar la información requerida de forma lógica

Descripción
El administrador necesita estructurar el formulario de cada tipo de trámite dividiéndolo en secciones lógicas que agrupen campos relacionados. Las secciones ayudan a organizar información compleja, guían al usuario en el llenado, y mejoran la experiencia. Cada tipo de trámite puede tener múltiples secciones con títulos descriptivos y opcionalmente descripciones explicativas.

Flujo
El administrador accede al diseñador de formulario del tipo de trámite
El administrador hace clic en "Agregar Sección"
El sistema muestra formulario de nueva sección
El administrador ingresa título de la sección (obligatorio)
El administrador ingresa descripción de la sección (opcional)
El administrador confirma la creación
La sección se agrega al formulario
El administrador puede agregar campos a esta sección
El administrador puede crear múltiples secciones
Criterios de Aceptación
Creación de Sección:

Formulario simple con campos esenciales
Título (obligatorio)
Descripción (opcional)
Botones "Agregar" y "Cancelar"
Campo Título:

Obligatorio, no puede estar vacío
Longitud mínima: 3 caracteres
Longitud máxima: 100 caracteres
Debe ser descriptivo del contenido
Campo Descripción:

Opcional, puede dejarse vacío
Longitud máxima: 500 caracteres
Explica qué información se debe completar en esta sección
Se muestra a los usuarios como ayuda
Puede incluir instrucciones específicas
*Tipo de Sección:

Múltiples Secciones:

Un tipo de trámite puede tener múltiples secciones
No hay límite de cantidad
Cada sección agrupa campos relacionados
Se muestran en orden de creación (modificable después)
Orden de Secciones:

Las secciones se crean en orden secuencial
Orden inicial: por orden de creación
Se puede reordenar después (HU 4.13)
El orden determina cómo se muestra el formulario
Visualización para Usuarios:

Cada sección tiene título destacado
La descripción se muestra debajo del título
Los campos están agrupados dentro
Edición de Sección:

Se puede editar título y descripción después
Los campos dentro se mantienen
Eliminación de Sección:

Se puede eliminar si está vacía (sin campos)
Si tiene campos, se advierte
Confirmación requerida
Validaciones:

Título no vacío
Longitudes dentro de límites
Al menos una sección en el formulario
No se puede dejar tipo de trámite sin secciones
Indicadores Visuales en Diseñador:

Cada sección se muestra como un contenedor
Título destacado
Cantidad de campos dentro
Botones de acción (editar, eliminar, agregar campos)
Colapsar/Expandir:

Las secciones se pueden colapsar en el diseñador
Facilita navegar formularios largos
Se puede expandir para ver/editar campos
Estado de colapso/expansión se mantiene

Agregar Campos Dinámicos a Secciones

Como administrador
Quiero agregar campos dinámicos a cada sección con diferentes tipos de datos
Para capturar la información necesaria de forma estructurada

Descripción
El administrador necesita agregar campos de entrada de datos a cada sección del formulario, eligiendo el tipo de dato apropiado para cada información requerida. El sistema debe soportar múltiples tipos de campos (texto, número, fecha, selección, checkbox, archivo, etc.) para capturar todo tipo de información. Cada campo tiene propiedades configurables como nombre, etiqueta, obligatoriedad, y validaciones específicas.

Flujo
El administrador está en el diseñador de formulario
El administrador selecciona una sección existente
El administrador hace clic en "Agregar Campo"
El sistema muestra selector de tipo de campo
El administrador selecciona el tipo de campo deseado
El sistema muestra formulario de configuración según el tipo
El administrador configura el campo (nombre, etiqueta, obligatorio, etc.)
El administrador guarda el campo
El campo se agrega a la sección
El administrador puede agregar más campos
El campo estará visible para usuarios al crear trámites
Criterios de Aceptación
Tipos de Campos Soportados:

1. Campo de Texto Corto (Text Input):

Para textos breves (nombre, apellido, título)
Longitud máxima 50
Placeholder configurable
2. Campo de Texto Largo (Textarea):

Para textos extensos (descripciones, observaciones)
Longitud máxima 500
Placeholder configurable
Contador de caracteres opcional
3. Campo Numérico (Number):

Solo acepta números
Decimales permitidos o no
Formato de moneda opcional
4. Campo de Fecha (Date):

Selector de fecha
Formato configurable (DD/MM/AAAA)
5. Campo de Selección Simple (Select/Dropdown):

Lista desplegable de opciones
Opciones definidas por el admin (HU 4.11)
Solo se puede seleccionar una opción
Opción por defecto configurable
6. Campo de Selección Múltiple (Checkbox Group):

Permite seleccionar varias opciones
Opciones definidas por el admin (HU 4.11)
Cantidad mínima y máxima de selecciones configurables
7. Campo de Selección Única (Radio Buttons):

Varias opciones visibles, solo una seleccionable
Opciones definidas por el admin (HU 4.11)
8. Campo de Archivo Adjunto (File Upload):

Permite subir archivos
Tipos de archivo permitidos configurables (PDF, JPG, etc.)
Tamaño máximo 15 mega
Múltiples archivos permitidos o no
9. Campo de Casilla de Verificación (Single Checkbox):

Para confirmaciones o aceptaciones
Ejemplo: "Acepto términos y condiciones"
Solo puede estar marcado o no
Obligatorio o no
Configuración de Campo:

Propiedades Básicas (todos los tipos):

Nombre interno (identificador único, sin espacios)
Etiqueta (lo que ve el usuario)
Descripción/Ayuda (texto explicativo opcional)
Obligatorio (sí/no)
Placeholder (texto de ejemplo)
Valor por defecto (opcional)
Validación de Nombre Interno:

Debe ser único dentro del tipo de trámite
Solo letras, números y guiones bajos
Sin espacios ni caracteres especiales
Ejemplo: "nombre_solicitante", "fecha_nacimiento"
Campos Obligatorios:

Se marcan con asterisco en el formulario
No se puede enviar trámite sin completarlos
Validación al intentar enviar
Mensaje de error claro si falta
Campos Opcionales:

El usuario puede dejarlos vacíos
Útil para información complementaria
Se indica visualmente que son opcionales
Orden de Campos:

Los campos se agregan en orden secuencial dentro de la sección
Orden inicial: por orden de creación
Se puede reordenar después (HU 4.12)
El orden determina cómo se muestra en el formulario
Vista Previa:

El diseñador muestra vista previa del campo
El admin puede ver cómo lo verá el usuario
Ayuda a verificar configuración
Se actualiza en tiempo real
Edición de Campo:

Se puede editar configuración después
Cambios en etiqueta, descripción, validaciones
Se advierte si hay trámites con datos en ese campo
Eliminación de Campo:

Se puede eliminar, en los tramites existentes se mantiene.
Confirmación requerida
Validaciones:

Nombre interno único
Etiqueta no vacía
Configuraciones lógicas (ej: mínimo < máximo)
Opciones definidas para select/checkbox/radio
Todo se valida antes de guardar