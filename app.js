/**
 * White-Label Interactive Burger Builder Prototype
 * Replicates anatomical layer sorting, gap-opening physics, kitchen utensil delivery
 * (spatula, tongs, squeeze bottle), auto-scaling viewport camera, and the 3s "Na chapa" grill flow.
 */

const BASE_BURGER_PRICE = 24.0;

const I18N = {
  es: {
    title: 'Armá tu hamburguesa',
    initialCaption: 'Elegí el pan y tocá para apilar',
    free: 'Gratis',
    currency: '$',
    ctaDefault: 'Agregar al pedido',
    ctaGrilling: 'En la plancha...',
    ctaDone: '¡Pedido listo! Armar otra',
    grillCaption: 'Plancha a 250° · 3 minutos',
    doneCaptionPrefix: 'Salió de la plancha. ',
    doneCaptionAction: 'Armar otra',
    paidLabel: 'Pago confirmado · Delivery',
    queueText: 'Ya estás en la fila →',
    removedPrefix: 'Quitaste ',
  },
  pt: {
    title: 'Monte seu lanche',
    initialCaption: 'Escolha o pão e toque para empilhar',
    free: 'Grátis',
    currency: 'R$',
    ctaDefault: 'Adicionar ao pedido',
    ctaGrilling: 'Na chapa...',
    ctaDone: 'Pedido pronto! Montar outro',
    grillCaption: 'Chapa a 250° · 3 minutos',
    doneCaptionPrefix: 'Saiu da chapa. ',
    doneCaptionAction: 'Montar outro',
    paidLabel: 'Pagamento confirmado · Delivery',
    queueText: 'Você já está na fila →',
    removedPrefix: 'Removeu ',
  },
};

const BREADS = [
  {
    id: 'brioche',
    name: { es: 'Brioche', pt: 'Brioche' },
    topImg: 'assets/bun_brioche_top.png?v=4',
    bottomImg: 'assets/bun_brioche_bottom.png?v=4',
    iconImg: 'assets/bun_brioche_icon.png?v=4',
    bottomThickness: 22,
    topHeight: 54,
  },
  {
    id: 'australiano',
    name: { es: 'Australiano', pt: 'Australiano' },
    topImg: 'assets/bun_australiano_top.png?v=4',
    bottomImg: 'assets/bun_australiano_bottom.png?v=4',
    iconImg: 'assets/bun_australiano_icon.png?v=4',
    bottomThickness: 22,
    topHeight: 54,
  },
  {
    id: 'batata',
    name: { es: 'Papa', pt: 'Batata' },
    topImg: 'assets/bun_batata_top.png?v=4',
    bottomImg: 'assets/bun_batata_bottom.png?v=4',
    iconImg: 'assets/bun_batata_icon.png?v=4',
    bottomThickness: 22,
    topHeight: 52,
  },
  {
    id: 'parmesao',
    name: { es: 'Parmesano', pt: 'Parmesão' },
    topImg: 'assets/bun_parmesao_top.png?v=4',
    bottomImg: 'assets/bun_parmesao_bottom.png?v=4',
    iconImg: 'assets/bun_parmesao_icon.png?v=4',
    bottomThickness: 22,
    topHeight: 55,
  },
];

/**
 * 18 Ingredients in exact 5-column grid order from the video:
 * Row 1: Carne, Cheddar, Prato/Gouda, Frango/Pollo, Bacon
 * Row 2: Ovo/Huevo, Caramelizada, Onion rings, Cebola roxa, Picles
 * Row 3: Jalapeño, Tomate, Alface/Lechuga, Molho da casa, Barbecue
 * Row 4: Mostarda mel, Maionese, Sriracha
 */
