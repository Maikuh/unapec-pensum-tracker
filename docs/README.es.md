# UNAPEC Pensum Tracker

**Idioma:** [English](../README.md) / _Español_

## ¿Qué es?

Aplicación web diseñada para permitir al usuario (un estudiante de UNAPEC) mantener un registro de que materias ha tomado. Los pensums son tomados de la página oficial de UNAPEC (vía scraping), y luego utilizados en el cliente (React.js).

El proyecto puede ser visto en [https://maikuh.gitlab.io/unapec-pensum-tracker/](https://maikuh.gitlab.io/unapec-pensum-tracker/)

## Características

-   Seleccionar carrera/pensum
-   Mostrar la fecha del pensum, de la página oficial
-   Mostrar cuantas materias el usuario ha tomado (ejemplo: _12 de 78_) y el porcentaje del total
-   Mostrar cuantos créditos el usuario ha tomado (ejemplo: _43 de 268_) y el porcentaje del total
-   Mostrar un link hacia el pensum original, del cual los datos son "scraped"
-   Mostrar materias por cuatrimestre, con su código, créditos y prerrequisitos correspondientes
-   El usuario no puede seleccionar una materia si los prerrequisitos no han sido tomados
-   Poner el cursor encima de un prerrequisito para mostrar el nombre completo
-   Deseleccionar una materia también deselecciona todas las materias que tienen la primera como un prerrequisito. Esto significa, que cadena de materias (como ENG001, ENG002, entre otros) serán todas deseleccionadas
-   El usuario puede seleccionar/deseleccionar un cuatrimestre entero. Si en dicho cuatrimestre hay materias las cuales el usuario no puede seleccionar, serán ignoradas, y las mismas reglas del punto anterior se aplican.
-   La última carrera elegida y las materias tomadas son persistidas a través de refrescado y cerrado de la pagina
-   El usuario puede importar y exportar un archivo con sus datos
-   Ir al principio de la página con un botón flotante

## ¿Qué está incluido?

1. Un [Web Scraper](scraper) que toma todos los links de UNAPEC de los pensums oficiales, y recopila todos los datos para generar un archivo amigable para Javascript (JSON) para usarlo en el cliente
2. Un [cliente](client) escrito en Typescript (React), generado con create-react-app, el cual usa el json generado arriba para llevar a cabo las características anteriores

## ¿Qué sigue?

-   Incluir el scraper en el CI/CD de GitLab, para que corra cada vez que se haga push al repo
-   Refactoring (WIP)
-   Resumen de las materias tomadas
-   Añadir Pruebas
