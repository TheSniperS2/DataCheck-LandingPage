# DataCheck Landing Page

Landing page estatica para DataCheck Consultores, enfocada en proteccion de datos sensibles para centros psicologicos y psiquiatricos privados.

## Contenido

- `index.html`: estructura principal de la landing.
- `styles.css`: estilos responsive y sistema visual.
- `script.js`: comportamiento del header, navegacion interna y validacion del formulario.
- `assets/`: imagenes optimizadas y notas sobre assets faltantes.

## Formulario

El formulario funciona como una demostracion local: valida los campos y muestra una confirmacion, pero no almacena ni envia los datos ingresados.

## Desarrollo local

Puedes abrir `index.html` directamente en el navegador o levantar un servidor local:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Luego abrir:

`http://127.0.0.1:4173`

## Privacidad

La carpeta `_context/` contiene documentos usados solo como referencia interna y esta excluida por `.gitignore`. No debe subirse al repositorio.