const INGREDIENTS = [
  {
    id: 'carne',
    name: { es: 'Carne', pt: 'Carne' },
    price: 8,
    img: 'assets/carne.png?v=4',
    category: 'protein',
    baseSlot: 50,
    thickness: 17,
    width: 192,
    tool: 'spatula',
  },
  {
    id: 'cheddar',
    name: { es: 'Cheddar', pt: 'Cheddar' },
    price: 4,
    img: 'assets/cheddar.png?v=4',
    category: 'cheese',
    baseSlot: 54,
    thickness: 8,
    width: 194,
    tool: 'tongs',
  },
  {
    id: 'prato',
    name: { es: 'Gouda', pt: 'Prato' },
    price: 4,
    img: 'assets/prato.png?v=4',
    category: 'cheese',
    baseSlot: 55,
    thickness: 8,
    width: 192,
    tool: 'tongs',
  },
  {
    id: 'frango',
    name: { es: 'Pollo crispy', pt: 'Frango' },
    price: 7,
    img: 'assets/frango.png?v=4',
    category: 'protein',
    baseSlot: 52,
    thickness: 18,
    width: 190,
    tool: 'spatula',
  },
  {
    id: 'bacon',
    name: { es: 'Bacon', pt: 'Bacon' },
    price: 5,
    img: 'assets/bacon.png?v=4',
    category: 'topping_hot',
    baseSlot: 76,
    thickness: 10,
    width: 184,
    tool: 'tongs',
  },
  {
    id: 'ovo',
    name: { es: 'Huevo', pt: 'Ovo' },
    price: 4,
    img: 'assets/ovo.png?v=4',
    category: 'topping_hot',
    baseSlot: 82,
    thickness: 11,
    width: 176,
    tool: 'spatula',
  },
  {
    id: 'caramelizada',
    name: { es: 'Caramelizada', pt: 'Caramelizada' },
    price: 4,
    img: 'assets/caramelizada.png?v=4',
    category: 'topping_hot',
    baseSlot: 79,
    thickness: 10,
    width: 172,
    tool: 'drop',
  },
  {
    id: 'onion_rings',
    name: { es: 'Onion rings', pt: 'Onion rings' },
    price: 5,
    img: 'assets/onion_rings.png?v=4',
    category: 'topping_crispy',
    baseSlot: 86,
    thickness: 14,
    width: 180,
    tool: 'drop',
  },
  {
    id: 'cebola_roxa',
    name: { es: 'Cebolla morada', pt: 'Cebola roxa' },
    price: 2,
    img: 'assets/cebola_roxa.png?v=4',
    category: 'veggie',
    baseSlot: 34,
    thickness: 9,
    width: 178,
    tool: 'drop',
  },
  {
    id: 'picles',
    name: { es: 'Pepinillos', pt: 'Picles' },
    price: 2,
    img: 'assets/picles.png?v=4',
    category: 'veggie',
    baseSlot: 30,
    thickness: 8,
    width: 174,
    tool: 'drop',
  },
  {
    id: 'jalapeno',
    name: { es: 'Jalapeño', pt: 'Jalapeño' },
    price: 3,
    img: 'assets/jalapeno.png?v=4',
    category: 'veggie',
    baseSlot: 38,
    thickness: 8,
    width: 170,
    tool: 'drop',
  },
  {
    id: 'tomate',
    name: { es: 'Tomate', pt: 'Tomate' },
    price: 2,
    img: 'assets/tomate.png?v=4',
    category: 'veggie',
    baseSlot: 26,
    thickness: 10,
    width: 184,
    tool: 'drop',
  },
  {
    id: 'alface',
    name: { es: 'Lechuga', pt: 'Alface' },
    price: 2,
    img: 'assets/alface.png?v=4',
    category: 'veggie',
    baseSlot: 22,
    thickness: 12,
    width: 202,
    tool: 'drop',
  },
  {
    id: 'molho_casa',
    name: { es: 'Salsa casa', pt: 'Molho da casa' },
    price: 2,
    img: 'assets/molho_casa.png?v=4',
    category: 'sauce',
    baseSlot: 12,
    thickness: 6,
    width: 162,
    tool: 'bottle',
    sauceColor: '#E07A44',
  },
  {
    id: 'barbecue',
    name: { es: 'Barbecue', pt: 'Barbecue' },
    price: 2,
    img: 'assets/barbecue.png?v=4',
    category: 'sauce',
    baseSlot: 16,
    thickness: 6,
    width: 162,
    tool: 'bottle',
    sauceColor: '#5C1D12',
  },
  {
    id: 'mostarda_mel',
    name: { es: 'Mostaza miel', pt: 'Mostarda mel' },
    price: 3,
    img: 'assets/mostarda_mel.png?v=4',
    category: 'sauce',
    baseSlot: 14,
    thickness: 6,
    width: 162,
    tool: 'bottle',
    sauceColor: '#D99B26',
  },
  {
    id: 'maionese',
    name: { es: 'Mayonesa', pt: 'Maionese' },
    price: 0,
    img: 'assets/maionese.png?v=4',
    category: 'sauce',
    baseSlot: 10,
    thickness: 6,
    width: 160,
    tool: 'bottle',
    sauceColor: '#F7E7B4',
  },
  {
    id: 'sriracha',
    name: { es: 'Sriracha', pt: 'Sriracha' },
    price: 2,
    img: 'assets/sriracha.png?v=4',
    category: 'sauce',
    baseSlot: 18,
    thickness: 6,
    width: 160,
    tool: 'bottle',
    sauceColor: '#C92A1D',
  },
];

const INGREDIENT_MAP = Object.fromEntries(INGREDIENTS.map((item) => [item.id, item]));
const BREAD_MAP = Object.fromEntries(BREADS.map((b) => [b.id, b]));

// Application State
const state = {
  lang: 'es',
  selectedBread: 'brioche',
  counts: Object.fromEntries(INGREDIENTS.map((item) => [item.id, 0])),
  instances: [], // Array of { uid, ingId, copyIndex }
  uidCounter: 1,
  grillState: 'idle', // 'idle' | 'grilling' | 'done'
  grillTimer: null,
  grillProgressRAF: null,
  steamRAF: null,
  liftTimeout: null,
};

