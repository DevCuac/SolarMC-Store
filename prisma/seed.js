const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SolarMC database seeding...');

  // 1. Create Admins & Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('player123', 10);

  // Seed User Admin: angelriveradeveloper@gmail.com
  const primaryAdmin = await prisma.user.upsert({
    where: { email: 'angelriveradeveloper@gmail.com' },
    update: {
      role: 'ADMIN',
    },
    create: {
      name: 'Angel Rivera',
      email: 'angelriveradeveloper@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
      minecraftUsername: 'cuac_xdpe',
      minecraftEdition: 'Java',
    },
  });

  const secondaryAdmin = await prisma.user.upsert({
    where: { email: 'admin@solarmc.net' },
    update: {
      role: 'ADMIN',
    },
    create: {
      name: 'SolarMC Admin',
      email: 'admin@solarmc.net',
      password: adminPassword,
      role: 'ADMIN',
      minecraftUsername: 'cuac_xdpe',
      minecraftEdition: 'Java',
    },
  });

  const demoPlayer = await prisma.user.upsert({
    where: { email: 'player@solarmc.net' },
    update: {},
    create: {
      name: 'Minecraft Player',
      email: 'player@solarmc.net',
      password: userPassword,
      role: 'USER',
      minecraftUsername: 'cuac_xdpe',
      minecraftEdition: 'Java',
    },
  });

  console.log('✅ Admin user created: angelriveradeveloper@gmail.com (ADMIN)');

  // 2. Create Categories (Using clean icon keys, NO EMOJIS)
  const categoriesData = [
    { name: 'Home', slug: 'home', icon: 'home', description: 'Featured bestsellers and popular server packages', sortOrder: 0 },
    { name: 'Prison', slug: 'prison', icon: 'prison', description: 'Ranks, pickaxes, multipliers and cell upgrades for OP Prison', sortOrder: 1 },
    { name: 'Universes', slug: 'universes', icon: 'universes', description: 'Cosmic passes, galaxy shards and solar dimension keys', sortOrder: 2 },
    { name: 'Dungeons', slug: 'dungeons', icon: 'dungeons', description: 'Boss keys, legendary armor sets and raid boosters', sortOrder: 3 },
    { name: 'Gens', slug: 'gens', icon: 'gens', description: 'Automated generators, sell wands and tycoon multipliers', sortOrder: 4 },
    { name: 'Survival', slug: 'survival', icon: 'survival', description: 'Survival ranks, claim blocks, pet eggs and fly perks', sortOrder: 5 },
    { name: 'Global', slug: 'global', icon: 'global', description: 'Global credits, solar cosmetics, chat tags and bundles', sortOrder: 6 },
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
  console.log('✅ Categories seeded with clean icon keys');

  // 3. Create Products
  const productsData = [
    {
      name: '4500 Solar Credits',
      slug: '4500-solar-credits',
      description: 'Our most popular credits bundle. Enhance your experience across all gamemodes.',
      price: 49.99,
      originalPrice: 59.99,
      badge: 'BEST SELLER',
      icon: 'coins',
      categoryId: categories['home'],
      perks: JSON.stringify([
        '4,500 Solar Store Credits delivered instantly',
        'Usable across Prison, Universes, Gens, Survival & Dungeons',
        'Unlocks +500 Bonus Solar Flare Loyalty Tokens in-game',
        'Exclusive Solar Chat Prefix [4.5k Supporter]'
      ]),
      commands: JSON.stringify([
        'credits add {player} 4500',
        'bc &6&lSOLAR STORE &8» &e{player} &7has purchased the &64500 Solar Credits &7bundle! &a/store'
      ]),
      sortOrder: 0,
    },
    {
      name: 'SolarMC Plus Pass',
      slug: 'solarmc-plus-pass',
      description: 'Get bonus Credits, loot boxes, crates, skin cases, and exclusive perks every month.',
      price: 24.99,
      originalPrice: null,
      badge: 'MONTHLY',
      icon: 'sparkles',
      categoryId: categories['home'],
      perks: JSON.stringify([
        '2,000 Monthly Solar Credits',
        '3x Monthly Legendary Solar Eclipse Loot Boxes',
        '5x Exclusive Custom Skin Cases',
        'Access to /fly in all Hub and Peaceful zones',
        '+25% In-Game Currency Booster on all realms'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent addplus',
        'credits add {player} 2000',
        'crate give {player} solar_legendary 3'
      ]),
      sortOrder: 1,
    },
    {
      name: 'Solar Overlord Rank',
      slug: 'solar-overlord-rank',
      description: 'The definitive Prison powerhouse rank. Dominate mines and unlock elite private vaults.',
      price: 79.99,
      originalPrice: 99.99,
      badge: 'POPULAR',
      icon: 'crown',
      categoryId: categories['prison'],
      perks: JSON.stringify([
        'Access to /kit overlord (P50 Armor, Efficiency 200 Pickaxe)',
        '10x Private Player Vaults (/pv 1-10)',
        '3.5x Mine Booster Multiplier',
        'Custom Overlord Rank prefix & glowing solar tag',
        'Keep inventory upon death in PvP mines'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent add overlord',
        'broadcast &6&lRANK &8» &f{player} &7is now an &6&lOVERLORD&7!'
      ]),
      sortOrder: 0,
    },
    {
      name: 'Titan Rank',
      slug: 'titan-rank',
      description: 'Superior prison status with auto-sell privileges and expanded backpack storage.',
      price: 44.99,
      originalPrice: 59.99,
      badge: 'SALE -20%',
      icon: 'shield',
      categoryId: categories['prison'],
      perks: JSON.stringify([
        'Access to /kit titan (P35 Armor & Speed Buff)',
        '6x Private Player Vaults',
        '2.5x Multiplier for all block sales',
        'Auto-sell wand with unlimited charges'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent add titan'
      ]),
      sortOrder: 1,
    },
    {
      name: 'Solar God Rank',
      slug: 'solar-god-rank',
      description: 'Harness the cosmic energy of the solar eclipse across infinite dimensions with god-tier abilities.',
      price: 119.99,
      originalPrice: 149.99,
      badge: 'ULTIMATE',
      icon: 'flame',
      categoryId: categories['universes'],
      perks: JSON.stringify([
        'Solar God Kit with custom radiant enchantments',
        'Instant dimension warp without cooldown',
        'Immunity to radiation & void damage',
        '15x Solar Shard Generation Speed',
        'Custom Solar Flare particle effects'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent add solargod',
        'shards give {player} 50000'
      ]),
      sortOrder: 0,
    },
    {
      name: 'Dungeon Master Pass',
      slug: 'dungeon-master-pass',
      description: 'Unlimited raid entries, double boss drops and exclusive mythical relics.',
      price: 19.99,
      originalPrice: 29.99,
      badge: 'SEASON PASS',
      icon: 'swords',
      categoryId: categories['dungeons'],
      perks: JSON.stringify([
        'Unlimited daily Dungeon entries without keys',
        '2x Mythic Loot drop chance from Raid Bosses',
        'Exclusive [Dungeon Master] title',
        'Instant revive token per match'
      ]),
      commands: JSON.stringify([
        'dungeons pass grant {player} master'
      ]),
      sortOrder: 0,
    },
    {
      name: 'Auto-Miner Gen Pack',
      slug: 'auto-miner-gen-pack',
      description: '10x Automated Netherite & Emerald Generators that work while you sleep.',
      price: 29.99,
      originalPrice: 39.99,
      badge: 'OP BOOST',
      icon: 'package',
      categoryId: categories['gens'],
      perks: JSON.stringify([
        '5x Tier V Netherite Automated Gens',
        '5x Tier V Emerald Automated Gens',
        '1x Unlimited Vacuum Hopper',
        '2x Generator Speed Booster (Permanent)'
      ]),
      commands: JSON.stringify([
        'gens give {player} netherite_5 5',
        'gens give {player} emerald_5 5'
      ]),
      sortOrder: 0,
    },
    {
      name: 'VIP Survival Rank',
      slug: 'vip-survival-rank',
      description: 'Essential perks for peaceful builders, land claims and flight access.',
      price: 9.99,
      originalPrice: 14.99,
      badge: 'BEST VALUE',
      icon: 'star',
      categoryId: categories['survival'],
      perks: JSON.stringify([
        '/fly command enabled in all survival zones',
        '+5,000 Bonus Claim Blocks',
        '4x /sethome locations',
        'Access to /hat and /workbench'
      ]),
      commands: JSON.stringify([
        'lp user {player} parent add vip'
      ]),
      sortOrder: 0,
    },
    {
      name: '10,000 Solar Credits Bundle',
      slug: '10000-solar-credits-bundle',
      description: 'The mega credits vault for serious server commanders.',
      price: 99.99,
      originalPrice: 129.99,
      badge: 'MEGA DEAL',
      icon: 'coins',
      categoryId: categories['global'],
      perks: JSON.stringify([
        '10,000 Global Credits across all realms',
        'Free Mythic Solar Pet of your choice',
        'Animated [SOLAR LEGEND] chat badge',
        'Access to VIP Discord lounge'
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
  console.log('✅ Products seeded successfully');

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

  // 5. Store Settings for SolarMC
  const settingsData = [
    { key: 'server_name', value: 'SolarMC' },
    { key: 'server_ip', value: 'play.solarmc.net' },
    { key: 'server_port', value: '25565' },
    { key: 'discord_url', value: 'https://discord.gg/solarmc' },
    { key: 'discord_online_count', value: '2611' },
    { key: 'server_online_count', value: '861' },
    { key: 'announcement_banner', value: '🔥 SOLAR SALE: Use code WELCOME10 for 10% OFF! Claim your Free Starter Rank today!' },
    { key: 'support_email', value: 'angelriveradeveloper@gmail.com' },
    { key: 'currency_symbol', value: '$' },
    { key: 'company_name', value: 'SolarMC Network' },
    { key: 'company_associated', value: 'SolarMC Services LLC' },
    { key: 'hero_title', value: 'Claim Your Free Rank' },
    { key: 'hero_subtitle', value: 'Unlock awesome perks instantly when you claim your rank' },
    { key: 'disclaimer_text_1', value: 'Credits are only usable under the terms of the SolarMC Credits Disclaimers. Credits are a virtual intangible currency which cannot be transferred outside of the SolarMC Network. Credits do not represent a property interest of any kind and cannot be cashed out or used outside of SolarMC services.' },
    { key: 'disclaimer_text_2', value: 'Please make sure you are well informed of our rules, terms of service, and privacy policy before making any purchase on our web store. All players are judged against the rules equally no matter their store purchases.' },
    { key: 'disclaimer_text_3', value: 'Purchases cannot be refunded under any circumstance. Opening a chargeback or dispute will result in an automatic and permanent ban from our Minecraft Network, our Tebex Store and other Tebex Stores.' },
  ];

  for (const set of settingsData) {
    await prisma.storeSetting.upsert({
      where: { key: set.key },
      update: set,
      create: set,
    });
  }
  console.log('✅ Store Settings seeded for SolarMC');

  // 6. CMS Pages
  const pagesData = [
    {
      slug: 'terms',
      title: 'Terms & Conditions',
      content: `# Terms of Service & Conditions of Sale

**Last Updated: August 2026**

Welcome to **SolarMC** Webstore. By using our store or purchasing any digital goods, virtual currency, ranks, or items, you explicitly agree to comply with and be bound by the following terms and conditions.

---

### 1. Nature of Virtual Products
- All products sold on this store are **intangible, virtual goods** meant exclusively for use within the SolarMC Minecraft Server network.
- Purchases grant a non-exclusive, revocable, and non-transferable license to use specific in-game features, ranks, cosmetics, or virtual items.
- Virtual credits ("Solar Credits") do not have monetary value outside the network and cannot be redeemed for fiat currency, cryptocurrencies, or real-world goods.

---

### 2. Refund & Dispute Policy
> [!IMPORTANT]
> **All sales are strictly final.** Due to the immediate delivery and consumption of digital goods upon payment, we do NOT offer refunds or exchanges.

- Initiating a chargeback, payment dispute, or payment reversal via your bank, credit card issuer, PayPal, or payment processor will result in an **immediate and permanent ban** of your Minecraft account, associated IP addresses, and blacklisting across the entire Tebex merchant network.
- If you experience technical delivery issues, please contact our support team at **angelriveradeveloper@gmail.com** or via our official Discord before taking any external action.

---

### 3. Server Rules & Player Conduct
- Having a paid rank or item does **not** make you exempt from server rules.
- If you are banned or muted for violating community guidelines (e.g. cheating, exploiting bugs, harassment, hate speech, or advertising), you will not receive a refund or transfer of your purchases to another account.

---

### 4. Age of Consent
- You must be at least 18 years old, or have express permission from a parent or legal guardian, to make a purchase on this store. Unauthorized transactions made by minors will not be refunded.

---

### 5. Disclaimer & Affiliation
- SolarMC is not affiliated with, endorsed by, or associated with Mojang Studios or Microsoft. Minecraft is a registered trademark of Mojang Studios.
`,
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      content: `# Privacy Policy

**Effective Date: August 2026**

At **SolarMC**, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, store, use, and safeguard your data when you visit or interact with our webstore.

---

### 1. Information We Collect
When you use our store or authenticate with our services, we may collect:
- **Minecraft Identity**: Your Minecraft username, in-game UUID, and edition (Java or Bedrock).
- **Authentication Data**: When logging in via Discord or Google OAuth, we receive your public avatar, display name, and verified email address.
- **Transaction Details**: IP address, billing country/postal code, purchased items, timestamp, and order totals. *Note: We never store your raw credit card numbers or banking passwords.*
- **Technical Logs**: Browser type, operating system, device headers, and cookie identifiers.

---

### 2. How We Use Your Data
- To automatically deliver your purchased ranks, items, and credits to your in-game player profile.
- To detect and prevent fraudulent transactions, chargebacks, and abusive behavior.
- To provide customer support and notify you of order statuses.
- To maintain server analytics and improve user store experience.

---

### 3. Contact Us
For any privacy inquiries, email us at **angelriveradeveloper@gmail.com**.
`,
    },
    {
      slug: 'impressum',
      title: 'Impressum / Legal Notice',
      content: `# Impressum / Legal Notice

### Company Information
**Entity**: SolarMC Services LLC  
**Associated Network**: SolarMC Minecraft Network  
**Email**: angelriveradeveloper@gmail.com  
**Support Desk**: Available 24/7 via [Discord](https://discord.gg/solarmc)  

---

### Merchant of Record
This website and its checkout process is operated by our online reseller and Merchant of Record, **Tebex Limited**, which handles billing, taxation, compliance, and payment settlement.
`,
    },
    {
      slug: 'rules',
      title: 'Server Rules & Conduct',
      content: `# Server Rules & Community Guidelines

To ensure a fair, enjoyable, and safe environment for all players across our network, all users must adhere to the following rules:

---

### 1. No Cheating or Unfair Advantages
- Using hacked clients, unauthorized mods, x-ray packs, macro scripts, or auto-clickers is strictly prohibited.

---

### 2. Respectful Communication
- Toxic behavior, racial slurs, hate speech, severe harassment, or real-life threats will result in an immediate ban.

---

### 3. Bug Abuse & Exploits
- If you find a dupe or economy glitch, report it immediately to staff.
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
  console.log('✅ CMS Pages seeded successfully for SolarMC');

  console.log('🎉 SolarMC Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
