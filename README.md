# Snippet App

SnippetApp es una aplicación para guardar pequeñas resetas de código para el uso personal de programadores 
o profesionales que les sea útil una aplicación como esta. La aplicación es completamente funcional, pero el
objetivo es fundamentalmente para mostrar a otros desarrolladores un ejemplo de aplicación desarrollada con
Angular2 y Electron, admemás de un uso intensivo de RxJs
### Las tecnologías utilizadas son las siguientes

- Angular v4.0.0
- Angular-CLI v1.0.0
- Electron v1.6.2
- Electron-Packager v8.6.0
- RxJs

## Requerimientos

- Instalar globalmente Node.js, v6.10.1 o superior
- npm v3.10.10
- @angular/cli, v1.0.0
- Electron v1.6.2
- Electron-Packager

## Intalación

Si quiere usarla simplemente como usuario y tiene linux lo puede hacer a partir 
de la aplicción snap. Para hacerlo descargue el último release ``snippet_0.1_amd64.snap`` y luego ejecute el siguiente
comando.

```bash
sudo snap install snippet_0.1_amd64.snap --devmode
```
Si la quiere usar como desarrollador haga lo siguiente

Clone el repositorio localmente

``` bash
git clone https://github.com/aprezcuba24/snippet.git
```

Instalar dependencias

``` bash
npm install
```

Construir y ejecutar la aplicación

``` bash
npm start
```

## Comandos incluidos

- `npm run build-electron` - builds your Angular2 app and throws the result as well as your electron main.js file into the dist folder
- `npm start` - runs `npm run build-electron` and starts your app in electron by running `main.js`
- `npm run package-mac` - builds your application and generates a `.app` file of your application that can be run on mac. NOTE: I am like 99% sure you need to be on a MAC OS machine to be able to run this.
- `npm run package-windows` - builds your application and creates an app consumable in windows 32 bit systems. NOTE: If you build this on MAC OS or linux you need wine installed, which can be installed with `brew install wine`
- `npm run package-linux` - builds your application and creates an app consumable on linux systems.
- `npm run full-build-mac` - creates a `.dmg` installer for mac platforms.
- `npm run full-build-windows` - creates an installer for windows platforms.

# Desarrollo

Como se comentó anteriormente la presente aplicación es con el objetivo de explicar una manera de desarrollar, 
usando Angular2 y Electron. Se explicará como está diseñada la arquitectura y las partes fundamentales del código, pero para poder entender 
mejor se debe leer el código y los comentarios.
  
Uno de los aportes fundamentales es el uso __Rxjs__ para el desarrollo, utilizando programción funcional como 
paradigma de progamación.

Para el acceso a la base de datos se utilizó el ORM __camo__ que está bastante bien, pero podría mejorar más.

El código fuente de la aplicación está dentro de la carpeta __src__:
- app: Código de la interfaz
- assets: ficheros css e imágenes
- emvironments: Ficheros de configuración
- server: Código de acceso a la base de de datos y lógica del negocio

## Server
Dentro de __server__ está la lógica de acceso a base de datos. Algo a resaltar aquí es que se usó el componente
de Inyección de dependencias de Angular2.

Dentro se encuentran las siguientes carpetas y ficheros:
- domain: Carpeta con la configuración de las entidades y dentro tenemos dos:
  - snippet.ts: Entidada que representa un snippet
  - tag.ts: Entidad que representa un tag
- process: Son las clases que gestionan los eventos que se lanzan desde el cliente y devuelven las respuestas
Además tiene la lógica de negocio
- index.ts: Fichero que arranca el servidor, iniciando los procesos.
- IpcService.ts: Clase que permite trabajar con __electron.ipcMain__ y permite trabajarla usando RxJs

## App
En esta carpeta se almacena el código de la interfaz, implementada con Angular2. Al igual que en __server__ 
está implmentado por completo con programación funcional usando RxJs.

Dentro están las siguientes carpetas y ficheros
- Components: Aquí se almacenan los componentes globales, ahora solo están los siguientes
  - dashboard: Componente para la pantalla de inicio donde están los listados y el buscador
  - list: Componente para gestionar un listado. En el dashboard se muestran tres listados e implementar este 
  componente evita repetir código.
- services: Almacena los servicios
  - store: Almacena los servicios que se utilizan para conectarse con el server
    - app-store.service.ts: Para conectarse a los procesos generales, específicamente al proceso MainProcess
    - snippet-store.service.ts: Para conectarse a los procesos relacionados con los snippets, SnippetProcess
    - tag-store.service.ts: Para conectarse a los procesos relacionados con los tags, TagProcess
  - ipc.client.service.ts: Emboltura para __window.require('electron').ipcRenderer__ y transformado a RxJs
  - page-load.service.ts: Clase comodín para mostrar y esconder el loader cada vez que se cambia de página
- shared: Almacena componentes genéricos no vinculados directamente con la lógica del negocio
  - layout: Tiene un componente para gestionar el diseño común, implementando el patrón decorator
  - select2: Componente para gestionar los multiselect, que se usan específicamente para los  tags
- snippet: Tiene la lógica de la gestión de los snippets
  - detail: Componente para mostrar un snippet
  - form: Formulario para crear o editar un snippet
- app.component.ts: Componente principal de la aplicación, es el encargado de iniciar los procesos principales
- domain_types.ts: Tiene las interfaces para maninpular las entidades.

El  resto de los ficheros son propios de Angular2, puede buscar documentación apropieda para comprenderlos.

Ver los comentarios dentro de los ficheros para entender el funcionamiento.

## TODO:
Falta implementar las pruebas automáticas, realmente se debería haber hecho desde el principio del desarrollo  