// DOM Elements
const dom = {
  title: document.getElementById('ui-title'),
  langToggle: document.getElementById('lang-toggle'),
  langLabel: document.getElementById('lang-label'),
  resetBtn: document.getElementById('reset-btn'),
  breadSelector: document.getElementById('bread-selector'),
  burgerCamera: document.getElementById('burger-camera'),
  burgerStack: document.getElementById('burger-stack'),
  floorShadow: document.getElementById('burger-floor-shadow'),
  utensilLayer: document.getElementById('utensil-layer'),
  stageCaption: document.getElementById('stage-caption'),
  ingredientsGrid: document.getElementById('ingredients-grid'),
  ctaBtn: document.getElementById('order-cta-btn'),
  ctaProgress: document.getElementById('cta-progress-fill'),
  ctaLabel: document.getElementById('cta-label'),
  ctaPrice: document.getElementById('cta-price'),
  steamCanvas: document.getElementById('steam-canvas'),
  orderToast: document.getElementById('order-ready-toast'),
  toastSummaryText: document.getElementById('toast-summary-text'),
  toastPaidLabel: document.getElementById('toast-paid-label'),
  toastQueuePill: document.getElementById('toast-queue-pill'),
  toastQueueText: document.getElementById('toast-queue-text'),
};

// Persistent DOM elements inside #burger-stack
const layerDomMap = new Map(); // key -> HTMLElement
let flagEl = null;

/**
 * Compute anatomical slot order for an ingredient instance so layers always
 * stack in culinary order (Sauces -> Veggies -> Patty #1 -> Cheese #1 -> Patty #2 -> Cheese #2 -> Crispy Toppings).
 */
function getAnatomicalSortKey(instance) {
  const ing = INGREDIENT_MAP[instance.ingId];
  if (ing.category === 'protein') {
    return 50 + (instance.copyIndex - 1) * 10 + (ing.id === 'frango' ? 2 : 0);
  }
  if (ing.category === 'cheese') {
    return 54 + (instance.copyIndex - 1) * 10 + (ing.id === 'prato' ? 1 : 0);
  }
  return ing.baseSlot + (instance.copyIndex - 1) * 0.4;
}

function getSortedInstances() {
  return [...state.instances].sort((a, b) => {
    const diff = getAnatomicalSortKey(a) - getAnatomicalSortKey(b);
    return diff !== 0 ? diff : a.uid - b.uid;
  });
}

function formatMoney(value) {
  const t = I18N[state.lang];
  const formatted = value.toFixed(2).replace('.', ',');
  return `${t.currency} ${formatted}`;
}

function calculateTotalPrice() {
  let extra = 0;
  for (const ing of INGREDIENTS) {
    extra += (state.counts[ing.id] || 0) * ing.price;
  }
  return BASE_BURGER_PRICE + extra;
}

/**
 * Render the 4 Bread option cards
 */
function renderBreadSelector() {
  dom.breadSelector.innerHTML = '';
  for (const bread of BREADS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `bread-card${state.selectedBread === bread.id ? ' is-active' : ''}`;
    btn.dataset.breadId = bread.id;
    btn.setAttribute('aria-pressed', String(state.selectedBread === bread.id));
    btn.innerHTML = `
      <img class="bread-thumb" src="${bread.iconImg}" alt="${bread.name[state.lang]}" draggable="false">
      <span class="bread-name">${bread.name[state.lang]}</span>
    `;
    btn.addEventListener('click', () => selectBread(bread.id));
    dom.breadSelector.appendChild(btn);
  }
}

/**
 * Render the 18 Ingredient cards in the 5-column grid
 */
function renderIngredientsGrid() {
  dom.ingredientsGrid.innerHTML = '';
  const t = I18N[state.lang];

  for (const ing of INGREDIENTS) {
    const qty = state.counts[ing.id] || 0;
    const isActive = qty > 0;
    const badgeText = qty > 1 ? `x${qty}` : '✓';
    const priceLabel = ing.price === 0 ? t.free : `+${t.currency} ${ing.price}`;

    const card = document.createElement('div');
    card.role = 'button';
    card.tabIndex = 0;
    card.className = `ing-card${isActive ? ' is-active' : ''}`;
    card.dataset.ingId = ing.id;
    card.setAttribute('aria-label', `${ing.name[state.lang]} ${priceLabel}`);

    card.innerHTML = `
      <button type="button" class="ing-minus-btn" data-minus-id="${ing.id}" aria-label="Quitar ${ing.name[state.lang]}">−</button>
      <span class="ing-badge" data-badge-id="${ing.id}">${badgeText}</span>
      <div class="ing-thumb-wrap">
        <img class="ing-thumb" src="${ing.img}" alt="${ing.name[state.lang]}" draggable="false">
      </div>
      <span class="ing-name">${ing.name[state.lang]}</span>
      <span class="ing-price">${priceLabel}</span>
    `;

    const minusBtn = card.querySelector('.ing-minus-btn');
    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeIngredient(ing.id);
    });

    card.addEventListener('click', () => {
      addIngredient(ing.id);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        addIngredient(ing.id);
      }
    });

    dom.ingredientsGrid.appendChild(card);
  }
}

