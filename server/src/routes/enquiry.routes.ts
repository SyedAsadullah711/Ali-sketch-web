import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma.js';
import { upload } from '../middleware/upload.js';

export const enquiryRouter = Router();

// Function to generate unique reference number
async function generateUniqueReference(): Promise<string> {
  const currentYear = new Date().getFullYear();
  let ref = '';
  let exists = true;

  while (exists) {
    const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
    ref = `SNS-${currentYear}-${randomCode}`;
    const found = await prisma.enquiry.findUnique({
      where: { referenceNumber: ref },
    });
    if (!found) {
      exists = false;
    }
  }

  return ref;
}

// Calculate dynamic estimated price based on published pricing rules
async function calculateEstimatedPrice(data: {
  paperSize: string;
  subjectsCount: number;
  framing: string;
  giftPackaging: boolean;
}): Promise<number> {
  try {
    const pricingRules = await prisma.servicePricing.findMany({
      where: { isActive: true },
    });

    if (pricingRules.length === 0) return 120.0;

    // Match paper size or take first rule
    const matchedRule =
      pricingRules.find((r) => r.paperSize.toLowerCase() === data.paperSize.toLowerCase()) ||
      pricingRules[0];

    let total = matchedRule.basePrice;

    // Additional subjects
    const extraSubjects = Math.max(0, data.subjectsCount - matchedRule.maxDefaultSubjects);
    total += extraSubjects * matchedRule.extraSubjectPrice;

    // Framing
    if (data.framing === 'With Frame') {
      total += matchedRule.framingPrice;
    }

    // Gift packaging
    if (data.giftPackaging) {
      total += matchedRule.giftPackagingPrice;
    }

    return Math.round(total * 100) / 100;
  } catch (err) {
    return 120.0;
  }
}

enquiryRouter.post(
  '/',
  upload.array('photos', 10),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        fullName,
        email,
        phone,
        country = '',
        city = '',
        sketchType = 'Single Portrait',
        sketchSize = 'A4',
        subjectsCount = '1',
        orientation = 'Portrait',
        paperType = 'Heavyweight Acid-Free Bristol',
        framing = 'Without Frame',
        specialInstructions = '',
        preferredDeliveryDate = '',
        giftPackaging = 'false',
        additionalRequests = '',
      } = req.body;

      // Validation
      if (!fullName || !fullName.trim()) {
        res.status(400).json({ error: 'Full name is required.' });
        return;
      }

      if (!email || !email.trim() || !email.includes('@')) {
        res.status(400).json({ error: 'A valid email address is required.' });
        return;
      }

      if (!phone || !phone.trim()) {
        res.status(400).json({ error: 'Phone or WhatsApp number is required.' });
        return;
      }

      const files = (req.files as Express.Multer.File[]) || [];
      if (files.length === 0) {
        res.status(400).json({
          error: 'Please upload at least one reference photograph so the artist can review your portrait.',
        });
        return;
      }

      const parsedSubjectsCount = Math.max(1, parseInt(subjectsCount, 10) || 1);
      const isGiftPackaging = giftPackaging === 'true' || giftPackaging === true;

      // Calculate estimate
      const estimatedPrice = await calculateEstimatedPrice({
        paperSize: sketchSize,
        subjectsCount: parsedSubjectsCount,
        framing,
        giftPackaging: isGiftPackaging,
      });

      const referenceNumber = await generateUniqueReference();

      // Create enquiry with attachments and initial status history in a transaction
      const enquiry = await prisma.$transaction(async (tx) => {
        const newEnquiry = await tx.enquiry.create({
          data: {
            referenceNumber,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            country: country.trim(),
            city: city.trim(),
            sketchType,
            sketchSize,
            subjectsCount: parsedSubjectsCount,
            orientation,
            paperType,
            framing,
            specialInstructions: specialInstructions.trim(),
            preferredDeliveryDate: preferredDeliveryDate.trim(),
            giftPackaging: isGiftPackaging,
            additionalRequests: additionalRequests.trim(),
            estimatedPrice,
            quotedPrice: estimatedPrice,
            status: 'New',
          },
        });

        // Add attachments
        if (files.length > 0) {
          await tx.enquiryAttachment.createMany({
            data: files.map((f) => ({
              enquiryId: newEnquiry.id,
              filename: f.filename,
              originalName: f.originalname,
              mimeType: f.mimetype,
              fileSize: f.size,
              fileUrl: `/uploads/${f.filename}`,
            })),
          });
        }

        // Add initial status history
        await tx.enquiryStatusHistory.create({
          data: {
            enquiryId: newEnquiry.id,
            previousStatus: '',
            newStatus: 'New',
            changeReason: 'Commission enquiry submitted by customer online.',
            updatedBy: 'System / Customer Form',
          },
        });

        return newEnquiry;
      });

      res.status(201).json({
        success: true,
        referenceNumber: enquiry.referenceNumber,
        enquiryId: enquiry.id,
        estimatedPrice,
        message: 'Your custom sketch enquiry has been received successfully.',
      });
    } catch (error: any) {
      console.error('Enquiry submission error:', error);
      res.status(500).json({
        error: error.message || 'Failed to submit sketch enquiry. Please try again.',
      });
    }
  }
);
