# Servicios Ya - Website Oficial

## 📋 Descripción
Website profesional para Servicios Ya, la plataforma líder de multiservicios en La Rioja, Argentina. Diseñado con enfoque en la experiencia del usuario final, facilitando la contratación de servicios profesionales de manera rápida y confiable.

## 🚀 Características Principales

- **Diseño Moderno y Responsivo**: Adaptado a todos los dispositivos
- **Animaciones Suaves**: Experiencia visual atractiva con AOS y animaciones CSS3
- **Optimizado para SEO**: Estructura semántica y meta tags optimizados
- **Carga Rápida**: Código optimizado y minificado
- **Integración WhatsApp**: Contacto directo con un click
- **Formulario de Solicitud**: Modal interactivo para solicitar servicios
- **100% en Español**: Contenido localizado para el mercado argentino

## 📁 Estructura de Archivos

```
servicios-ya-website/
│
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos principales
├── js/
│   └── main.js         # JavaScript principal
├── images/             # Imágenes y recursos
└── README.md           # Este archivo
```

## 🛠️ Instalación

### Requisitos Previos
- Servidor web (Apache, Nginx, etc.)
- Dominio configurado
- Certificado SSL (recomendado)

### Pasos de Instalación

1. **Subir archivos al servidor**
   ```bash
   # Via FTP o Panel de Control
   Sube toda la carpeta servicios-ya-website/ a tu public_html o www
   ```

2. **Configurar dominio**
   - Apunta tu dominio al directorio donde subiste los archivos
   - Configura SSL si es posible

3. **Verificar permisos**
   ```bash
   chmod 755 -R /ruta/a/servicios-ya-website/
   chmod 644 *.html *.css *.js
   ```

4. **Actualizar información de contacto**
   - Edita el archivo `index.html`
   - Busca y reemplaza:
     - `+543804123456` con tu número real
     - `info@serviciosya.com.ar` con tu email real
     - URLs de redes sociales

## 🎨 Personalización

### Colores de la Marca
Los colores están definidos en `css/styles.css`:
```css
:root {
    --primary-blue: #0D47A1;    /* Azul principal */
    --primary-orange: #F97316;  /* Naranja principal */
    --dark-gray: #1F2937;       /* Texto oscuro */
    --medium-gray: #6B7280;      /* Texto secundario */
}
```

### Logo
El logo está construido con emojis en el HTML. Para usar tu logo real:
1. Sube tu logo a la carpeta `images/`
2. Reemplaza el código del logo en `index.html`

### Servicios
Para agregar o modificar servicios, edita la sección `#servicios` en `index.html`

### Precios
Actualiza los precios en la sección `#precios` del archivo `index.html`

## 📱 Integración WhatsApp

El botón de WhatsApp está configurado para abrir una conversación con mensaje predefinido:
```html
<a href="https://wa.me/543804123456?text=Hola!%20Necesito%20un%20servicio">
```

Reemplaza `543804123456` con tu número de WhatsApp (código de país + número)

## 🔧 Optimización

### Para Producción

1. **Minificar archivos**
   - Usa herramientas como UglifyJS para JavaScript
   - CleanCSS para los estilos
   - HTMLMinifier para el HTML

2. **Optimizar imágenes**
   - Comprimir todas las imágenes
   - Usar formato WebP cuando sea posible
   - Implementar lazy loading

3. **Habilitar caché**
   Agrega a tu `.htaccess`:
   ```apache
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType text/css "access plus 1 month"
       ExpiresByType text/javascript "access plus 1 month"
       ExpiresByType image/jpeg "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
   </IfModule>
   ```

4. **Comprimir con Gzip**
   ```apache
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/html text/css text/javascript
   </IfModule>
   ```

## 📊 Analytics

Para agregar Google Analytics:
1. Obtén tu código de seguimiento
2. Agrégalo antes de `</head>` en `index.html`

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXXXXXX-X');
</script>
```

## 🔐 Seguridad

1. **Validación de formularios**: El JavaScript incluye validación básica
2. **HTTPS**: Siempre usa certificado SSL
3. **Headers de seguridad**: Configura en `.htaccess`:
   ```apache
   Header set X-Frame-Options "SAMEORIGIN"
   Header set X-Content-Type-Options "nosniff"
   Header set X-XSS-Protection "1; mode=block"
   ```

## 📞 Soporte

Para soporte técnico o consultas sobre el desarrollo:
- **Desarrollador**: Guilherme Henrique
- **Email**: [tu-email]
- **WhatsApp**: [tu-numero]

## 📄 Licencia

© 2024 Servicios Ya. Todos los derechos reservados.

---

**Nota**: Este sitio web fue desarrollado profesionalmente siguiendo las mejores prácticas de desarrollo web moderno, con enfoque en la experiencia del usuario y la conversión de clientes.