/**
 * Update active classes and badges on the ingredient cards without rebuilding the grid DOM
 */
function syncIngredientCardsUI() {
  const cards = dom.ingredientsGrid.querySelectorAll('.ing-card');
  cards.forEach((card) => {
    const id = card.dataset.ingId;
    const qty = state.counts[id] || 0;
    const badge = card.querySelector('.ing-badge');
    if (qty > 0) {
      card.classList.add('is-active');
      badge.textContent = qty > 1 ? `x${qty}` : '✓';
    } else {
      card.classList.remove('is-active');
      badge.textContent = '✓';
    }
  });
}

/**
 * Ensure persistent bottom bun, top bun, and toothpick flag elements exist in #burger-stack
 * Pre-renders all 4 bread variants in the DOM so switching bread is 0ms with zero network wait.
 */
function ensureBaseStackElements() {
  if (!layerDomMap.has('bun_bottom')) {
    const botEl = document.createElement('div');
    botEl.className = 'burger-layer layer-bun-bottom';
    botEl.style.setProperty('--layer-width', '196px');
    botEl.innerHTML = BREADS.map(
      (b) =>
        `<img class="bun-variant${b.id === state.selectedBread ? ' is-active-bun' : ''}" data-bread-id="${b.id}" src="${b.bottomImg}" alt="Base ${b.name[state.lang]}" ${b.id === 'brioche' ? 'fetchpriority="high"' : ''} draggable="false">`
    ).join('');
    dom.burgerStack.appendChild(botEl);
    layerDomMap.set('bun_bottom', botEl);
  }

  if (!layerDomMap.has('bun_top')) {
    const topEl = document.createElement('div');
    topEl.className = 'burger-layer layer-bun-top';
    topEl.style.setProperty('--layer-width', '202px');
    topEl.innerHTML = BREADS.map(
      (b) =>
        `<img class="bun-variant${b.id === state.selectedBread ? ' is-active-bun' : ''}" data-bread-id="${b.id}" src="${b.topImg}" alt="Tapa ${b.name[state.lang]}" ${b.id === 'brioche' ? 'fetchpriority="high"' : ''} draggable="false">`
    ).join('');
    dom.burgerStack.appendChild(topEl);
    layerDomMap.set('bun_top', topEl);
  }

  if (!flagEl) {
    flagEl = document.createElement('div');
    flagEl.className = 'burger-flag flag-hidden';
    flagEl.innerHTML = `<img src="assets/prop_flag.png" alt="" draggable="false">`;
    dom.burgerStack.appendChild(flagEl);
  }
}

/**
 * Compute vertical coordinates for every layer in the burger stack and apply transforms.
 * If `insertedUid` is provided, performs the 3-phase Gap Opening + Utensil Delivery + Spring Settle choreography.
 */
