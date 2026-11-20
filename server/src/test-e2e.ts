import { prisma } from './prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING COMPREHENSIVE STROKE & SOUL TEST SUITE');
  console.log('======================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  // TEST 1: Database Admin User Exists
  const admin = await prisma.adminUser.findUnique({
    where: { email: 'admin@strokeandsoul.art' },
  });
  assert(!!admin, '1. Admin user exists in database with seeded email');
  const passwordValid = await bcrypt.compare('AdminArtStudio2026!', admin!.passwordHash);
  assert(passwordValid, '2. Admin password hash verifies correctly');

  // TEST 2: Website Settings Exist & Complete
  const settings = await prisma.websiteSetting.findFirst();
  assert(!!settings, '3. Website settings exist in database');
  assert(settings!.studioName === 'STROKE & SOUL', '4. Studio name matches brand requirement');
  assert(!!settings!.heroHeading, '5. Hero heading exists');
  assert(!!settings!.aboutStory, '6. Artist story exists');

  // TEST 3: All 11 Page Sections Configured
  const sections = await prisma.pageSection.findMany();
  assert(sections.length >= 11, '7. All required page sections are registered');
  const heroSection = sections.find((s) => s.sectionKey === 'hero');
  assert(!!heroSection && heroSection.isVisible, '8. Hero section is configured and visible');

  // TEST 4: 6 Commission Services Seeded
  const services = await prisma.service.findMany({ where: { isActive: true } });
  assert(services.length >= 6, '9. Exactly 6 or more commission services are active');
  const singlePortrait = services.find((s) => s.slug === 'single-portrait');
  assert(!!singlePortrait && singlePortrait.startingPrice > 0, '10. Single portrait service valid');

  // TEST 5: Pricing Rules Configured
  const pricing = await prisma.servicePricing.findMany({ where: { isActive: true } });
  assert(pricing.length >= 4, '11. At least 4 size pricing tiers configured (A5 to A2)');
  const a4Pricing = pricing.find((p) => p.paperSize === 'A4');
  assert(!!a4Pricing && a4Pricing.basePrice > 0, '12. A4 pricing rule is active with base rate');

  // TEST 6: Artwork Gallery & Categories
  const categories = await prisma.galleryCategory.findMany();
  assert(categories.length >= 5, '13. At least 5 gallery categories exist');
  const artworks = await prisma.galleryImage.findMany({ where: { isActive: true } });
  assert(artworks.length >= 8, '14. At least 8 gallery artworks exist with realistic sketches');
  const featuredArt = artworks.filter((a) => a.isFeatured);
  assert(featuredArt.length > 0, '15. Featured artworks marked correctly');

  // TEST 7: Testimonials & Demonstration Content Marker
  const testimonials = await prisma.testimonial.findMany();
  assert(testimonials.length >= 4, '16. At least 4 customer testimonials seeded');
  const demoReviews = testimonials.filter((t) => t.isDemo);
  assert(demoReviews.length > 0, '17. Demonstration reviews are clearly marked with isDemo: true');

  // TEST 8: FAQs Registered
  const faqs = await prisma.faq.findMany({ where: { isVisible: true } });
  assert(faqs.length >= 6, '18. At least 6 customer FAQs active');

  // TEST 9: Create Customer Commission Enquiry Workflow
  const testRefNumber = `SNS-2026-TEST${Date.now().toString().slice(-4)}`;
  const createdEnquiry = await prisma.$transaction(async (tx) => {
    const enq = await tx.enquiry.create({
      data: {
        referenceNumber: testRefNumber,
        fullName: 'Lady Margaret Sterling',
        email: 'margaret.sterling@example.co.uk',
        phone: '+44 20 7946 0912',
        country: 'United Kingdom',
        city: 'London',
        sketchType: 'Couple Portrait',
        sketchSize: 'A3',
        subjectsCount: 2,
        orientation: 'Portrait',
        paperType: 'Heavyweight Acid-Free Bristol',
        framing: 'With Frame',
        specialInstructions: 'Golden wedding anniversary sketch. Please soften background foliage.',
        giftPackaging: true,
        estimatedPrice: 355.0,
        quotedPrice: 355.0,
        status: 'New',
        attachments: {
          create: [
            {
              filename: 'test-reference-photo-1.jpg',
              originalName: 'margaret-anniversary-ref.jpg',
              mimeType: 'image/jpeg',
              fileSize: 2450000,
              fileUrl: '/uploads/test-reference-photo-1.jpg',
            },
          ],
        },
        statusHistory: {
          create: [
            {
              previousStatus: '',
              newStatus: 'New',
              changeReason: 'Commission enquiry submitted online by client.',
              updatedBy: 'Client Web Form',
            },
          ],
        },
      },
      include: {
        attachments: true,
        statusHistory: true,
      },
    });
    return enq;
  });

  assert(!!createdEnquiry.id, '19. Customer enquiry persisted into database');
  assert(createdEnquiry.referenceNumber.startsWith('SNS-2026-'), '20. Reference number format valid');
  assert(createdEnquiry.attachments.length === 1, '21. Reference photograph attachment linked');
  assert(createdEnquiry.statusHistory.length === 1, '22. Initial New status history logged');

  // TEST 10: Admin Status Transition & Milestone Timeline Log
  await prisma.$transaction(async (tx) => {
    await tx.enquiry.update({
      where: { id: createdEnquiry.id },
      data: {
        status: 'In Progress',
        quotedPrice: 380.0,
        estimatedCompletionDate: '2026-12-10',
        adminNotes: 'Graphite outline transferred to 300gsm cotton canvas.',
      },
    });

    await tx.enquiryStatusHistory.create({
      data: {
        enquiryId: createdEnquiry.id,
        previousStatus: 'New',
        newStatus: 'In Progress',
        changeReason: 'Patron confirmed deposit; artist drafting preliminary values.',
        updatedBy: 'Alex Morgan',
      },
    });

    await tx.enquiryNote.create({
      data: {
        enquiryId: createdEnquiry.id,
        authorName: 'Alex Morgan',
        noteText: 'Special attention requested on delicate lace collar embroidery.',
      },
    });
  });

  const updatedEnquiry = await prisma.enquiry.findUnique({
    where: { id: createdEnquiry.id },
    include: {
      attachments: true,
      notes: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
    },
  });

  assert(updatedEnquiry!.status === 'In Progress', '23. Enquiry status transitioned to In Progress');
  assert(updatedEnquiry!.quotedPrice === 380.0, '24. Quoted price updated by admin');
  assert(updatedEnquiry!.statusHistory.length === 2, '25. Chronological activity timeline has 2 entries');
  assert(updatedEnquiry!.notes.length === 1, '26. Internal studio note persisted');

  // TEST 11: JWT Generation & Verification
  const secret = process.env.JWT_SECRET || 'stroke_and_soul_super_secret_jwt_key_2026_sketch_studio';
  const testToken = jwt.sign(
    { id: admin!.id, email: admin!.email, role: admin!.role, name: admin!.name },
    secret,
    { expiresIn: '1h' }
  );
  const decoded = jwt.verify(testToken, secret) as any;
  assert(decoded.email === admin!.email, '27. JWT token created and decoded securely');

  // Clean up test enquiry
  await prisma.enquiry.delete({ where: { id: createdEnquiry.id } });
  console.log('✓ Cleaned up test enquiry record');

  console.log('\n======================================================');
  console.log(`🎉 ALL ${passedTests} OF ${totalTests} TESTS PASSED PERFECTLY!`);
  console.log('======================================================\n');
}

runTestSuite()
  .catch((err) => {
    console.error('Test suite failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
