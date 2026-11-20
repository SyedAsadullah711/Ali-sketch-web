import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

export const adminRouter = Router();

// Apply admin authentication to all routes in this router
adminRouter.use(requireAdmin);

// ==========================================
// 1. DASHBOARD OVERVIEW & METRICS
// ==========================================
adminRouter.get('/dashboard', async (_req: AuthRequest, res: Response) => {
  try {
    const [
      totalEnquiries,
      newEnquiries,
      inProgressEnquiries,
      completedEnquiries,
      totalArtworks,
      totalReviews,
      recentEnquiries,
      latestArtworks,
      recentReviews,
      allEnquiriesForStats,
    ] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'New' } }),
      prisma.enquiry.count({
        where: {
          status: { in: ['In Progress', 'Under Review', 'Quotation Sent', 'Approved', 'Quality Check'] },
        },
      }),
      prisma.enquiry.count({ where: { status: { in: ['Completed', 'Delivered'] } } }),
      prisma.galleryImage.count(),
      prisma.testimonial.count(),
      prisma.enquiry.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          attachments: { take: 1 },
        },
      }),
      prisma.galleryImage.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      prisma.testimonial.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.enquiry.findMany({
        select: {
          id: true,
          status: true,
          createdAt: true,
          quotedPrice: true,
          estimatedPrice: true,
        },
      }),
    ]);

    // Calculate monthly enquiries count (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
      monthlyMap[label] = 0;
    }

    allEnquiriesForStats.forEach((enq) => {
      const d = new Date(enq.createdAt);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
      if (monthlyMap[label] !== undefined) {
        monthlyMap[label] += 1;
      }
    });

    const monthlyStats = Object.keys(monthlyMap).map((month) => ({
      month,
      enquiries: monthlyMap[month],
    }));

    // Status breakdown
    const statusCounts: Record<string, number> = {
      New: 0,
      'Under Review': 0,
      'Quotation Sent': 0,
      Approved: 0,
      'In Progress': 0,
      'Quality Check': 0,
      Completed: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    allEnquiriesForStats.forEach((enq) => {
      if (statusCounts[enq.status] !== undefined) {
        statusCounts[enq.status]++;
      } else {
        statusCounts[enq.status] = 1;
      }
    });

    res.json({
      metrics: {
        totalEnquiries,
        newEnquiries,
        inProgressEnquiries,
        completedEnquiries,
        totalArtworks,
        totalReviews,
      },
      recentEnquiries,
      latestArtworks,
      recentReviews,
      monthlyStats,
      statusCounts,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard metrics.' });
  }
});

// ==========================================
// 2. WEBSITE SETTINGS & CMS CONTENT
// ==========================================
adminRouter.get('/settings', async (_req: AuthRequest, res: Response) => {
  try {
    const settings = await prisma.websiteSetting.findFirst();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch website settings.' });
  }
});

adminRouter.put('/settings', async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.websiteSetting.findFirst();
    const data = req.body;

    // Delete id if passed in body
    delete data.id;
    delete data.updatedAt;

    let updated;
    if (existing) {
      updated = await prisma.websiteSetting.update({
        where: { id: existing.id },
        data,
      });
    } else {
      updated = await prisma.websiteSetting.create({
        data,
      });
    }

    res.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: error.message || 'Failed to update website settings.' });
  }
});

adminRouter.get('/sections', async (_req: AuthRequest, res: Response) => {
  try {
    const sections = await prisma.pageSection.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sections.' });
  }
});

adminRouter.put('/sections/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, isVisible, displayOrder } = req.body;
    const updated = await prisma.pageSection.update({
      where: { id },
      data: {
        title,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : undefined,
      },
    });
    res.json({ success: true, section: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update section.' });
  }
});