function layoutBurgerStack({ insertedInstance = null } = {}) {
  ensureBaseStackElements();

  const bread = BREAD_MAP[state.selectedBread];
  const sorted = getSortedInstances();
  const isGrilling = state.grillState === 'grilling' || state.grillState === 'done';
  const compressionFactor = isGrilling ? 0.76 : 1.0;

  const baseBottomY = 14;
  let cursorY = baseBottomY;

  // 1. Position Bottom Bun
  const botEl = layerDomMap.get('bun_bottom');
  botEl.style.zIndex = '10';
  botEl.style.setProperty('--layer-bottom', `${cursorY}px`);
  botEl.style.setProperty('--lift-y', '0px');

  cursorY += Math.round(bread.bottomThickness * compressionFactor);

  // Find index of newly inserted instance so we know which layers are above it
  const insertedIdx = insertedInstance
    ? sorted.findIndex((inst) => inst.uid === insertedInstance.uid)
    : -1;

  let insertedBottomY = cursorY;

  // 2. Position sorted ingredient instances
  sorted.forEach((inst, idx) => {
    const key = `ing_${inst.uid}`;
    const ing = INGREDIENT_MAP[inst.ingId];
    let el = layerDomMap.get(key);

    // Deterministic organic micro-jitter so stacked copies look natural
    const jitterX = ((inst.uid * 7) % 7) - 3;
    const jitterRot = (((inst.uid * 11) % 5) - 2) * 0.65;

    if (!el) {
      el = document.createElement('div');
      el.className = 'burger-layer';
      el.style.setProperty('--layer-width', `${ing.width}px`);
      el.style.setProperty('--offset-x', `${jitterX}px`);
      el.style.setProperty('--layer-rot', `${jitterRot}deg`);
      el.innerHTML = `<img src="${ing.img}" alt="${ing.name[state.lang]}" draggable="false">`;

      // Apply initial entrance pose if this is the newly inserted layer
      if (insertedInstance && inst.uid === insertedInstance.uid) {
        if (ing.tool === 'spatula') {
          el.classList.add('enter-from-right');
        } else if (ing.tool === 'tongs') {
          el.classList.add('enter-from-top-right');
        } else if (ing.tool === 'bottle') {
          el.classList.add('enter-sauce-pool');
        } else {
          el.classList.add('enter-from-drop');
        }
      }

      dom.burgerStack.appendChild(el);
      layerDomMap.set(key, el);
    }

    const layerBottom = cursorY;
    if (insertedInstance && inst.uid === insertedInstance.uid) {
      insertedBottomY = layerBottom;
    }

    el.style.zIndex = String(20 + idx);
    el.style.setProperty('--layer-bottom', `${layerBottom}px`);

    // If a new ingredient is being inserted below this layer, lift this layer upward to open the gap
    if (insertedIdx !== -1 && idx > insertedIdx) {
      el.style.setProperty('--lift-y', '-56px');
    } else {
      el.style.setProperty('--lift-y', '0px');
    }

    cursorY += Math.round(ing.thickness * compressionFactor);
  });

  // 3. Position Top Bun
  const topEl = layerDomMap.get('bun_top');
  const topBunBottom = cursorY + (sorted.length === 0 ? 2 : 0);
  topEl.style.zIndex = String(30 + sorted.length);
  topEl.style.setProperty('--layer-bottom', `${topBunBottom}px`);

  if (insertedIdx !== -1) {
    // Lift the top bun high to open the gap for the incoming ingredient & utensil
    topEl.style.setProperty('--lift-y', '-62px');
  } else {
    topEl.style.setProperty('--lift-y', '0px');
  }

  // 4. Position Toothpick Flag above Top Bun
  const totalStackHeight = topBunBottom + bread.topHeight;
  if (flagEl) {
    flagEl.style.setProperty('--flag-bottom', `${topBunBottom + bread.topHeight - 16}px`);
  }

  // 5. Auto-scale camera so tall burgers stay framed inside the stage
  const idealScale = totalStackHeight > 148 ? Math.max(0.62, Math.min(1, 154 / totalStackHeight)) : 1;
  const camOffsetY = totalStackHeight > 155 ? Math.min(18, (totalStackHeight - 155) * 0.14) : 0;
  dom.burgerCamera.style.setProperty('--cam-scale', idealScale.toFixed(3));
  dom.burgerCamera.style.setProperty('--cam-y', `${camOffsetY.toFixed(1)}px`);
  dom.floorShadow.style.setProperty('--shadow-scale', (1 / Math.sqrt(idealScale)).toFixed(3));

  // 6. Trigger entrance + utensil choreography if a layer was just inserted
  if (insertedInstance) {
    const newEl = layerDomMap.get(`ing_${insertedInstance.uid}`);
    const ing = INGREDIENT_MAP[insertedInstance.ingId];

    spawnKitchenUtensil(ing, insertedBottomY);

    // Phase 2: Glide/drop the new ingredient into the open gap
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (newEl) {
          newEl.classList.remove(
            'enter-from-right',
            'enter-from-top-right',
            'enter-sauce-pool',
            'enter-from-drop'
          );
        }
      });
    });

    // Phase 3: Settle all upper layers + top bun down onto the new ingredient with spring bounce
    if (state.liftTimeout) {
      clearTimeout(state.liftTimeout);
    }
    state.liftTimeout = setTimeout(() => {
      sorted.forEach((inst) => {
        const el = layerDomMap.get(`ing_${inst.uid}`);
        if (el) el.style.setProperty('--lift-y', '0px');
      });
      topEl.style.setProperty('--lift-y', '0px');
    }, 310);
  }
}

/**
 * Spawn the realistic kitchen utensil (Spatula, Tongs, or Squeeze Bottle) at the open gap height
 */
