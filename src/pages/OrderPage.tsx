import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AnnouncementBar } from '../components/common/AnnouncementBar';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { useContent } from '../context/ContentContext';
import { publicApi } from '../api/client';
import {
  Upload,
  X,
  CheckCircle2,
  Calendar,
  Gift,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Info,
} from 'lucide-react';

export const OrderPage: React.FC = () => {
  const { content } = useContent();
  const [searchParams] = useSearchParams();

  const pricingRules = content?.pricing || [];
  const currencySymbol = content?.settings?.currencySymbol || '$';

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('');

  const [sketchType, setSketchType] = useState('Single Portrait');
  const [sketchSize, setSketchSize] = useState('A4');
  const [subjectsCount, setSubjectsCount] = useState(1);
  const [orientation, setOrientation] = useState<'Portrait' | 'Landscape' | 'Square'>('Portrait');
  const [paperType, setPaperType] = useState('Heavyweight Acid-Free Bristol');
  const [framing, setFraming] = useState<'Without Frame' | 'With Frame' | 'Not Sure'>('Without Frame');

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState('');
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [additionalRequests, setAdditionalRequests] = useState('');

  // Status & Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] = useState<{
    referenceNumber: string;
    enquiryId: number;
    estimatedPrice: number;
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Initialize service or size from query parameters
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      if (serviceParam.includes('single')) setSketchType('Single Portrait');
      else if (serviceParam.includes('couple')) {
        setSketchType('Couple Portrait');
        setSubjectsCount(2);
      } else if (serviceParam.includes('family')) {
        setSketchType('Family Portrait');
        setSubjectsCount(3);
      } else if (serviceParam.includes('pet')) setSketchType('Pet Portrait');
      else if (serviceParam.includes('custom')) setSketchType('Custom Artwork');
      else if (serviceParam.includes('gift')) {
        setSketchType('Gift Portrait');
        setGiftPackaging(true);
      }
    }

    const sizeParam = searchParams.get('size');
    if (sizeParam) {
      setSketchSize(sizeParam);
    }
  }, [searchParams]);

  // Live dynamic estimated price calculation
  const calculatedEstimate = useMemo(() => {
    if (pricingRules.length === 0) return 160.0;

    const matchedRule =
      pricingRules.find((r) => r.paperSize.toLowerCase() === sketchSize.toLowerCase()) ||
      pricingRules[0];

    let total = matchedRule.basePrice;

    // Extra subjects
    const extra = Math.max(0, subjectsCount - matchedRule.maxDefaultSubjects);
    total += extra * matchedRule.extraSubjectPrice;

    // Framing
    if (framing === 'With Frame') {
      total += matchedRule.framingPrice;
    }

    // Gift packaging
    if (giftPackaging) {
      total += matchedRule.giftPackagingPrice;
    }

    return total;
  }, [pricingRules, sketchSize, subjectsCount, framing, giftPackaging]);

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    const validFiles: File[] = [];
    for (const file of newFiles) {
      if (file.size > 15 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 15MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    const updated = [...uploadedFiles, ...validFiles].slice(0, 8); // Max 8 files
    setUploadedFiles(updated);

    // Generate previews
    const newPreviews = updated.map((file) => URL.createObjectURL(file));
    setFilePreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);

    URL.revokeObjectURL(filePreviews[index]);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    setFilePreviews(updatedPreviews);
  };

  const copyReferenceNumber = () => {
    if (confirmationData?.referenceNumber) {
      navigator.clipboard.writeText(confirmationData.referenceNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Please provide your phone or WhatsApp number.');
      return;
    }
    if (uploadedFiles.length === 0) {
      setSubmitError('Please upload at least one reference photograph.');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('country', country);
      formData.append('city', city);
      formData.append('sketchType', sketchType);
      formData.append('sketchSize', sketchSize);
      formData.append('subjectsCount', String(subjectsCount));
      formData.append('orientation', orientation);
      formData.append('paperType', paperType);
      formData.append('framing', framing);
      formData.append('specialInstructions', specialInstructions);
      formData.append('preferredDeliveryDate', preferredDeliveryDate);
      formData.append('giftPackaging', String(giftPackaging));
      formData.append('additionalRequests', additionalRequests);

      // Attach all files
      uploadedFiles.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await publicApi.submitEnquiry(formData);
      setConfirmationData(response);

      // Scroll to confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-ivory text-studio-charcoal selection:bg-studio-gold selection:text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* CONFIRMATION SCREEN UPON SUCCESS */}
          {confirmationData ? (
            <div className="bg-studio-card p-8 sm:p-12 rounded-sm border border-studio-gold shadow-elevated text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-studio-gold/15 text-studio-gold mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-studio-gold font-semibold">
                  Commission Enquiry Confirmed
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-studio-charcoal">
                  Thank You, {fullName.split(' ')[0]}
                </h1>
                <p className="text-sm text-studio-taupe max-w-lg mx-auto font-light">
                  Your reference photographs and custom requirements have been safely received by Stroke &amp; Soul Studio.
                </p>
              </div>

              {/* Reference Number Card */}
              <div className="max-w-md mx-auto p-5 rounded-sm bg-studio-beige/50 border border-studio-border text-center space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-studio-taupe font-semibold">
                  Your Enquiry Reference Number
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-studio-charcoal tracking-wider">
                    {confirmationData.referenceNumber}
                  </span>
                  <button
                    onClick={copyReferenceNumber}
                    className="p-1.5 rounded hover:bg-studio-card text-studio-taupe hover:text-studio-charcoal transition-colors"
                    title="Copy reference number"
                  >
                    {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-studio-taupe">
                  Please save this number for reference when communicating with the studio.
                </p>
              </div>

              {/* Order Summary Recap */}
              <div className="max-w-md mx-auto bg-studio-card p-4 rounded-sm border border-studio-border/80 text-left text-xs space-y-2">
                <div className="font-semibold text-studio-charcoal uppercase tracking-wider text-[11px] border-b border-studio-border/60 pb-1.5">
                  Commission Summary
                </div>
                <div className="flex justify-between text-studio-taupe">
                  <span>Artwork Type:</span>
                  <span className="font-medium text-studio-charcoal">{sketchType} ({sketchSize})</span>
                </div>
                <div className="flex justify-between text-studio-taupe">
                  <span>Subjects:</span>
                  <span className="font-medium text-studio-charcoal">{subjectsCount} Subject(s)</span>
                </div>
                <div className="flex justify-between text-studio-taupe">
                  <span>Framing:</span>
                  <span className="font-medium text-studio-charcoal">{framing}</span>
                </div>
                <div className="flex justify-between text-studio-taupe">
                  <span>Gift Packaging:</span>
                  <span className="font-medium text-studio-charcoal">{giftPackaging ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between text-studio-taupe border-t border-studio-border/60 pt-2 font-semibold">
                  <span>Estimated Total:</span>
                  <span className="text-studio-gold text-sm font-bold">
                    {currencySymbol}{confirmationData.estimatedPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Next Steps Guidance */}
              <div className="max-w-lg mx-auto text-left bg-studio-beige/30 p-5 rounded-sm border border-studio-border text-xs text-studio-taupe space-y-2">
                <h4 className="font-semibold text-studio-charcoal text-xs uppercase tracking-wider">
                  What Happens Next:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>Artist Alex Morgan personally reviews your photograph clarity and lighting.</li>
                  <li>Within 24 business hours, you will receive an official confirmation email with your digital invoice.</li>
                  <li>Once approved, a high-resolution proof is emailed before final sealing and shipping.</li>
                </ol>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/"
                  className="w-full sm:w-auto px-8 py-3 bg-studio-charcoal text-studio-ivory text-xs uppercase tracking-widest font-semibold hover:bg-studio-gold transition-colors rounded-sm"
                >
                  Return to Studio Home
                </Link>
                <a
                  href={`https://wa.me/${(content?.settings?.whatsappNumber || '+15552345678').replace(/[^0-9]/g, '')}?text=Hello%20Alex,%20I%20just%20submitted%20enquiry%20${confirmationData.referenceNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-800 text-white text-xs uppercase tracking-widest font-semibold hover:bg-emerald-700 transition-colors rounded-sm"
                >
                  Confirm via WhatsApp
                </a>
              </div>
            </div>
          ) : (
            /* ENQUIRY FORM */
            <div className="space-y-10">
              
              {/* Form Intro Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-beige text-[11px] uppercase tracking-widest text-studio-taupe font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-studio-gold" />
                  <span>Custom Handcrafted Commission</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold text-studio-charcoal">
                  Commission Your Custom Sketch
                </h1>
                <p className="text-sm sm:text-base text-studio-taupe max-w-xl mx-auto font-light leading-relaxed">
                  Provide your reference photograph and preferences below. We provide transparent live estimates with zero upfront payment required today.
                </p>
                <div className="w-12 h-0.5 bg-studio-gold mx-auto mt-4" />
              </div>

              {/* Error Banner */}
              {submitError && (
                <div className="p-4 rounded-sm bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. CUSTOMER INFORMATION */}
                <div className="bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft space-y-6">
                  <div className="border-b border-studio-border/60 pb-3">
                    <span className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                      Section 01
                    </span>
                    <h2 className="font-serif text-xl font-bold text-studio-charcoal">
                      Customer Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. eleanor@example.com"
                        className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Phone / WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 234-5678"
                        className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                          Country
                        </label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="United States"
                          className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="New York"
                          className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SKETCH DETAILS */}
                <div className="bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft space-y-6">
                  <div className="border-b border-studio-border/60 pb-3">
                    <span className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                      Section 02
                    </span>
                    <h2 className="font-serif text-xl font-bold text-studio-charcoal">
                      Sketch Specifications
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Sketch Type */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Sketch Type
                      </label>
                      <select
                        value={sketchType}
                        onChange={(e) => setSketchType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                      >
                        <option value="Single Portrait">Single Portrait</option>
                        <option value="Couple Portrait">Couple Portrait</option>
                        <option value="Family Portrait">Family Portrait</option>
                        <option value="Pet Portrait">Pet Portrait</option>
                        <option value="Custom Artwork">Custom Fine Artwork</option>
                        <option value="Gift Portrait">Gift Portrait</option>
                      </select>
                    </div>

                    {/* Paper Size */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Paper Size
                      </label>
                      <select
                        value={sketchSize}
                        onChange={(e) => setSketchSize(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                      >
                        <option value="A5">A5 – Small (5.8 x 8.3 in / 148 x 210 mm)</option>
                        <option value="A4">A4 – Medium (8.3 x 11.7 in / 210 x 297 mm)</option>
                        <option value="A3">A3 – Large (11.7 x 16.5 in / 297 x 420 mm)</option>
                        <option value="A2">A2 – Extra Large (16.5 x 23.4 in / 420 x 594 mm)</option>
                        <option value="Custom Size">Custom Exhibition Scale</option>
                      </select>
                    </div>

                    {/* Subjects Count */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Number of People / Subjects
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSubjectsCount(Math.max(1, subjectsCount - 1))}
                          className="w-9 h-9 rounded-sm bg-studio-beige border border-studio-border text-sm font-bold text-studio-charcoal flex items-center justify-center hover:bg-studio-gold hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="font-serif text-lg font-bold w-12 text-center text-studio-charcoal">
                          {subjectsCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSubjectsCount(Math.min(10, subjectsCount + 1))}
                          className="w-9 h-9 rounded-sm bg-studio-beige border border-studio-border text-sm font-bold text-studio-charcoal flex items-center justify-center hover:bg-studio-gold hover:text-white transition-colors"
                        >
                          +
                        </button>
                        <span className="text-[11px] text-studio-taupe">
                          {subjectsCount === 1 ? 'Solo Subject' : `${subjectsCount} Subjects`}
                        </span>
                      </div>
                    </div>

                    {/* Orientation */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Composition Orientation
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Portrait', 'Landscape', 'Square'] as const).map((o) => (
                          <button
                            key={o}
                            type="button"
                            onClick={() => setOrientation(o)}
                            className={`py-2 text-xs font-medium rounded-sm border transition-all ${
                              orientation === o
                                ? 'bg-studio-charcoal text-studio-ivory border-studio-charcoal'
                                : 'bg-studio-ivory text-studio-taupe border-studio-border hover:border-studio-charcoal'
                            }`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Paper Type */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Paper Specification
                      </label>
                      <select
                        value={paperType}
                        onChange={(e) => setPaperType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                      >
                        <option value="Heavyweight Acid-Free Bristol">Heavyweight Acid-Free Bristol (Smooth)</option>
                        <option value="Cold Press Cotton Archival">Cold Press Cotton Archival (Subtle Texture)</option>
                        <option value="Toned Tan Heritage Paper">Toned Tan Heritage Paper (Warm Sepia Tones)</option>
                      </select>
                    </div>

                    {/* Framing */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Solid Wood Framing
                      </label>
                      <select
                        value={framing}
                        onChange={(e) => setFraming(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                      >
                        <option value="Without Frame">Without Frame (Shipped Flat in Rigid Mailer)</option>
                        <option value="With Frame">With Solid Oak/Black Frame &amp; Mat (+Fee)</option>
                        <option value="Not Sure">Not Sure (Discuss with Artist)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. PHOTOGRAPH UPLOAD */}
                <div className="bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft space-y-6">
                  <div className="border-b border-studio-border/60 pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                        Section 03
                      </span>
                      <h2 className="font-serif text-xl font-bold text-studio-charcoal">
                        Reference Photographs <span className="text-red-500">*</span>
                      </h2>
                    </div>
                    <span className="text-[11px] text-studio-taupe">
                      {uploadedFiles.length} / 8 files
                    </span>
                  </div>

                  {/* Dropzone */}
                  <label className="border-2 border-dashed border-studio-border hover:border-studio-gold bg-studio-ivory/60 hover:bg-studio-ivory rounded-sm p-8 text-center cursor-pointer transition-colors block group">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 text-studio-gold/70 group-hover:text-studio-gold mx-auto mb-3 transition-colors" />
                    <div className="font-serif text-base font-bold text-studio-charcoal">
                      Click to Browse or Drag Reference Photographs Here
                    </div>
                    <p className="text-xs text-studio-taupe mt-1">
                      Supports JPG, JPEG, PNG, and WEBP (Up to 15MB each). Multiple photos welcome!
                    </p>
                  </label>

                  {/* File Previews List */}
                  {filePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      {filePreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-sm overflow-hidden border border-studio-border bg-studio-beige group shadow-sm"
                        >
                          <img
                            src={preview}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                            title="Remove photograph"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white truncate max-w-[90%]">
                            {uploadedFiles[idx]?.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-studio-taupe leading-relaxed flex items-start gap-2 bg-studio-beige/30 p-3 rounded-sm">
                    <Info className="w-4 h-4 text-studio-gold shrink-0 mt-0.5" />
                    <span>
                      Tip: Feel free to upload several photos. Alex will review and suggest which photo will translate into the most striking graphite composition.
                    </span>
                  </div>
                </div>

                {/* 4. CUSTOM REQUIREMENTS & DATES */}
                <div className="bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft space-y-6">
                  <div className="border-b border-studio-border/60 pb-3">
                    <span className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                      Section 04
                    </span>
                    <h2 className="font-serif text-xl font-bold text-studio-charcoal">
                      Custom Instructions &amp; Timeline
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Description / Artistic Notes
                      </label>
                      <textarea
                        rows={3}
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Mention any details you want emphasized: background softening, lighting adjustments, clothing preferences, etc."
                        className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                          Preferred Delivery Date (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={preferredDeliveryDate}
                            onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                          />
                          <Calendar className="w-4 h-4 text-studio-taupe absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      {/* Gift Packaging Checkbox */}
                      <div className="flex items-center pt-6">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={giftPackaging}
                            onChange={(e) => setGiftPackaging(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-studio-gold rounded border-studio-border focus:ring-studio-gold"
                          />
                          <div>
                            <span className="text-xs font-semibold text-studio-charcoal flex items-center gap-1.5">
                              <Gift className="w-3.5 h-3.5 text-studio-gold" />
                              Wax-Sealed Gift Presentation Packaging
                            </span>
                            <span className="text-[11px] text-studio-taupe block">
                              Includes handmade calligraphed certificate and protective keepsake casing (+{currencySymbol}15)
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                        Additional Customization Requests
                      </label>
                      <input
                        type="text"
                        value={additionalRequests}
                        onChange={(e) => setAdditionalRequests(e.target.value)}
                        placeholder="e.g. Combine two separate photos into one portrait, or add handwritten calligraphy date below"
                        className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. DYNAMIC PRICING ESTIMATOR & SUBMIT */}
                <div className="bg-studio-charcoal text-studio-ivory p-6 sm:p-8 rounded-sm border border-studio-dark-border shadow-elevated space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                        Section 05
                      </span>
                      <h2 className="font-serif text-2xl font-bold text-white">
                        Live Price Calculation
                      </h2>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-widest text-studio-ivory/60 block">
                        Estimated Commission Total
                      </span>
                      <div className="font-serif text-3xl sm:text-4xl font-bold text-studio-gold">
                        {currencySymbol}{calculatedEstimate.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Itemized Calculation Summary */}
                  <div className="text-xs space-y-2 text-studio-ivory/80">
                    <div className="flex justify-between">
                      <span>Base {sketchSize} Portrait ({sketchType}):</span>
                      <span className="font-mono text-white">
                        {currencySymbol}{((pricingRules.find(r => r.paperSize === sketchSize) || pricingRules[0])?.basePrice || 160).toFixed(2)}
                      </span>
                    </div>

                    {subjectsCount > 1 && (
                      <div className="flex justify-between text-studio-gold">
                        <span>Additional Subjects ({subjectsCount - 1} extra):</span>
                        <span className="font-mono">
                          +{currencySymbol}{((subjectsCount - 1) * ((pricingRules.find(r => r.paperSize === sketchSize) || pricingRules[0])?.extraSubjectPrice || 25)).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {framing === 'With Frame' && (
                      <div className="flex justify-between text-studio-gold">
                        <span>Solid Oak Wood Framing &amp; Mat:</span>
                        <span className="font-mono">
                          +{currencySymbol}{((pricingRules.find(r => r.paperSize === sketchSize) || pricingRules[0])?.framingPrice || 35).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {giftPackaging && (
                      <div className="flex justify-between text-studio-gold">
                        <span>Wax-Sealed Gift Presentation Packaging:</span>
                        <span className="font-mono">+{currencySymbol}15.00</span>
                      </div>
                    )}
                  </div>

                  {/* Transparency Note */}
                  <div className="p-3.5 rounded bg-white/5 border border-white/10 text-xs text-studio-ivory/70 leading-relaxed flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-studio-gold shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Estimate Label: </strong>
                      This figure is a preliminary estimate calculated from your selected specifications. Final pricing is formally confirmed by the artist upon photograph inspection before any payment is requested.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-studio-gold hover:bg-studio-ivory text-studio-charcoal text-xs uppercase tracking-widest font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-xl rounded-sm disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Your Commission Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Sketch Enquiry</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-[11px] text-studio-ivory/50">
                    No payment is required today &bull; Your reference photos remain 100% confidential
                  </div>
                </div>

              </form>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