// ==========================================
// 3. ARTWORK / GALLERY MANAGEMENT
// ==========================================
adminRouter.get('/gallery', async (_req: AuthRequest, res: Response) => {
  try {
    const images = await prisma.galleryImage.findMany({
      include: { category: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery images.' });
  }
});

adminRouter.post('/gallery', upload.single('imageFile'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, categoryId, beforeImageUrl = '', tags = '', isFeatured, isActive, displayOrder } = req.body;

    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      res.status(400).json({ error: 'An image file or image URL is required.' });
      return;
    }

    const newImage = await prisma.galleryImage.create({
      data: {
        title: title || 'Untitled Artwork',
        description: description || '',
        categoryId: parseInt(categoryId, 10) || 1,
        imageUrl,
        beforeImageUrl: beforeImageUrl || '',
        tags: tags || '',
        isFeatured: isFeatured === 'true' || isFeatured === true,
        isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, image: newImage });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create gallery artwork.' });
  }
});

adminRouter.put('/gallery/:id', upload.single('imageFile'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, categoryId, beforeImageUrl, tags, isFeatured, isActive, displayOrder } = req.body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (categoryId !== undefined) data.categoryId = parseInt(categoryId, 10);
    if (beforeImageUrl !== undefined) data.beforeImageUrl = beforeImageUrl;
    if (tags !== undefined) data.tags = tags;
    if (isFeatured !== undefined) data.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isActive !== undefined) data.isActive = isActive === 'true' || isActive === true;
    if (displayOrder !== undefined) data.displayOrder = parseInt(displayOrder, 10);

    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      data.imageUrl = req.body.imageUrl;
    }

    const updated = await prisma.galleryImage.update({
      where: { id },
      data,
      include: { category: true },
    });

    res.json({ success: true, image: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update artwork.' });
  }
});

adminRouter.delete('/gallery/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.galleryImage.delete({ where: { id } });
    res.json({ success: true, message: 'Artwork removed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery artwork.' });
  }
});

// Categories
adminRouter.get('/gallery/categories', async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.galleryCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: { select: { images: true } },
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

adminRouter.post('/gallery/categories', async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, displayOrder } = req.body;
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await prisma.galleryCategory.create({
      data: {
        name,
        slug: catSlug,
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
    });
    res.status(201).json({ success: true, category });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create category.' });
  }
});

// ==========================================
// 4. SERVICES MANAGEMENT
// ==========================================
adminRouter.get('/services', async (_req: AuthRequest, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services.' });
  }
});

adminRouter.post('/services', upload.single('imageFile'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startingPrice, availableSizes, estimatedTime, isActive, displayOrder } = req.body;

    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description: description || '',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        startingPrice: parseFloat(startingPrice) || 120.0,
        availableSizes: typeof availableSizes === 'string' ? availableSizes : JSON.stringify(availableSizes || ['A4', 'A3']),
        estimatedTime: estimatedTime || '3 - 5 Business Days',
        isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
    });

    res.status(201).json({ success: true, service });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create service.' });
  }
});

adminRouter.put('/services/:id', upload.single('imageFile'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, startingPrice, availableSizes, estimatedTime, isActive, displayOrder, slug } = req.body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (startingPrice !== undefined) data.startingPrice = parseFloat(startingPrice);
    if (availableSizes !== undefined) {
      data.availableSizes = typeof availableSizes === 'string' ? availableSizes : JSON.stringify(availableSizes);
    }
    if (estimatedTime !== undefined) data.estimatedTime = estimatedTime;
    if (isActive !== undefined) data.isActive = isActive === 'true' || isActive === true;
    if (displayOrder !== undefined) data.displayOrder = parseInt(displayOrder, 10);

    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      data.imageUrl = req.body.imageUrl;
    }

    const updated = await prisma.service.update({
      where: { id },
      data,
    });

    res.json({ success: true, service: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update service.' });
  }
});

adminRouter.delete('/services/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: 'Service deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service.' });
  }
});

// ==========================================
// 5. PRICING RULES MANAGEMENT
// ==========================================
adminRouter.get('/pricing', async (_req: AuthRequest, res: Response) => {
  try {
    const pricing = await prisma.servicePricing.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pricing rules.' });
  }
});