function spawnKitchenUtensil(ing, gapBottomY) {
  dom.utensilLayer.innerHTML = '';
  if (!ing || ing.tool === 'drop') return;

  const sprite = document.createElement('img');
  sprite.draggable = false;
  sprite.alt = '';

  if (ing.tool === 'spatula') {
    sprite.src = 'assets/tool_spatula.png?v=4';
    sprite.className = 'utensil-sprite utensil-spatula';
    sprite.style.setProperty('--utensil-bottom', `${gapBottomY - 6}px`);
    dom.utensilLayer.appendChild(sprite);
  } else if (ing.tool === 'tongs') {
    sprite.src = 'assets/tool_tongs.png?v=4';
    sprite.className = 'utensil-sprite utensil-tongs';
    sprite.style.setProperty('--utensil-bottom', `${gapBottomY + 8}px`);
    dom.utensilLayer.appendChild(sprite);
  } else if (ing.tool === 'bottle') {
    sprite.src = 'assets/tool_bottle.png?v=4';
    sprite.className = 'utensil-sprite utensil-bottle';
    sprite.style.setProperty('--utensil-bottom', `${gapBottomY + 26}px`);
    dom.utensilLayer.appendChild(sprite);

    // Spawn 4 glossy sauce stream droplets falling from the bottle nozzle onto the burger
    const offsets = [-16, -4, 10, -8];
    offsets.forEach((dx, i) => {
      setTimeout(() => {
        const dot = document.createElement('div');
        dot.className = 'sauce-stream-dot';
        dot.style.setProperty('--stream-bottom', `${gapBottomY + 8}px`);
        dot.style.setProperty('--drop-x', `${dx}px`);
        dot.style.setProperty('--sauce-color', ing.sauceColor || '#FACC15');
        dom.utensilLayer.appendChild(dot);
        setTimeout(() => dot.remove(), 380);
      }, 95 + i * 55);
    });
  }

  setTimeout(() => {
    if (sprite.parentNode) sprite.remove();
  }, 640);
}

/**
 * Switch Bread Type (Brioche, Australiano, Batata/Papa, Parmesão/Parmesano)
 */
function selectBread(breadId) {
  if (state.grillState === 'grilling') return;
  if (state.grillState === 'done') {
    exitDoneStateKeepBurger();
  }

  state.selectedBread = breadId;
  const bread = BREAD_MAP[breadId];

  // Update active state on bread cards
  const cards = dom.breadSelector.querySelectorAll('.bread-card');
  cards.forEach((c) => {
    const active = c.dataset.breadId === breadId;
    c.classList.toggle('is-active', active);
    c.setAttribute('aria-pressed', String(active));
  });

  ensureBaseStackElements();
  const botEl = layerDomMap.get('bun_bottom');
  const topEl = layerDomMap.get('bun_top');

  botEl.querySelectorAll('.bun-variant').forEach((img) => {
    img.classList.toggle('is-active-bun', img.dataset.breadId === breadId);
  });
  topEl.querySelectorAll('.bun-variant').forEach((img) => {
    img.classList.toggle('is-active-bun', img.dataset.breadId === breadId);
  });

  layoutBurgerStack();

  // Expressive spring pop when switching buns (after layoutBurgerStack so it isn't overwritten)
  topEl.style.setProperty('--lift-y', '-38px');
  topEl.style.setProperty('--layer-scale-x', '1.05');
  topEl.style.setProperty('--layer-scale-y', '0.94');
  botEl.style.setProperty('--lift-y', '12px');
  botEl.style.setProperty('--layer-scale-x', '1.05');
  botEl.style.setProperty('--layer-scale-y', '0.94');

  state.instances.forEach((inst) => {
    const el = layerDomMap.get(`ing_${inst.uid}`);
    if (el) el.style.setProperty('--lift-y', '-10px');
  });

  requestAnimationFrame(() => {
    setTimeout(() => {
      topEl.style.setProperty('--lift-y', '0px');
      topEl.style.setProperty('--layer-scale-x', '1');
      topEl.style.setProperty('--layer-scale-y', '1');
      botEl.style.setProperty('--lift-y', '0px');
      botEl.style.setProperty('--layer-scale-x', '1');
      botEl.style.setProperty('--layer-scale-y', '1');
      state.instances.forEach((inst) => {
        const el = layerDomMap.get(`ing_${inst.uid}`);
        if (el) el.style.setProperty('--lift-y', '0px');
      });
    }, 60);
  });

  const prefix = state.lang === 'es' ? 'Pan ' : 'Pão ';
  setStageCaption(`${prefix}${bread.name[state.lang]}`, true);
}

/**
 * Add an ingredient layer when clicking its card
 */
function addIngredient(ingId) {
  if (state.grillState === 'grilling') return;
  if (state.grillState === 'done') {
    exitDoneStateKeepBurger();
  }

  const ing = INGREDIENT_MAP[ingId];
  if (!ing) return;

  const currentQty = state.counts[ingId] || 0;
  if (currentQty >= 4) {
    // Pulse caption if max 4 copies of a single item reached
    setStageCaption(`${ing.name[state.lang]} x${currentQty} (máx)`, true);
    return;
  }

  const nextQty = currentQty + 1;
  state.counts[ingId] = nextQty;

  const newInstance = {
    uid: state.uidCounter++,
    ingId,
    copyIndex: nextQty,
  };
  state.instances.push(newInstance);

  syncIngredientCardsUI();
  updateFooterCTA();
  layoutBurgerStack({ insertedInstance: newInstance });

  // Update caption to match video ("Cheddar x2", "Carne +$ 8", etc.)
  const t = I18N[state.lang];
  if (nextQty > 1) {
    setStageCaption(`${ing.name[state.lang]} x${nextQty}`, true);
  } else {
    const pricePart = ing.price === 0 ? t.free : `+${t.currency} ${ing.price}`;
    setStageCaption(`${ing.name[state.lang]} · ${pricePart}`, true);
  }
}

