import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('--- SEEDING STROKE & SOUL DATABASE ---');

  // 1. Admin User
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@strokeandsoul.art';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AdminArtStudio2026!';
  const adminName = process.env.ADMIN_INITIAL_NAME || 'Alex Morgan';

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: adminName,
        role: 'admin',
      },
    });
    console.log(`✓ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ Admin user already exists: ${adminEmail}`);
  }

  // 2. Website Settings
  const existingSettings = await prisma.websiteSetting.findFirst();
  if (!existingSettings) {
    await prisma.websiteSetting.create({
      data: {
        studioName: 'STROKE & SOUL',
        artistName: 'Alex Morgan',
        tagline: 'Every Line Tells a Story.',
        announcementText: 'Custom Handcrafted Portraits – Made With Passion',
        announcementBg: '#292722',
        announcementTextColor: '#F7F3EB',
        announcementVisible: true,
        logoText: 'STROKE & SOUL',
        logoImageUrl: '',
        faviconUrl: '/favicon.svg',
        heroHeading: 'Turning Your Precious Moments Into Timeless Art.',
        heroSubheading:
          'Handcrafted pencil portraits and personalized sketches, created with passion, precision, and attention to every detail.',
        heroPrimaryCtaText: 'Explore Our Artwork',
        heroPrimaryCtaLink: '#gallery',
        heroSecondaryCtaText: 'Order Your Custom Sketch',
        heroSecondaryCtaLink: '/order',
        heroImageUrl:
          'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85',
        aboutHeading: 'The Artist Behind Every Stroke',
        aboutSubheading: 'Fine art with soul, passion, and over a decade of graphite mastery.',
        aboutStory:
          'Stroke & Soul was founded with a singular conviction: that a hand-drawn pencil portrait possesses an emotional resonance photographs cannot match. Through nuanced gradients, sharp cross-hatching, and deep velvety charcoals, each drawing captures not merely a likeness, but the very essence and warmth of your cherished moments.',
        aboutExperience:
          'With over 12 years of specialized graphite and charcoal portraiture, Alex Morgan has created more than 900 commissioned pieces for collectors and families across 24 countries.',
        aboutSpecialization:
          'Hyper-realistic graphite portraiture, fine expressive charcoal, delicate textural hair and fabric rendering, and legacy family portraits.',
        aboutPhilosophy:
          'Every pencil stroke is deliberate. True art cannot be rushed; it is an intimate conversation between the artist’s eye, the graphite medium, and the subject’s soul.',
        aboutYearsExperience: 12,
        aboutPersonalMessage:
          '“When you commission a sketch with me, you are trusting me with your memories. I treat every single portrait as an heirloom intended to grace your home for generations.” — Alex Morgan',
        aboutImageUrl:
          'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        howItWorksHeading: 'How It Works',
        howItWorksSubheading: 'A four-step collaborative journey from photograph to finished fine art.',
        pricingHeading: 'Custom Sketch Pricing & Size Guide',
        pricingSubheading: 'Transparent starting rates tailored to your choice of scale and detail.',
        pricingNote:
          'Final pricing may vary depending on complexity, number of subjects, and additional customization.',
        faqHeading: 'Frequently Asked Questions',
        faqSubheading: 'Everything you need to know about commissioning your custom sketch.',
        ctaHeading: 'Have a Special Moment Worth Turning Into Art?',
        ctaDescription:
          'Let us transform your favorite photograph into a beautiful handcrafted sketch that you will cherish forever.',
        ctaButtonText: 'Request Your Custom Sketch',
        ctaButtonLink: '/order',
        contactEmail: 'hello@strokeandsoul.art',
        contactPhone: '+1 (555) 234-5678',
        whatsappNumber: '+15552345678',
        businessAddress: 'Studio 4B, Artisan Quarter, New York, NY 10012',
        instagramUrl: 'https://instagram.com/strokeandsoul',
        pinterestUrl: 'https://pinterest.com/strokeandsoul',
        facebookUrl: 'https://facebook.com/strokeandsoul',
        currency: 'USD',
        currencySymbol: '$',
        defaultCountry: 'United States',
        timezone: 'America/New_York',
        seoTitle: 'STROKE & SOUL | Handcrafted Custom Pencil Portraits',
        seoDescription:
          'Commission handcrafted realistic pencil portrait sketches from master artist Alex Morgan. Museum-grade portraits for gifts, anniversaries, and family heirlooms.',
        maintenanceMode: false,
        navItems: JSON.stringify([
          { label: 'Home', href: '/' },
          { label: 'Gallery', href: '/#gallery' },
          { label: 'About the Artist', href: '/#about' },
          { label: 'Services', href: '/#services' },
          { label: 'How It Works', href: '/#how-it-works' },
          { label: 'Reviews', href: '/#reviews' },
          { label: 'Pricing Guide', href: '/#pricing' },
          { label: 'FAQ', href: '/#faq' },
          { label: 'Contact', href: '/#contact' },
        ]),
      },
    });
    console.log('✓ Website settings seeded');
  }

  // 3. Page Sections
  const defaultSections = [
    { sectionKey: 'announcement', title: 'Announcement Bar', isVisible: true, displayOrder: 1 },
    { sectionKey: 'hero', title: 'Hero Section', isVisible: true, displayOrder: 2 },
    { sectionKey: 'about', title: 'About the Artist', isVisible: true, displayOrder: 3 },
    { sectionKey: 'services', title: 'Commission Services', isVisible: true, displayOrder: 4 },
    { sectionKey: 'gallery', title: 'Artwork Gallery', isVisible: true, displayOrder: 5 },
    { sectionKey: 'how_it_works', title: 'How It Works', isVisible: true, displayOrder: 6 },
    { sectionKey: 'reviews', title: 'Testimonials & Reviews', isVisible: true, displayOrder: 7 },
    { sectionKey: 'pricing', title: 'Pricing & Size Guide', isVisible: true, displayOrder: 8 },
    { sectionKey: 'faq', title: 'Frequently Asked Questions', isVisible: true, displayOrder: 9 },
    { sectionKey: 'cta', title: 'Final Call to Action', isVisible: true, displayOrder: 10 },
    { sectionKey: 'footer', title: 'Footer & Studio Information', isVisible: true, displayOrder: 11 },
  ];

  for (const s of defaultSections) {
    await prisma.pageSection.upsert({
      where: { sectionKey: s.sectionKey },
      update: {},
      create: s,
    });
  }
  console.log('✓ Page sections registered');

  // 4. Services (6 Required)
  const defaultServices = [
    {
      title: 'Single Portrait Sketch',
      slug: 'single-portrait',
      description:
        'A deeply expressive solo portrait capturing intricate facial features, luminous eyes, and emotional depth with masterful graphite shading.',
      imageUrl:
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      startingPrice: 120.0,
      availableSizes: JSON.stringify(['A5', 'A4', 'A3', 'A2']),
      estimatedTime: '3 - 5 Business Days',
      isActive: true,
      displayOrder: 1,
    },
    {
      title: 'Couple Portrait Sketch',
      slug: 'couple-portrait',
      description:
        'A romantic and heartfelt duo portrait, ideal for weddings, anniversaries, and engagements. Balanced lighting and natural connection rendered with grace.',
      imageUrl:
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
      startingPrice: 190.0,
      availableSizes: JSON.stringify(['A4', 'A3', 'A2']),
      estimatedTime: '5 - 7 Business Days',
      isActive: true,
      displayOrder: 2,
    },
    {
      title: 'Family Portrait Sketch',
      slug: 'family-portrait',
      description:
        'A multi-subject legacy portrait bringing parents, children, or generations together in a harmonious composition drawn on museum-grade cotton archival paper.',
      imageUrl:
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
      startingPrice: 280.0,
      availableSizes: JSON.stringify(['A3', 'A2', 'Custom Size']),
      estimatedTime: '7 - 10 Business Days',
      isActive: true,
      displayOrder: 3,
    },
    {
      title: 'Pet Portrait Sketch',
      slug: 'pet-portrait',
      description:
        'Honor your beloved dog, cat, or companion animal with hyper-detailed fur textures, alert expressions, and warm lifelike eyes.',
      imageUrl:
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      startingPrice: 110.0,
      availableSizes: JSON.stringify(['A5', 'A4', 'A3']),
      estimatedTime: '4 - 6 Business Days',
      isActive: true,
      displayOrder: 4,
    },
    {
      title: 'Custom Artwork',
      slug: 'custom-artwork',
      description:
        'Bespoke creative concepts, architectural sketches, vintage vehicles, commemorative scenes, or merged multiple photos into one singular artistic piece.',
      imageUrl:
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      startingPrice: 220.0,
      availableSizes: JSON.stringify(['A4', 'A3', 'A2', 'Custom Size']),
      estimatedTime: '6 - 9 Business Days',
      isActive: true,
      displayOrder: 5,
    },
    {
      title: 'Gift Portrait Sketch',
      slug: 'gift-portrait',
      description:
        'Designed specifically for birthdays, retirements, and holidays. Includes luxury wax-sealed presentation packaging and a handwritten calligraphy certificate.',
      imageUrl:
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      startingPrice: 150.0,
      availableSizes: JSON.stringify(['A5', 'A4', 'A3']),
      estimatedTime: '4 - 6 Business Days',
      isActive: true,
      displayOrder: 6,
    },
  ];

  for (const s of defaultServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }
  console.log('✓ 6 Services seeded');

  // 5. Pricing Guide & Rules
  const existingPricing = await prisma.servicePricing.count();
  if (existingPricing === 0) {
    const pricingRules = [
      {
        sketchType: 'All Types',
        paperSize: 'A5',
        dimensions: '5.8 x 8.3 in (148 x 210 mm)',
        basePrice: 110.0,
        maxDefaultSubjects: 1,
        extraSubjectPrice: 30.0,
        framingPrice: 30.0,
        giftPackagingPrice: 15.0,
        estimatedDays: '3 - 5 Days',
        isActive: true,
        displayOrder: 1,
      },
      {
        sketchType: 'All Types',
        paperSize: 'A4',
        dimensions: '8.3 x 11.7 in (210 x 297 mm)',
        basePrice: 160.0,
        maxDefaultSubjects: 1,
        extraSubjectPrice: 40.0,
        framingPrice: 45.0,
        giftPackagingPrice: 15.0,
        estimatedDays: '4 - 6 Days',
        isActive: true,
        displayOrder: 2,
      },
      {
        sketchType: 'All Types',
        paperSize: 'A3',
        dimensions: '11.7 x 16.5 in (297 x 420 mm)',
        basePrice: 240.0,
        maxDefaultSubjects: 2,
        extraSubjectPrice: 50.0,
        framingPrice: 65.0,
        giftPackagingPrice: 20.0,
        estimatedDays: '5 - 8 Days',
        isActive: true,
        displayOrder: 3,
      },
      {
        sketchType: 'All Types',
        paperSize: 'A2',
        dimensions: '16.5 x 23.4 in (420 x 594 mm)',
        basePrice: 360.0,
        maxDefaultSubjects: 3,
        extraSubjectPrice: 65.0,
        framingPrice: 95.0,
        giftPackagingPrice: 25.0,
        estimatedDays: '8 - 12 Days',
        isActive: true,
        displayOrder: 4,
      },
    ];

    for (const rule of pricingRules) {
      await prisma.servicePricing.create({ data: rule });
    }
    console.log('✓ Pricing rules seeded');
  }

  // 6. Gallery Categories
  const categories = [
    { name: 'Single Portraits', slug: 'single-portraits', displayOrder: 1 },
    { name: 'Couple Portraits', slug: 'couple-portraits', displayOrder: 2 },
    { name: 'Family Sketches', slug: 'family-sketches', displayOrder: 3 },
    { name: 'Pet Sketches', slug: 'pet-sketches', displayOrder: 4 },
    { name: 'Custom Fine Art', slug: 'custom-art', displayOrder: 5 },
  ];

  const catMap: Record<string, number> = {};
  for (const c of categories) {
    const cat = await prisma.galleryCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    catMap[c.slug] = cat.id;
  }
  console.log('✓ Gallery categories seeded');

  // 7. Gallery Artworks (8 Realistic Sample Pencil Artworks)
  const existingArtworks = await prisma.galleryImage.count();
  if (existingArtworks === 0) {
    const artworks = [
      {
        title: 'Lillian in Contemplation',
        description: 'Tonal graphite study emphasizing subtle facial shadows, skin softness, and atmospheric light.',
        categoryId: catMap['single-portraits'],
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        tags: 'graphite, portrait, female, realism',
        isFeatured: true,
        isActive: true,
        displayOrder: 1,
      },
      {
        title: 'Golden Jubilee Vows',
        description: 'Commissioned 50th wedding anniversary portrait capturing warmth, gentle smiles, and subtle fine lines.',
        categoryId: catMap['couple-portraits'],
        imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=600&q=80',
        tags: 'couple, anniversary, charcoal, love',
        isFeatured: true,
        isActive: true,
        displayOrder: 2,
      },
      {
        title: 'Generations: The Sterling Family',
        description: 'Grandparents, parents, and grandchild rendered on 300gsm Arches hot-pressed cotton paper.',
        categoryId: catMap['family-sketches'],
        imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=600&q=80',
        tags: 'family, heirloom, generational, archival',
        isFeatured: true,
        isActive: true,
        displayOrder: 3,
      },
      {
        title: 'Barnaby the Golden Retriever',
        description: 'Hyper-detailed fur texture and radiant gaze rendered with 2B through 8B graphite pencils.',
        categoryId: catMap['pet-sketches'],
        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
        tags: 'dog, retriever, pet portrait, animal art',
        isFeatured: true,
        isActive: true,
        displayOrder: 4,
      },
      {
        title: 'Whispers of Venetian Stone',
        description: 'Architectural graphite drawing of Romanesque arches and reflective canals.',
        categoryId: catMap['custom-art'],
        imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
        beforeImageUrl: '',
        tags: 'architecture, custom, scenery, graphite',
        isFeatured: false,
        isActive: true,
        displayOrder: 5,
      },
      {
        title: 'Elder Wisdom & Grace',
        description: 'Character portrait exploring high-contrast rim lighting and dramatic graphite depth.',
        categoryId: catMap['single-portraits'],
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        tags: 'character, male portrait, high contrast',
        isFeatured: true,
        isActive: true,
        displayOrder: 6,
      },
      {
        title: 'Luna: Siamese Cat Stare',
        description: 'Fine graphite needle strokes rendering delicate whiskers, ear tufts, and glass-like eyes.',
        categoryId: catMap['pet-sketches'],
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
        beforeImageUrl: '',
        tags: 'cat, pet, feline, realistic whiskers',
        isFeatured: false,
        isActive: true,
        displayOrder: 7,
      },
      {
        title: 'First Embrace at Sunset',
        description: 'Wedding ceremony portrait capturing the gentle flutter of the veil in charcoal and white gouache.',
        categoryId: catMap['couple-portraits'],
        imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        beforeImageUrl: '',
        tags: 'wedding, bride, groom, romantic',
        isFeatured: true,
        isActive: true,
        displayOrder: 8,
      },
    ];

    for (const art of artworks) {
      await prisma.galleryImage.create({ data: art });
    }
    console.log('✓ 8 Gallery artworks seeded');
  }

  // 8. Testimonials (4 Sample Demonstration Reviews)
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    const sampleReviews = [
      {
        customerName: 'Eleanor Vance',
        location: 'Boston, MA',
        reviewText:
          'The portrait was absolutely beautiful. Every little detail was captured perfectly—from the subtle glint in my father’s eye to the gentle texture of his collar. It brought tears to our entire family on his 70th birthday.',
        rating: 5,
        customerImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        sketchType: 'Single Portrait (A3)',
        dateString: 'October 2026',
        isFeatured: true,
        isVisible: true,
        isDemo: true,
        displayOrder: 1,
      },
      {
        customerName: 'Marcus & Clara Thorne',
        location: 'Seattle, WA',
        reviewText:
          'An amazing experience. The sketch made a perfect anniversary gift. Alex communicated with us at every stage and made sure the composition was exactly what we envisioned. Truly museum quality.',
        rating: 5,
        customerImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        sketchType: 'Couple Portrait (A3 Framed)',
        dateString: 'September 2026',
        isFeatured: true,
        isVisible: true,
        isDemo: true,
        displayOrder: 2,
      },
      {
        customerName: 'Dr. Julian Mercer',
        location: 'London, UK',
        reviewText:
          'Professional work, excellent detailing, and beautiful packaging. Our dog Winston passed away last winter; having this artwork hanging in our study feels like he is still sitting right beside us.',
        rating: 5,
        customerImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        sketchType: 'Pet Portrait (A4)',
        dateString: 'August 2026',
        isFeatured: true,
        isVisible: true,
        isDemo: true,
        displayOrder: 3,
      },
      {
        customerName: 'Sophia Lin-Ramirez',
        location: 'San Francisco, CA',
        reviewText:
          'I commissioned a three-generation family sketch from older, separate photographs. Alex merged them seamlessly into one stunning timeless scene. Worth every single penny.',
        rating: 5,
        customerImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        sketchType: 'Family Legacy (A2)',
        dateString: 'November 2026',
        isFeatured: true,
        isVisible: true,
        isDemo: true,
        displayOrder: 4,
      },
    ];

    for (const rev of sampleReviews) {
      await prisma.testimonial.create({ data: rev });
    }
    console.log('✓ 4 Testimonials seeded (clearly marked as demonstration content)');
  }

  // 9. FAQs (6 Required + 2 Extra)
  const existingFaqs = await prisma.faq.count();
  if (existingFaqs === 0) {
    const faqs = [
      {
        question: 'How do I order a custom sketch?',
        answer:
          'Ordering is simple and straightforward. Visit our Order page, choose your preferred portrait type and paper size, upload your reference photograph(s), and submit your enquiry. The artist will personally review your photo, confirm details, and provide a formal confirmation before starting.',
        category: 'Ordering',
        isVisible: true,
        displayOrder: 1,
      },
      {
        question: 'What kind of photograph should I provide?',
        answer:
          'Clear, well-lit, high-resolution photographs yield the best sketches. Natural lighting where facial features, eye details, and expressions are sharp is ideal. If you only have older or lower-resolution photos, you can still submit them and Alex will review whether they can be artistically enhanced.',
        category: 'Photographs',
        isVisible: true,
        displayOrder: 2,
      },
      {
        question: 'How long does a sketch take to complete?',
        answer:
          'Standard turnaround is between 3 to 7 business days depending on size and complexity (A5/A4 typically 3–5 days; larger A3/A2 or family pieces take 7–10 days). Priority rush options are available upon request.',
        category: 'Turnaround',
        isVisible: true,
        displayOrder: 3,
      },
      {
        question: 'Can I request multiple people from separate photos in one sketch?',
        answer:
          'Yes! We frequently merge individual photographs of loved ones into a unified, balanced family portrait. Just upload each photo with your enquiry and mention your request in the notes.',
        category: 'Customization',
        isVisible: true,
        displayOrder: 4,
      },
      {
        question: 'Do you offer framed sketches?',
        answer:
          'Yes. We offer custom museum-quality solid wood frames with acid-free mats and anti-reflective UV-protective acrylic glazing. You can select framing options directly on the order form.',
        category: 'Framing',
        isVisible: true,
        displayOrder: 5,
      },
      {
        question: 'Can I request changes or see a preview before shipping?',
        answer:
          'Absolutely. Before any artwork is sealed or shipped, we email you a high-resolution digital proof for review. Minor adjustments to tonal balance or fine details are happily accommodated to ensure complete delight.',
        category: 'Process',
        isVisible: true,
        displayOrder: 6,
      },
      {
        question: 'How is the artwork packaged and delivered?',
        answer:
          'Unframed artworks are carefully interleaved in glassine paper, enveloped in waterproof protective sleeves, and shipped flat inside rigid reinforced mailers. Framed art is custom-cushioned in eco-friendly protective casing with insured courier tracking.',
        category: 'Shipping',
        isVisible: true,
        displayOrder: 7,
      },
      {
        question: 'How can I make payment?',
        answer:
          'Once your reference photo and specifications are reviewed, you will receive an official invoice with secure payment links supporting all major Credit/Debit Cards, Wire Transfers, and Apple Pay. A 50% deposit begins the commission, and the remainder is due upon digital proof approval.',
        category: 'Payment',
        isVisible: true,
        displayOrder: 8,
      },
    ];

    for (const f of faqs) {
      await prisma.faq.create({ data: f });
    }
    console.log('✓ FAQs seeded');
  }

  // 10. Sample Enquiry (so admin dashboard has immediate data to preview)
  const existingEnquiry = await prisma.enquiry.count();
  if (existingEnquiry === 0) {
    const demoEnquiry = await prisma.enquiry.create({
      data: {
        referenceNumber: 'SNS-2026-DEMO1',
        fullName: 'Claire Beaumont',
        email: 'claire.beaumont@example.com',
        phone: '+1 (555) 789-0123',
        country: 'United States',
        city: 'Chicago',
        sketchType: 'Couple Portrait',
        sketchSize: 'A3',
        subjectsCount: 2,
        orientation: 'Portrait',
        paperType: 'Heavyweight Acid-Free Bristol',
        framing: 'With Frame',
        specialInstructions: 'This is our 10th anniversary gift. Please accentuate the warm sunlight across the cheekbones.',
        preferredDeliveryDate: '2026-12-15',
        giftPackaging: true,
        additionalRequests: 'Include calligraphy gift note: "To another ten years of adventures."',
        estimatedPrice: 355.0,
        quotedPrice: 355.0,
        currency: 'USD',
        status: 'In Progress',
        adminNotes: 'High-res reference photo received. Initial graphite block-in complete.',
        estimatedCompletionDate: '2026-12-05',
        attachments: {
          create: [
            {
              filename: 'demo-couple-reference.jpg',
              originalName: 'wedding-anniversary-ref.jpg',
              mimeType: 'image/jpeg',
              fileSize: 1420000,
              fileUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
            },
          ],
        },
        notes: {
          create: [
            {
              authorName: 'Alex Morgan',
              noteText: 'Customer requested soft vintage vignetting around the border.',
              isCustomerVisible: false,
            },
          ],
        },
        statusHistory: {
          create: [
            {
              previousStatus: 'New',
              newStatus: 'Under Review',
              changeReason: 'Reviewing submitted reference photograph clarity',
              updatedBy: 'Alex Morgan',
            },
            {
              previousStatus: 'Under Review',
              newStatus: 'In Progress',
              changeReason: 'Specifications approved and deposit confirmed',
              updatedBy: 'Alex Morgan',
            },
          ],
        },
      },
    });
    console.log(`✓ Sample enquiry created: ${demoEnquiry.referenceNumber}`);
  }

  console.log('--- DATABASE SEEDING COMPLETED SUCCESSFULLY ---');
}

// Allow direct execution
if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase()
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