adminRouter.post('/pricing', async (req: AuthRequest, res: Response) => {
  try {
    const {
      sketchType = 'All Types',
      paperSize,
      dimensions,
      basePrice,
      maxDefaultSubjects = 1,
      extraSubjectPrice = 25.0,
      framingPrice = 35.0,
      giftPackagingPrice = 15.0,
      estimatedDays = '3 - 5 Days',
      isActive = true,
      displayOrder = 0,
    } = req.body;

    const created = await prisma.servicePricing.create({
      data: {
        sketchType,
        paperSize,
        dimensions: dimensions || '',
        basePrice: parseFloat(basePrice) || 120.0,
        maxDefaultSubjects: parseInt(maxDefaultSubjects, 10) || 1,
        extraSubjectPrice: parseFloat(extraSubjectPrice) || 25.0,
        framingPrice: parseFloat(framingPrice) || 35.0,
        giftPackagingPrice: parseFloat(giftPackagingPrice) || 15.0,
        estimatedDays,
        isActive: Boolean(isActive),
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
    });

    res.status(201).json({ success: true, rule: created });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create pricing rule.' });
  }
});

adminRouter.put('/pricing/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data: any = { ...req.body };
    delete data.id;
    delete data.updatedAt;

    if (data.basePrice !== undefined) data.basePrice = parseFloat(data.basePrice);
    if (data.maxDefaultSubjects !== undefined) data.maxDefaultSubjects = parseInt(data.maxDefaultSubjects, 10);
    if (data.extraSubjectPrice !== undefined) data.extraSubjectPrice = parseFloat(data.extraSubjectPrice);
    if (data.framingPrice !== undefined) data.framingPrice = parseFloat(data.framingPrice);
    if (data.giftPackagingPrice !== undefined) data.giftPackagingPrice = parseFloat(data.giftPackagingPrice);
    if (data.displayOrder !== undefined) data.displayOrder = parseInt(data.displayOrder, 10);
    if (data.isActive !== undefined) data.isActive = Boolean(data.isActive);

    const updated = await prisma.servicePricing.update({
      where: { id },
      data,
    });

    res.json({ success: true, rule: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update pricing rule.' });
  }
});

adminRouter.delete('/pricing/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.servicePricing.delete({ where: { id } });
    res.json({ success: true, message: 'Pricing rule deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete pricing rule.' });
  }
});

// ==========================================
// 6. TESTIMONIALS / REVIEWS MANAGEMENT
// ==========================================
adminRouter.get('/testimonials', async (_req: AuthRequest, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials.' });
  }
});

adminRouter.post('/testimonials', upload.single('customerImage'), async (req: AuthRequest, res: Response) => {
  try {
    const { customerName, location, reviewText, rating, sketchType, dateString, isFeatured, isVisible, isDemo, displayOrder } = req.body;

    let customerImageUrl = req.body.customerImageUrl || '';
    if (req.file) {
      customerImageUrl = `/uploads/${req.file.filename}`;
    }

    const review = await prisma.testimonial.create({
      data: {
        customerName: customerName || 'Valued Customer',
        location: location || '',
        reviewText,
        rating: parseInt(rating, 10) || 5,
        customerImageUrl,
        sketchType: sketchType || 'Portrait Sketch',
        dateString: dateString || 'Recent Commission',
        isFeatured: isFeatured === 'true' || isFeatured === true,
        isVisible: isVisible !== undefined ? isVisible === 'true' || isVisible === true : true,
        isDemo: isDemo === 'true' || isDemo === true,
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
    });

    res.status(201).json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create review.' });
  }
});

adminRouter.put('/testimonials/:id', upload.single('customerImage'), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data: any = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    if (data.rating !== undefined) data.rating = parseInt(data.rating, 10);
    if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === 'true' || data.isFeatured === true;
    if (data.isVisible !== undefined) data.isVisible = data.isVisible === 'true' || data.isVisible === true;
    if (data.isDemo !== undefined) data.isDemo = data.isDemo === 'true' || data.isDemo === true;
    if (data.displayOrder !== undefined) data.displayOrder = parseInt(data.displayOrder, 10);

    if (req.file) {
      data.customerImageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data,
    });

    res.json({ success: true, review: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update review.' });
  }
});

adminRouter.delete('/testimonials/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.testimonial.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review.' });
  }
});

// ==========================================
// 7. FAQ MANAGEMENT
// ==========================================
adminRouter.get('/faqs', async (_req: AuthRequest, res: Response) => {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs.' });
  }
});

adminRouter.post('/faqs', async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, category = 'General', isVisible = true, displayOrder = 0 } = req.body;
    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        category,
        isVisible: Boolean(isVisible),
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
    });
    res.status(201).json({ success: true, faq });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create FAQ.' });
  }
});

adminRouter.put('/faqs/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data: any = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    if (data.isVisible !== undefined) data.isVisible = Boolean(data.isVisible);
    if (data.displayOrder !== undefined) data.displayOrder = parseInt(data.displayOrder, 10);

    const updated = await prisma.faq.update({
      where: { id },
      data,
    });
    res.json({ success: true, faq: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update FAQ.' });
  }
});

adminRouter.delete('/faqs/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.faq.delete({ where: { id } });
    res.json({ success: true, message: 'FAQ deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ.' });
  }
});