/**
 * Remove the top-most instance of an ingredient when clicking its '-' button
 */
function removeIngredient(ingId) {
  if (state.grillState === 'grilling') return;
  if (state.grillState === 'done') {
    exitDoneStateKeepBurger();
  }

  const currentQty = state.counts[ingId] || 0;
  if (currentQty <= 0) return;

  // Find the latest added instance for this ingredient
  let targetIndex = -1;
  for (let i = state.instances.length - 1; i >= 0; i--) {
    if (state.instances[i].ingId === ingId) {
      targetIndex = i;
      break;
    }
  }
  if (targetIndex === -1) return;

  const [removed] = state.instances.splice(targetIndex, 1);
  state.counts[ingId] = currentQty - 1;

  const key = `ing_${removed.uid}`;
  const el = layerDomMap.get(key);
  if (el) {
    el.classList.add('is-removing');
    layerDomMap.delete(key);
    setTimeout(() => el.remove(), 240);
  }

  syncIngredientCardsUI();
  updateFooterCTA();
  layoutBurgerStack();

  const ing = INGREDIENT_MAP[ingId];
  const t = I18N[state.lang];
  if (state.instances.length === 0) {
    setStageCaption(t.initialCaption, false);
  } else {
    setStageCaption(`${t.removedPrefix}${ing.name[state.lang]}`, false);
  }
}

function setStageCaption(text, highlight = false) {
  dom.stageCaption.textContent = text;
  dom.stageCaption.classList.toggle('caption-highlight', Boolean(highlight));
}

function updateFooterCTA() {
  const t = I18N[state.lang];
  const total = calculateTotalPrice();

  if (state.grillState === 'grilling') {
    dom.ctaBtn.classList.add('is-grilling');
    dom.ctaLabel.textContent = t.ctaGrilling;
    dom.ctaPrice.textContent = formatMoney(total);
  } else if (state.grillState === 'done') {
    dom.ctaBtn.classList.remove('is-grilling');
    dom.ctaProgress.style.width = '0%';
    dom.ctaLabel.textContent = t.ctaDone;
    dom.ctaPrice.textContent = formatMoney(total);
  } else {
    dom.ctaBtn.classList.remove('is-grilling');
    dom.ctaProgress.style.width = '0%';
    dom.ctaLabel.textContent = `${t.ctaDefault} ·`;
    dom.ctaPrice.textContent = formatMoney(total);
  }
}

/**
 * Trigger the 3-second "Na chapa" / "En la plancha" grill experience
 */
function startGrillSequence() {
  if (state.grillState === 'grilling') return;
  if (state.grillState === 'done') {
    resetBurger();
    return;
  }

  state.grillState = 'grilling';
  dom.orderToast.hidden = true;
  dom.burgerStack.classList.add('is-grilling');
  if (flagEl) flagEl.classList.add('flag-hidden');

  const t = I18N[state.lang];
  setStageCaption(t.grillCaption, true);
  updateFooterCTA();

  // Compress the burger layers slightly on the hot grill
  layoutBurgerStack();

  // Start rising grill steam particles
  startSteamEffect();

  // Animate button progress bar over 3000ms
  const duration = 3000;
  const startTime = performance.now();

  function tickProgress(now) {
    if (state.grillState !== 'grilling') return;
    const elapsed = now - startTime;
    const pct = Math.min(100, (elapsed / duration) * 100);
    dom.ctaProgress.style.width = `${pct.toFixed(1)}%`;
    if (elapsed < duration) {
      state.grillProgressRAF = requestAnimationFrame(tickProgress);
    }
  }
  state.grillProgressRAF = requestAnimationFrame(tickProgress);

  state.grillTimer = setTimeout(() => {
    completeGrillSequence();
  }, duration);
}

/**
 * Finish the 3-second grill sequence: drop toothpick flag, show "Salió de la plancha. Armar otra",
 * and display the floating recipe summary toast.
 */
function completeGrillSequence() {
  state.grillState = 'done';
  stopSteamEffect();

  // Drop toothpick flag into the top bun
  if (flagEl) {
    flagEl.classList.remove('flag-hidden');
  }

  const t = I18N[state.lang];
  dom.stageCaption.innerHTML = `${t.doneCaptionPrefix}<button type="button" class="stage-caption-btn" id="armar-otra-link">${t.doneCaptionAction}</button>`;
  const linkBtn = document.getElementById('armar-otra-link');
  if (linkBtn) {
    linkBtn.addEventListener('click', () => resetBurger());
  }

  updateFooterCTA();
  showOrderReadyToast();
}

