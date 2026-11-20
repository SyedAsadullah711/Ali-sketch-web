import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';

export const contentRouter = Router();

// Public endpoint to load all active content for the landing & order pages
contentRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const [settings, sections, services, pricing, galleryImages, categories, testimonials, faqs] =
      await Promise.all([
        prisma.websiteSetting.findFirst(),
        prisma.pageSection.findMany({ orderBy: { displayOrder: 'asc' } }),
        prisma.service.findMany({
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        }),
        prisma.servicePricing.findMany({
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        }),
        prisma.galleryImage.findMany({
          where: { isActive: true },
          include: { category: true },
          orderBy: { displayOrder: 'asc' },
        }),
        prisma.galleryCategory.findMany({
          orderBy: { displayOrder: 'asc' },
          include: {
            _count: {
              select: { images: true },
            },
          },
        }),
        prisma.testimonial.findMany({
          where: { isVisible: true },
          orderBy: { displayOrder: 'asc' },
        }),
        prisma.faq.findMany({
          where: { isVisible: true },
          orderBy: { displayOrder: 'asc' },
        }),
      ]);

    // Structured 4 steps for "How It Works" (customizable via settings/sections)
    const processSteps = [
      {
        step: 1,
        title: 'Share Your Photograph',
        description: 'Upload your high-resolution reference portrait through our streamlined order form with your custom instructions.',
        icon: 'UploadCloud',
      },
      {
        step: 2,
        title: 'Select Your Sketch Size',
        description: 'Choose your desired scale (A5 to A2), framing preferences, and paper specifications with instant price clarity.',
        icon: 'Layers',
      },
      {
        step: 3,
        title: 'Artist Creates Your Artwork',
        description: 'Every stroke is hand-rendered with premium graphite and charcoal on archival heavyweight cotton paper.',
        icon: 'PenTool',
      },
      {
        step: 4,
        title: 'Receive Your Finished Sketch',
        description: 'Review your high-resolution digital proof, followed by insured flat-packaging or custom framed delivery to your doorstep.',
        icon: 'PackageCheck',
      },
    ];

    res.json({
      settings: settings || {},
      sections,
      services,
      pricing,
      galleryImages,
      categories,
      testimonials,
      faqs,
      processSteps,
    });
  } catch (error) {
    console.error('Error fetching public content:', error);
    res.status(500).json({ error: 'Failed to retrieve website content.' });
  }
});
