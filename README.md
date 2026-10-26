# Interactive Burger Builder — White-Label Prototype

Prototipo web interactivo white-label de armado de hamburguesa en tiempo real, inspirado en flujos visuales de apilado por capas con física elástica y utensilios de cocina.

## Características

- **4 tipos de pan intercambiables**: Brioche, Australiano, Papa (`Batata`) y Parmesano (`Parmesão`), actualizando base y corona superior en vivo.
- **18 ingredientes interactivos** en grilla de 5 columnas con controles de incremento, botón `−` de decremento y badges dinámicos (`✓`, `x2`, `x3`, `x4`).
- **Ordenamiento anatómico inteligente**: Las capas se insertan automáticamente en su posición culinaria real (Base de pan → Salsas → Vegetales frescos → Proteínas y Quesos intercalados → Toppings calientes/crujientes → Corona de pan).
- **Física de apertura de hueco + Utensilios**:
  - Las capas superiores se elevan (`gap opening`) para abrir espacio exactamente donde entra el nuevo ingrediente.
  - **Espátula metálica** (`tool_spatula.png`) para carnes, pollo crispy y huevo.
  - **Pinzas de cocina** (`tool_tongs.png`) para quesos y bacon.
  - **Biberón de salsa** (`tool_bottle.png`) con gotas dinámicas para las 5 salsas.
  - **Caída por gravedad con rebote (`spring bounce`)** para vegetales y aros de cebolla.
- **Flujo de cocción `"En la plancha"` (`"Na chapa"`)**:
  - Al confirmar el pedido, la hamburguesa pasa 3 segundos en la plancha a `250°` con barra de progreso, compresión de capas, partículas de vapor en Canvas, caída del pincho con banderita (`prop_flag.png`) y tarjeta resumen flotante.
- **Soporte bilingüe (`ES` / `PT`)**: Alternancia instantánea entre Español y Português.