function showOrderReadyToast() {
  const t = I18N[state.lang];
  const bread = BREAD_MAP[state.selectedBread];
  const parts = [bread.name[state.lang]];

  for (const ing of INGREDIENTS) {
    const qty = state.counts[ing.id] || 0;
    if (qty === 1) {
      parts.push(ing.name[state.lang]);
    } else if (qty > 1) {
      parts.push(`${qty}x ${ing.name[state.lang]}`);
    }
  }

  const totalStr = formatMoney(calculateTotalPrice());
  dom.toastSummaryText.innerHTML = `${parts.join(' · ')} — <strong>${totalStr}</strong>`;
  dom.toastPaidLabel.textContent = t.paidLabel;
  dom.toastQueueText.textContent = t.queueText;
  dom.orderToast.hidden = false;
}

function exitDoneStateKeepBurger() {
  state.grillState = 'idle';
  dom.orderToast.hidden = true;
  dom.burgerStack.classList.remove('is-grilling');
  if (flagEl) flagEl.classList.add('flag-hidden');
  updateFooterCTA();
}

function resetBurger() {
  if (state.grillTimer) clearTimeout(state.grillTimer);
  if (state.grillProgressRAF) cancelAnimationFrame(state.grillProgressRAF);
  stopSteamEffect();

  state.grillState = 'idle';
  dom.orderToast.hidden = true;
  dom.burgerStack.classList.remove('is-grilling');
  if (flagEl) flagEl.classList.add('flag-hidden');

  // Remove all ingredient DOM elements
  for (const [key, el] of layerDomMap.entries()) {
    if (key.startsWith('ing_')) {
      el.remove();
      layerDomMap.delete(key);
    }
  }

  state.instances = [];
  for (const ing of INGREDIENTS) {
    state.counts[ing.id] = 0;
  }

  syncIngredientCardsUI();
  updateFooterCTA();
  layoutBurgerStack();
  setStageCaption(I18N[state.lang].initialCaption, false);
}

/**
 * 60fps Canvas Steam / Grill Smoke Particle System during "Na chapa"
 */
function startSteamEffect() {
  const canvas = dom.steamCanvas;
  const ctx = canvas.getContext('2d');
  const particles = [];

  for (let i = 0; i < 26; i++) {
    particles.push(createSteamParticle(canvas.width, canvas.height, true));
  }

  function createSteamParticle(w, h, randomWarmup = false) {
    const spreadX = (Math.random() - 0.5) * 150;
    return {
      x: w * 0.5 + spreadX,
      y: randomWarmup ? h * 0.45 + Math.random() * 110 : h * 0.78 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -(0.85 + Math.random() * 1.15),
      radius: 14 + Math.random() * 22,
      alpha: 0.05 + Math.random() * 0.22,
      life: randomWarmup ? Math.random() : 0,
      speed: 0.008 + Math.random() * 0.008,
    };
  }

  function renderSteam() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx + Math.sin(p.life * 8 + i) * 0.25;
      p.y += p.vy;
      p.radius += 0.18;
      p.life += p.speed;

      const fade = Math.sin(Math.min(1, p.life) * Math.PI);
      const alpha = p.alpha * fade;

      if (alpha > 0.005) {
        const grad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(255, 252, 246, ${alpha.toFixed(3)})`);
        grad.addColorStop(0.55, `rgba(235, 230, 222, ${(alpha * 0.5).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(235, 230, 222, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (p.life >= 1 || p.y < 15) {
        particles[i] = createSteamParticle(canvas.width, canvas.height, false);
      }
    }

    if (state.grillState === 'grilling') {
      state.steamRAF = requestAnimationFrame(renderSteam);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  state.steamRAF = requestAnimationFrame(renderSteam);
}

function stopSteamEffect() {
  if (state.steamRAF) {
    cancelAnimationFrame(state.steamRAF);
    state.steamRAF = null;
  }
  const ctx = dom.steamCanvas.getContext('2d');
  ctx.clearRect(0, 0, dom.steamCanvas.width, dom.steamCanvas.height);
}

/**
 * Toggle Language between Spanish (ES) and Portuguese (PT)
 */
function toggleLanguage() {
  state.lang = state.lang === 'es' ? 'pt' : 'es';
  dom.langLabel.textContent = state.lang.toUpperCase();
  document.documentElement.lang = state.lang;

  const t = I18N[state.lang];
  dom.title.textContent = t.title;

  renderBreadSelector();
  renderIngredientsGrid();
  updateFooterCTA();

  if (state.grillState === 'done') {
    completeGrillSequence();
  } else if (state.grillState === 'grilling') {
    setStageCaption(t.grillCaption, true);
  } else if (state.instances.length === 0) {
    setStageCaption(t.initialCaption, false);
  }
}

/**
 * Initialize App
 */
function init() {
  renderBreadSelector();
  renderIngredientsGrid();
  ensureBaseStackElements();
  layoutBurgerStack();
  updateFooterCTA();

  dom.langToggle.addEventListener('click', toggleLanguage);
  dom.resetBtn.addEventListener('click', resetBurger);
  dom.ctaBtn.addEventListener('click', startGrillSequence);
  dom.toastQueuePill.addEventListener('click', resetBurger);
}

init();
