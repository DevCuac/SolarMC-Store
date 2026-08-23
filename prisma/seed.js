const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SolarMC database seeding with generic mock data...');

  // Clean up any previous personal test accounts if they exist
  try {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['angelriveradeveloper@gmail.com', 'angel@example.com']
        }
      }
    });
  } catch (e) {}

  // 1. Create Admins, Partners & Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const partnerPassword = await bcrypt.hash('partner123', 10);
  const userPassword = await bcrypt.hash('player123', 10);

  // Admin Account: admin@solarmc.net / admin123
  const primaryAdmin = await prisma.user.upsert({
    where: { email: 'admin@solarmc.net' },
    update: {
      role: 'ADMIN',
      name: 'Administrador SolarMC',
      minecraftUsername: 'AdminSolar',
      minecraftEdition: 'Java',
    },
    create: {
      name: 'Administrador SolarMC',
      email: 'admin@solarmc.net',
      password: adminPassword,
      role: 'ADMIN',
      minecraftUsername: 'AdminSolar',
      minecraftEdition: 'Java',
    },
  });

  // Partner / Creator Account: partner@solarmc.net / partner123 (Code: SOLAR)
  const demoPartner = await prisma.user.upsert({
    where: { email: 'partner@solarmc.net' },
    update: {
      role: 'PARTNER',
      creatorCode: 'SOLAR',
      creatorCommissionRate: 10,
    },
    create: {
      name: 'Solar Creator Partner',
      email: 'partner@solarmc.net',
      password: partnerPassword,
      role: 'PARTNER',
      minecraftUsername: 'PartnerSolar',
      minecraftEdition: 'Java',
      creatorCode: 'SOLAR',
      creatorCommissionRate: 10,
    },
  });

  // Regular Player Account: jugador@solarmc.net / player123
  const demoPlayer = await prisma.user.upsert({
    where: { email: 'jugador@solarmc.net' },
    update: {},
    create: {
      name: 'Jugador SolarMC',
      email: 'jugador@solarmc.net',
      password: userPassword,
      role: 'USER',
      minecraftUsername: 'Steve',
      minecraftEdition: 'Java',
    },
  });

  console.log('✅ Generic Mock Accounts Created:');
  console.log('   - Admin:   admin@solarmc.net   / admin123   (Role: ADMIN)');
  console.log('   - Partner: partner@solarmc.net / partner123 (Role: PARTNER, Code: SOLAR)');
  console.log('   - Jugador: jugador@solarmc.net / player123  (Role: USER)');

  // 2. Create Categories in Spanish
  const categoriesData = [
    { name: 'Inicio', slug: 'home', icon: 'home', description: 'Los paquetes más populares y vendidos de la red SolarMC', sortOrder: 0 },
    { name: 'Prison', slug: 'prison', icon: 'prison', description: 'Rangos, picos, multiplicadores y mejoras para OP Prison', sortOrder: 1 },
    { name: 'Universes', slug: 'universes', icon: 'universes', description: 'Pases cósmicos, fragmentos solares y llaves de dimensiones', sortOrder: 2 },
    { name: 'Dungeons', slug: 'dungeons', icon: 'dungeons', description: 'Llaves de bosses, armaduras legendarias y potenciadores de raids', sortOrder: 3 },
    { name: 'Gens', slug: 'gens', icon: 'gens', description: 'Generadores automáticos, varitas de venta y multiplicadores tycoon', sortOrder: 4 },
    { name: 'Survival', slug: 'survival', icon: 'survival', description: 'Rangos survival, bloques de protección, mascotas y /fly', sortOrder: 5 },
    { name: 'Global', slug: 'global', icon: 'global', description: 'Créditos globales, cosméticos solares, etiquetas de chat y paquetes', sortOrder: 6 },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = created.id;
  }
  console.log('✅ Categories seeded in Spanish');

  // 3. Create Products in Spanish
  const productsData = [
    {
      name: '4,500 Créditos Solar',
      slug: '4500-solar-credits',
      description: 'Nuestro paquete de créditos más vendido. Mejora tu experiencia en todas las modalidades.',
      price: 49.99,
      originalPrice: 59.99,
      badge: 'MÁS VENDIDO',
      icon: 'coins',
      categoryId: categories['home'],
      perks: JSON.stringify([
        '4,500 Créditos de la Tienda SolarMC entregados al instante',
        'Útiles en Prison, Universes, Gens, Survival y Dungeons',
        'Desbloquea +500 Fichas de Lealtad Solar Flare de bonificación',
        'Prefijo exclusivo en el chat de SolarMC [4.5k Partidario]'
      ]),
      commands: JSON.stringify([
        'credits add {player} 4500',
        'bc &6&lTIENDA SOLAR &8» &e{player} &7ha adquirido el paquete de &64500 Créditos Solar&7! &a/store'
      ]),
      sortOrder: 0,
    },
    {
      name: 'Pase SolarMC Plus',
      slug: 'solarmc-plus-pass',
      description: 'Recibe Créditos mensuales, cajas de botín, llaves, skins y beneficios exclusivos cada mes.',
      price: 24.99,
      originalPrice: null,
      badge: 'MENSUAL',
      icon: 'sparkles',
      categoryId: categories['home'],
      perks: JSON.stringify([
        '2,000 Créditos Solar cada mes',
        '3x Cajas Legendarias Mensuales Solar Eclipse',
        '5x Cajas Exclusivas de Skins Personalizadas',
        'Acceso al comando /fly en todas las zonas del Hub y áreas pacíficas',
        '+25% Multiplicador de economía en todas las modalidades'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent addplus',
        'credits add {player} 2000',
        'crate give {player} solar_legendary 3'
      ]),
      sortOrder: 1,
    },
    {
      name: 'Rango Solar Overlord',
      slug: 'solar-overlord-rank',
      description: 'El rango supremo para Prison. Domina las minas y desbloquea baúles privados de élite.',
      price: 79.99,
      originalPrice: 99.99,
      badge: 'POPULAR',
      icon: 'crown',
      categoryId: categories['prison'],
      perks: JSON.stringify([
        'Acceso a /kit overlord (Armadura P50, Pico Eficiencia 200)',
        '10x Baúles Privados de Jugador (/pv 1-10)',
        'Multiplicador de Minería 3.5x',
        'Prefijo personalizado Overlord y tag brillante en el chat',
        'Mantén tu inventario al morir en minas PvP'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent add overlord',
        'broadcast &6&lRANGO &8» &f{player} &7ahora es &6&lOVERLORD&7!'
      ]),
      sortOrder: 0,
    },
    {
      name: 'Rango Titán',
      slug: 'titan-rank',
      description: 'Estatus superior con privilegios de auto-venta y mochila expandida.',
      price: 44.99,
      originalPrice: 59.99,
      badge: 'OFERTA -20%',
      icon: 'shield',
      categoryId: categories['prison'],
      perks: JSON.stringify([
        'Acceso a /kit titan (Armadura P35 y velocidad)',
        '6x Baúles Privados de Jugador',
        'Multiplicador 2.5x en venta de bloques',
        'Varita de auto-venta con cargas ilimitadas'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent add titan'
      ]),
      sortOrder: 1,
    },
    {
      name: 'Rango Solar God',
      slug: 'solar-god-rank',
      description: 'Aprovecha la energía cósmica a través de dimensiones infinitas con habilidades divinas.',
      price: 119.99,
      originalPrice: 149.99,
      badge: 'SUPREMO',
      icon: 'flame',
      categoryId: categories['universes'],
      perks: JSON.stringify([
        'Kit Solar God con encantamientos radiantes exclusivos',
        'Warp dimensional instantáneo sin tiempo de espera',
        'Inmunidad a la radiación y daño del vacío',
        '15x Velocidad de generación de fragmentos solares',
        'Efectos de partículas Solar Flare personalizados'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent add solargod',
        'shards give {player} 50000'
      ]),
      sortOrder: 0,
    },
    {
      name: 'Pase Maestro de Mazmorras',
      slug: 'dungeon-master-pass',
      description: 'Entradas ilimitadas a raids, doble drop de jefes y reliquias míticas exclusivas.',
      price: 19.99,
      originalPrice: 29.99,
      badge: 'PASE DE TEMPORADA',
      icon: 'swords',
      categoryId: categories['dungeons'],
      perks: JSON.stringify([
        'Entradas diarias ilimitadas a Mazmorras sin gastar llaves',
        '2x Probabilidad de botín mítico al derrotar jefes de Raid',
        'Título exclusivo [Maestro de Mazmorras]',
        'Ficha de revivir instantáneo por partida'
      ]),
      commands: JSON.stringify([
        'dungeons pass grant {player} master'
      ]),
      sortOrder: 0,
    },
    {
      name: 'Paquete Generadores Auto-Miner',
      slug: 'auto-miner-gen-pack',
      description: '10x Generadores automáticos de Netherite y Esmeralda que trabajan mientras duermes.',
      price: 29.99,
      originalPrice: 39.99,
      badge: 'OP BOOST',
      icon: 'package',
      categoryId: categories['gens'],
      perks: JSON.stringify([
        '5x Generadores Automáticos de Netherite Nivel V',
        '5x Generadores Automáticos de Esmeralda Nivel V',
        '1x Tolva de Vacío Ilimitada',
        '2x Potenciador de velocidad de generadores (Permanente)'
      ]),
      commands: JSON.stringify([
        'gens give {player} netherite_5 5',
        'gens give {player} emerald_5 5'
      ]),
      sortOrder: 0,
    },
    {
      name: 'Rango VIP Survival',
      slug: 'vip-survival-rank',
      description: 'Ventajas esenciales para constructores pacíficos, reclamos de terreno y acceso a vuelo.',
      price: 9.99,
      originalPrice: 14.99,
      badge: 'MEJOR VALOR',
      icon: 'star',
      categoryId: categories['survival'],
      perks: JSON.stringify([
        'Comando /fly habilitado en todas las zonas de supervivencia',
        '+5,000 Bloques de Reclamo adicionales',
        '4x Puntos de /sethome',
        'Acceso a /hat y /workbench'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent add vip'
      ]),
      sortOrder: 0,
    },
    {
      name: 'Mega Bóveda 10,000 Créditos Solar',
      slug: '10000-solar-credits-bundle',
      description: 'La bóveda de créditos definitiva para los comandantes más dedicados del servidor.',
      price: 99.99,
      originalPrice: 129.99,
      badge: 'MEGA OFERTA',
      icon: 'coins',
      categoryId: categories['global'],
      perks: JSON.stringify([
        '10,000 Créditos Globales utilizables en todas las modalidades',
        'Mascota Solar Mítica gratuita a tu elección',
        'Insignia animada en el chat [LEYENDA SOLAR]',
        'Acceso exclusivo a la sala VIP de Discord'
      ]),
      commands: JSON.stringify([
        'credits add {player} 10000'
      ]),
      sortOrder: 0,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log('✅ Products seeded successfully in Spanish');

  // 4. Create Coupons
  const couponsData = [
    {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minSpend: 0,
      maxUses: 1000,
      usesCount: 14,
      isActive: true,
    },
    {
      code: 'SOLAR50',
      discountType: 'PERCENTAGE',
      discountValue: 50,
      minSpend: 20,
      maxUses: 500,
      usesCount: 89,
      isActive: true,
    },
    {
      code: 'DISCORD5',
      discountType: 'FIXED',
      discountValue: 5,
      minSpend: 20,
      maxUses: 200,
      usesCount: 3,
      isActive: true,
    },
  ];

  for (const coup of couponsData) {
    await prisma.coupon.upsert({
      where: { code: coup.code },
      update: coup,
      create: coup,
    });
  }
  console.log('✅ Coupons seeded successfully');

  // 5. Store Settings with generic contact info
  const defaultNavLinks = JSON.stringify([
    { id: "1", label: "Inicio", url: "/", icon: "Home", isExternal: false },
    { id: "2", label: "Votos", url: "https://solarmc.net/vote", icon: "Vote", isExternal: true },
    { id: "3", label: "Wiki & Guías", url: "https://wiki.solarmc.net", icon: "BookOpen", isExternal: true },
    { id: "4", label: "Reglas", url: "/rules", icon: "Scale", isExternal: false },
    { id: "5", label: "Discord", url: "https://discord.gg/solarmc", icon: "MessageSquare", isExternal: true },
  ]);

  const defaultAnnouncements = JSON.stringify([
    "🔥 GRAN OFERTA SOLAR: ¡Usa el código WELCOME10 para un 10% de descuento en tu compra!",
    "⚡ ¡Reclama tu Rango Inicial GRATIS con baúles de jugador y kits de bienvenida!",
    "⭐ Apoya a tus creadores favoritos usando su Código de Partner al pagar en el carrito.",
    "🛡️ Entrega 100% inmediata y automatizada en el servidor al completar tu orden."
  ]);

  const settingsData = [
    { key: 'server_name', value: 'SolarMC' },
    { key: 'server_ip', value: 'play.solarmc.net' },
    { key: 'server_port', value: '25565' },
    { key: 'discord_url', value: 'https://discord.gg/solarmc' },
    { key: 'discord_online_count', value: '2611' },
    { key: 'server_online_count', value: '861' },
    { key: 'announcement_banner', value: '🔥 OFERTA SOLAR: ¡Usa el código WELCOME10 para 10% de descuento! ¡Reclama tu Rango Inicial Gratis hoy!' },
    { key: 'announcements', value: defaultAnnouncements },
    { key: 'nav_links', value: defaultNavLinks },
    { key: 'support_email', value: 'soporte@solarmc.net' },
    { key: 'currency_symbol', value: '$' },
    { key: 'company_name', value: 'SolarMC Network' },
    { key: 'company_associated', value: 'SolarMC Services LLC' },
    { key: 'hero_title', value: 'Reclama Tu Rango Gratis' },
    { key: 'hero_subtitle', value: 'Desbloquea ventajas increíbles en el juego al instante al reclamar tu rango' },
    { key: 'disclaimer_text_1', value: 'Los créditos solo son utilizables bajo los términos de descargo de responsabilidad de SolarMC. Los créditos son una moneda virtual intangible que no se puede transferir fuera de la red SolarMC.' },
    { key: 'disclaimer_text_2', value: 'Por favor asegúrate de estar bien informado de nuestras reglas, términos de servicio y política de privacidad antes de realizar cualquier compra en nuestra tienda. Todos los jugadores son juzgados por igual ante las reglas sin importar sus compras en la tienda.' },
    { key: 'disclaimer_text_3', value: 'Las compras no se pueden reembolsar bajo ninguna circunstancia. Abrir un contracargo o disputa resultará en un baneo automático y permanente de nuestra red de Minecraft, nuestra tienda Tebex y otras tiendas Tebex.' },
  ];

  for (const set of settingsData) {
    await prisma.storeSetting.upsert({
      where: { key: set.key },
      update: set,
      create: set,
    });
  }
  console.log('✅ Store Settings seeded for SolarMC with generic support email');

  // 6. CMS Pages in Spanish
  const pagesData = [
    {
      slug: 'terms',
      title: 'Términos & Condiciones de Venta',
      content: `# Términos de Servicio & Condiciones de Venta

**Última Actualización: Agosto 2026**

Bienvenido a la Tienda Oficial de **SolarMC**. Al usar nuestra tienda o adquirir cualquier bien digital, moneda virtual, rango o paquete, aceptas expresamente cumplir y regirte por los siguientes términos y condiciones.

---

### 1. Naturaleza de los Productos Virtuales
- Todos los productos vendidos en esta tienda son **bienes intangibles y virtuales**, destinados exclusivamente para su uso dentro de la red del servidor de Minecraft SolarMC.
- Las compras otorgan una licencia no exclusiva, revocable e intransferible para utilizar funciones específicas dentro del juego, rangos, cosméticos o artículos virtuales.
- Los créditos virtuales ("Créditos Solar") no tienen valor monetario fuera de la red y no se pueden canjear por dinero fiduciario, criptomonedas ni bienes del mundo real.

---

### 2. Política de Reembolsos y Disputas
> [!IMPORTANT]
> **Todas las ventas son estrictamente finales.** Debido a la entrega y consumo inmediato de los bienes digitales tras el pago, NO ofrecemos reembolsos ni cambios.

- Iniciar un contracargo, disputa de pago o reversión a través de tu banco, emisor de tarjeta, PayPal o procesador de pagos resultará en el **baneo inmediato y permanente** de tu cuenta de Minecraft, direcciones IP asociadas y bloqueo en toda la red de comercios Tebex.
- Si experimentas algún problema técnico con la entrega, contáctanos en **soporte@solarmc.net** o mediante nuestro Discord oficial antes de tomar medidas externas.

---

### 3. Reglas del Servidor y Conducta del Jugador
- Poseer un rango o artículo de pago **no** te exime de las reglas del servidor.
- Si eres sancionado o silenciado por infringir las normas comunitarias (como trampas, uso de bugs, acoso o toxicidad), no recibirás ningún reembolso ni transferencia de tus compras a otra cuenta.

---

### 4. Edad de Consentimiento
- Debes tener al menos 18 años, o contar con el permiso explícito de tus padres o tutor legal, para realizar compras en esta tienda. Las transacciones no autorizadas realizadas por menores de edad no serán reembolsadas.

---

### 5. Descargo de Responsabilidad y Afiliación
- SolarMC no está afiliado, respaldado ni asociado con Mojang Studios ni Microsoft. Minecraft es una marca registrada de Mojang Studios.
`,
    },
    {
      slug: 'privacy',
      title: 'Política de Privacidad',
      content: `# Política de Privacidad

**Fecha de Entrada en Vigor: Agosto 2026**

En **SolarMC**, valoramos tu privacidad y estamos comprometidos a proteger tu información personal. Esta política explica cómo recopilamos, almacenamos, usamos y protegemos tus datos al interactuar con nuestra tienda web.

---

### 1. Información que Recopilamos
Al utilizar nuestra tienda o autenticarte con nuestros servicios, podemos recopilar:
- **Identidad en Minecraft**: Tu nombre de usuario (IGN), UUID en el juego y edición (Java o Bedrock).
- **Datos de Autenticación**: Al iniciar sesión mediante Discord o Google OAuth, recibimos tu avatar público, nombre de pantalla y correo electrónico verificado.
- **Detalles de la Transacción**: Dirección IP, país de facturación, artículos comprados, fecha y hora, y montos totales. *Nota: Nunca almacenamos números de tarjetas de crédito sin procesar ni contraseñas bancarias.*
- **Registros Técnicos**: Tipo de navegador, sistema operativo y cookies de sesión.

---

### 2. Cómo Usamos tus Datos
- Para entregar automáticamente tus rangos, artículos y créditos comprados a tu cuenta en el juego.
- Para detectar y prevenir transacciones fraudulentas, contracargos y comportamientos abusivos.
- Para brindar soporte al cliente y notificarte sobre el estado de tus compras.
- Para mantener análisis estadísticos del servidor y optimizar la experiencia de compra.

---

### 3. Contacto
Para cualquier consulta sobre privacidad, escríbenos a **soporte@solarmc.net**.
`,
    },
    {
      slug: 'impressum',
      title: 'Aviso Legal (Impressum)',
      content: `# Aviso Legal (Impressum)

### Información de la Empresa
**Entidad**: SolarMC Services LLC  
**Red Asociada**: Servidor de Minecraft SolarMC  
**Correo de Contacto**: soporte@solarmc.net  
**Soporte Técnico**: Disponible 24/7 a través de [Discord](https://discord.gg/solarmc)  

---

### Revendedor Autorizado (Merchant of Record)
Este sitio web y su proceso de pago son operados por nuestro revendedor en línea oficial y Merchant of Record, **Tebex Limited**, quien se encarga de la facturación, impuestos, cumplimiento normativo y procesamiento de pagos.
`,
    },
    {
      slug: 'rules',
      title: 'Reglas del Servidor & Normas Comunitarias',
      content: `# Reglas del Servidor & Normas Comunitarias

Para garantizar un entorno justo, divertido y seguro para todos los jugadores en nuestra red, todos los usuarios deben cumplir con las siguientes normas:

---

### 1. Cero Tolerancia a Trampas y Hacks
- El uso de clientes hackeados, mods no autorizados, paquetes de x-ray, macros automatizadas o auto-clickers está estrictamente prohibido y conllevará un baneo permanente.

---

### 2. Comunicación Respetuosa
- Los comportamientos tóxicos, insultos racistas, incitación al odio, acoso grave o amenazas en la vida real resultarán en sanciones inmediatas.

---

### 3. Abuso de Bugs y Exploits
- Si encuentras un fallo de duplicación o un glitch en la economía, repórtalo de inmediato al equipo de moderación. El abuso de exploits resultará en el reseteo de la cuenta y baneo.
`,
    },
  ];

  for (const page of pagesData) {
    await prisma.contentPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }
  console.log('✅ CMS Pages seeded successfully in Spanish with generic email');

  console.log('🎉 SolarMC Database seeding completed with generic mock data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