// ==========================================
// 8. ENQUIRY / ORDER MANAGEMENT
// ==========================================
adminRouter.get('/enquiries', async (req: AuthRequest, res: Response) => {
  try {
    const { search, status, dateFrom, dateTo, page = '1', limit = '50' } = req.query;

    const where: any = {};

    if (status && status !== 'All') {
      where.status = String(status);
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { referenceNumber: { contains: q } },
        { fullName: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(String(dateFrom));
      if (dateTo) where.createdAt.lte = new Date(String(dateTo) + 'T23:59:59.999Z');
    }

    const skip = (Math.max(1, parseInt(String(page), 10)) - 1) * parseInt(String(limit), 10);
    const take = parseInt(String(limit), 10);

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        include: {
          attachments: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.enquiry.count({ where }),
    ]);

    res.json({
      enquiries,
      pagination: {
        total,
        page: parseInt(String(page), 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Failed to retrieve enquiries.' });
  }
});

adminRouter.get('/enquiries/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        attachments: true,
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!enquiry) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiry detail.' });
  }
});

adminRouter.put('/enquiries/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { newStatus, changeReason = '', quotedPrice, estimatedCompletionDate, adminNotes } = req.body;

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }

    const previousStatus = existing.status;
    const authorName = req.user?.name || 'Studio Admin';

    const updated = await prisma.$transaction(async (tx) => {
      const updateData: any = {
        status: newStatus,
      };

      if (quotedPrice !== undefined && quotedPrice !== null) {
        updateData.quotedPrice = parseFloat(quotedPrice);
      }
      if (estimatedCompletionDate !== undefined) {
        updateData.estimatedCompletionDate = estimatedCompletionDate;
      }
      if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
      }

      const enq = await tx.enquiry.update({
        where: { id },
        data: updateData,
        include: {
          attachments: true,
          notes: { orderBy: { createdAt: 'desc' } },
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
      });

      // Always log status changes with timestamps in the chronological history timeline!
      if (previousStatus !== newStatus || changeReason) {
        await tx.enquiryStatusHistory.create({
          data: {
            enquiryId: id,
            previousStatus,
            newStatus,
            changeReason: changeReason || `Status updated from ${previousStatus} to ${newStatus}`,
            updatedBy: authorName,
          },
        });
      }

      return enq;
    });

    res.json({ success: true, enquiry: updated });
  } catch (error: any) {
    console.error('Error updating enquiry status:', error);
    res.status(500).json({ error: error.message || 'Failed to update enquiry status.' });
  }
});

adminRouter.post('/enquiries/:id/notes', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { noteText, isCustomerVisible = false } = req.body;
    const authorName = req.user?.name || 'Studio Admin';

    const note = await prisma.enquiryNote.create({
      data: {
        enquiryId: id,
        authorName,
        noteText,
        isCustomerVisible: Boolean(isCustomerVisible),
      },
    });

    res.status(201).json({ success: true, note });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add note.' });
  }
});

// General update of enquiry details
adminRouter.put('/enquiries/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.attachments;
    delete data.notes;
    delete data.statusHistory;

    if (data.quotedPrice !== undefined) data.quotedPrice = parseFloat(data.quotedPrice);
    if (data.estimatedPrice !== undefined) data.estimatedPrice = parseFloat(data.estimatedPrice);
    if (data.subjectsCount !== undefined) data.subjectsCount = parseInt(data.subjectsCount, 10);

    const updated = await prisma.enquiry.update({
      where: { id },
      data,
      include: {
        attachments: true,
        notes: { orderBy: { createdAt: 'desc' } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    res.json({ success: true, enquiry: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update enquiry.' });
  }
});

// ==========================================
// 9. MEDIA LIBRARY
// ==========================================
adminRouter.get('/media', async (_req: AuthRequest, res: Response) => {
  try {
    const media = await prisma.mediaLibrary.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media library.' });
  }
});

adminRouter.post('/media/upload', upload.array('files', 10), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) {
      res.status(400).json({ error: 'No files uploaded.' });
      return;
    }

    const createdItems = await Promise.all(
      files.map((f) =>
        prisma.mediaLibrary.create({
          data: {
            filename: f.filename,
            originalName: f.originalname,
            mimeType: f.mimetype,
            fileSize: f.size,
            fileUrl: `/uploads/${f.filename}`,
            altText: f.originalname.replace(/\.[^/.]+$/, ''),
          },
        })
      )
    );

    res.status(201).json({ success: true, media: createdItems });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to upload media.' });
  }
});

adminRouter.delete('/media/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await prisma.mediaLibrary.findUnique({ where: { id } });
    if (item) {
      const filePath = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads', item.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not delete physical file:', filePath);
        }
      }
      await prisma.mediaLibrary.delete({ where: { id } });
    }
    res.json({ success: true, message: 'Media item deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete media item.' });
  }
});
