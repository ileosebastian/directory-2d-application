# Directory 2D (Versión pública)
Aplicación móvil que muestra recorridos en un entorno 2D dentro de edificios universitarios de la [UTM](https://utm.edu.ec), buscando docentes y ambientes para tal efecto.

[Directorio 2D UTM (Progressive Web App)](https://directory-2d.web.app)


Esta versión del proyecto tiene como finalidad enseñar a la comunidad lo que se puede hacer con Angular, Ionic y el elemento canvas HTML. Siendo parte de mi proyecto de grado, se sigue arquitecturas limpias (vertical slice architecture), algoritmo A* y pasos necesarios para ejecutarlo, sin utilizar el entorno real backend de la aplicación móvil.


## Video presentación
https://github.com/ileosebastian/directory-2d-application/assets/68453087/c0dee1f3-3a6e-45b7-ac42-65c8151e6740

## Requisitos para instalación:
- **NodeJS** v18.18.2
- **NPM** v9.8.1
- **Ionic** CLI v7.1.5
- **Angular CLI** v16.1.1, con los siguientes paquetes asociados:

    Angular: 16.1.2
    ... animations, common, compiler, compiler-cli, core, forms
    ... platform-browser, platform-browser-dynamic, router/
    - @angular-devkit/architect       v0.1601.1
    - @angular-devkit/build-angular   v16.1.1
    - @angular-devkit/core            v16.1.2
    - @angular-devkit/schematics      v16.0.3
    - @angular/cli                    v16.1.1
    - @angular/fire                   v7.6.1
    - @angular/language-service       v16.2.12
    - @schematics/angular             v16.2.12
    - rxjs                            v7.8.1
    - typescript                      v5.0.4
- **Android Studio** 2023 o 2024, que contenga cualquier dispositivo Android emulado desde la *API 33 o superiores*. 

## Pasos para ejecutar el software
1. Tener instalado las dependencias dichas en **Requisitos para la instalación**
2. Ejecutar el comando ```npm install``` en este directorio, para instalar las dependencias, las cuales se especifican en el archivo "project-summary.md".
3. Ejecutar el comando ```ionic serve``` el cual compilará la aplicación como sitio web, levantando un servidor local para desplegar el sistema.

4. Si se quiere ejecutar como aplicación móvil, solo tiene que ejecutar los siguientes comandos desde este mismo directorio:
```
ionic capacitor add android
ionic capacitor copy android
ionic capacitor sync android --prod
```
5. Con esto, la aplicación ya está compilada para ser ejecutada en un dispositivo Android y emularla. Para ello, debe ejecutar el comando ```ionic capacitor run android --prod```, el cual mostrará una lista de los dispositivos configurados desde Android Studio, de los cuales, al escoger uno, iniciará la creación del APK para instalarlo y ejecutarlo directamente en dicha plataforma.
6. Despues de esto, ya tendría un archivo APK, cuyo directorio en donde se encuentra es ```[...]\directory-2d\android\app\build\outputs\apk\debug.apk``` y con ello, poderlo ejecutar en cualqueir teléfono Android.

**Hecho por Leo Sebastian Intriago Zambrano.**
