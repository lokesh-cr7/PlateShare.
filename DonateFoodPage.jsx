import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlateShare } from '../context/PlateShareContext';
import {
  PlusCircle,
  Utensils,
  Building,
  Clock,
  MapPin,
  Scale,
  Thermometer,
  AlertTriangle,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

const CATEGORIES = [
  'Cooked meals',
  'Rice and biryani',
  'Bakery items',
  'Fruits and vegetables',
  'Packaged food',
  'Other'
];

const DONOR_TYPES = [
  'Restaurant',
  'Hotel',
  'Household',
  'Event Organizer'
];

const STORAGE_METHODS = [
  { id: 'Heated / Insulated', label: 'Heated / Insulated', desc: 'Maintained at ≥ 60°C in thermal catering chafers' },
  { id: 'Refrigerated', label: 'Refrigerated', desc: 'Stored chilled at ≤ 4°C in clean food containers' },
  { id: 'Room Temperature', label: 'Room Temperature', desc: 'Dry baked items, fruits, or sealed packages' },
  { id: 'Frozen', label: 'Frozen', desc: 'Stored at ≤ -18°C deep freeze' }
];

const COMMON_ALLERGENS = [
  'Dairy',
  'Gluten',
  'Nuts / Peanuts',
  'Eggs',
  'Soy',
  'Shellfish',
  'None reported'
];

const PRESET_PHOTOS = [
  {
    label: 'Biryani / Rice',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Bakery / Bread',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Cooked Curry & Rice',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Fresh Fruits',
    url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Wraps & Sandwiches',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80'
  }
];

export default function DonateFoodPage() {
  const { createListing, userProfile, currentRole } = usePlateShare();
  const navigate = useNavigate();

  // Helper: default prepared time (1 hour ago in local format YYYY-MM-DDTHH:mm)
  const getInitialPreparedTime = () => {
    const d = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  // Helper: default deadline (3 hours in the future)
  const getInitialDeadline = () => {
    const d = new Date(Date.now() + 3.5 * 3600 * 1000);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const [donorName, setDonorName] = useState(userProfile?.name || 'Grand Palace Hotel & Banquets');
  const [donorType, setDonorType] = useState('Restaurant');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cooked meals');
  const [servings, setServings] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [preparedAt, setPreparedAt] = useState(getInitialPreparedTime());
  const [pickupStartTime, setPickupStartTime] = useState(getInitialPreparedTime());
  const [pickupDeadline, setPickupDeadline] = useState(getInitialDeadline());
  const [address, setAddress] = useState(userProfile?.address || '120 Central Plaza, Suite 400');
  const [area, setArea] = useState('Downtown / City Center');
  const [city, setCity] = useState('Metro City');
  const [storageMethod, setStorageMethod] = useState('Heated / Insulated');
  const [selectedAllergens, setSelectedAllergens] = useState(['None reported']);
  const [contactPhone, setContactPhone] = useState(userProfile?.phone || '+1 (555) 438-9920');
  const [contactEmail, setContactEmail] = useState(userProfile?.email || 'surplus@grandpalace.org');
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [donorDeclarationAccepted, setDonorDeclarationAccepted] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset loader for hackathon judges
  const handleQuickFill = (presetType) => {
    if (presetType === 'buffet') {
      setTitle('Gourmet Buffet: Steamed Rice, Butter Chicken & Dal Makhani');
      setDescription('Surplus from corporate dinner event. Held in commercial stainless steel chafers. Immediately chilled/thermal packed.');
      setCategory('Cooked meals');
      setDonorName('Grand Palace Hotel & Banquets');
      setDonorType('Hotel');
      setServings('50');
      setWeightKg('22.5');
      setStorageMethod('Heated / Insulated');
      setSelectedAllergens(['Dairy']);
      setImageUrl(PRESET_PHOTOS[2].url);
      setAddress('120 Central Plaza, Suite 400');
      setArea('Downtown / City Center');
      setPreparedAt(getInitialPreparedTime());
      setPickupDeadline(getInitialDeadline());
      setDonorDeclarationAccepted(true);
    } else if (presetType === 'bakery') {
      setTitle('Daily Artisan Breads, Bagels & Savory Croissants');
      setDescription('Unsold morning and afternoon batch from display case. Bagged in food-safe kraft paper.');
      setCategory('Bakery items');
      setDonorName('Artisan Wheat Bakery');
      setDonorType('Restaurant');
      setServings('35');
      setWeightKg('10.0');
      setStorageMethod('Room Temperature');
      setSelectedAllergens(['Gluten', 'Dairy']);
      setImageUrl(PRESET_PHOTOS[1].url);
      setAddress('58 Market Lane, Old Quarter');
      setArea('North District');
      setPreparedAt(getInitialPreparedTime());
      setPickupDeadline(getInitialDeadline());
      setDonorDeclarationAccepted(true);
    }
  };

  const toggleAllergen = (item) => {
    if (item === 'None reported') {
      setSelectedAllergens(['None reported']);
      return;
    }
    const filtered = selectedAllergens.filter(a => a !== 'None reported');
    if (filtered.includes(item)) {
      const next = filtered.filter(a => a !== item);
      setSelectedAllergens(next.length === 0 ? ['None reported'] : next);
    } else {
      setSelectedAllergens([...filtered, item]);
    }
  };

  const validateForm = () => {
    const errors = {};
    const now = new Date();

    if (!donorName.trim()) errors.donorName = 'Donor name is required.';
    if (!title.trim()) errors.title = 'Food title is required.';
    if (!description.trim() || description.length < 10) {
      errors.description = 'Please provide a clear description (at least 10 characters).';
    }
    if (!servings || Number(servings) <= 0) {
      errors.servings = 'Servings must be a positive number.';
    }
    if (!weightKg || Number(weightKg) <= 0) {
      errors.weightKg = 'Approximate weight must be greater than 0 kg.';
    }
    if (!address.trim()) errors.address = 'Pickup address is required.';
    if (!area.trim()) errors.area = 'Area/Neighborhood is required.';
    if (!contactPhone.trim() && !contactEmail.trim()) {
      errors.contactPhone = 'Please provide either a phone number or email.';
    }

    // Time validation
    const prepTime = new Date(preparedAt);
    const deadlineTime = new Date(pickupDeadline);

    if (isNaN(prepTime.getTime())) {
      errors.preparedAt = 'Invalid preparation timestamp.';
    } else if (prepTime > now) {
      errors.preparedAt = 'Prepared time cannot be in the future.';
    }

    if (isNaN(deadlineTime.getTime())) {
      errors.pickupDeadline = 'Invalid pickup deadline timestamp.';
    } else if (deadlineTime <= now) {
      errors.pickupDeadline = 'Safe pickup deadline must be in the future.';
    } else if (deadlineTime <= prepTime) {
      errors.pickupDeadline = 'Pickup deadline must be after preparation time.';
    }

    if (!donorDeclarationAccepted) {
      errors.declaration = 'You must accept the food hygiene and accurate declaration pledge.';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);
      setFormErrors({});

      createListing({
        donorName,
        donorType,
        title,
        description,
        category,
        servings: Number(servings),
        weightKg: Number(weightKg),
        preparedAt: new Date(preparedAt).toISOString(),
        pickupStartTime: new Date(pickupStartTime).toISOString(),
        pickupDeadline: new Date(pickupDeadline).toISOString(),
        address,
        area,
        city,
        storageMethod,
        allergens: selectedAllergens,
        contactPhone,
        contactEmail,
        imageUrl: imageUrl || PRESET_PHOTOS[0].url,
        donorDeclarationAccepted: true
      });

      // Navigate to directory to show newly published listing
      navigate('/find');
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to submit food donation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header with Quick Pre-fill */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
            <PlusCircle className="w-4 h-4" />
            <span>Surplus Food Donation Intake</span>
          </div>
          <h1 className="text-3xl font-black text-brand-950">
            Publish Surplus Food Listing
          </h1>
          <p className="text-xs text-dark-secondary mt-1">
            Fill in accurate portion sizes, storage methods, and pickup deadlines to help local NGOs rescue food.
          </p>
        </div>

        {/* Quick Demo Fill Buttons for Judges */}
        <div className="flex items-center gap-2 bg-cream-100 p-1.5 rounded-2xl border border-amber-300">
          <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1 pl-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Quick Fill:</span>
          </span>
          <button
            type="button"
            onClick={() => handleQuickFill('buffet')}
            className="text-[11px] font-semibold bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-xl shadow-xs transition"
          >
            Hotel Buffet
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('bakery')}
            className="text-[11px] font-semibold bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-xl shadow-xs transition"
          >
            Artisan Bakery
          </button>
        </div>
      </div>

      {formErrors.submit && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{formErrors.submit}</span>
        </div>
      )}

      {/* Main Donation Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-dark-border shadow-soft-sm space-y-8">
        {/* Section 1: Donor Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-900 pb-2 border-b border-dark-border">
            <Building className="w-4 h-4 text-brand-700" />
            <span>1. Donor & Facility Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Donor / Organization Name *
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Grand Palace Hotel or Maya Kitchen"
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none ${
                  formErrors.donorName ? 'border-red-500 bg-red-50' : 'border-dark-border focus:border-brand-600'
                }`}
              />
              {formErrors.donorName && <p className="text-[11px] text-red-600 mt-1">{formErrors.donorName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Donor Type *
              </label>
              <select
                value={donorType}
                onChange={(e) => setDonorType(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border bg-white outline-none focus:border-brand-600 cursor-pointer"
              >
                {DONOR_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Food Specifics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-900 pb-2 border-b border-dark-border">
            <Utensils className="w-4 h-4 text-brand-700" />
            <span>2. Surplus Food Description & Category</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-dark-text mb-1">
                Food Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vegetable Biryani with Raita & Salad"
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none ${
                  formErrors.title ? 'border-red-500 bg-red-50' : 'border-dark-border focus:border-brand-600'
                }`}
              />
              {formErrors.title && <p className="text-[11px] text-red-600 mt-1">{formErrors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border bg-white outline-none focus:border-brand-600 cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-text mb-1">
              Food Description & Packaging Details *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe preparation, containers, and packaging (e.g. Sealed in stainless steel chafing dishes; packed in thermal disposable trays)..."
              className={`w-full text-xs p-3.5 rounded-xl border outline-none ${
                formErrors.description ? 'border-red-500 bg-red-50' : 'border-dark-border focus:border-brand-600'
              }`}
            />
            {formErrors.description && <p className="text-[11px] text-red-600 mt-1">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Number of Servings (Portions) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="e.g. 35"
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-bold ${
                    formErrors.servings ? 'border-red-500 bg-red-50' : 'border-dark-border focus:border-brand-600'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-secondary text-xs">
                  meals
                </span>
              </div>
              {formErrors.servings && <p className="text-[11px] text-red-600 mt-1">{formErrors.servings}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Approximate Total Weight (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="e.g. 15.0"
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-bold ${
                    formErrors.weightKg ? 'border-red-500 bg-red-50' : 'border-dark-border focus:border-brand-600'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-secondary text-xs">
                  kg
                </span>
              </div>
              {formErrors.weightKg && <p className="text-[11px] text-red-600 mt-1">{formErrors.weightKg}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Time & Freshness Parameters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-900 pb-2 border-b border-dark-border">
            <Clock className="w-4 h-4 text-brand-700" />
            <span>3. Freshness & Pickup Window Parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Prepared Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={preparedAt}
                onChange={(e) => setPreparedAt(e.target.value)}
                className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none ${
                  formErrors.preparedAt ? 'border-red-500 bg-red-50' : 'border-dark-border focus:border-brand-600'
                }`}
              />
              <p className="text-[10px] text-dark-secondary mt-1">Cannot be in the future.</p>
              {formErrors.preparedAt && <p className="text-[11px] text-red-600 mt-1">{formErrors.preparedAt}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Pickup Start Time *
              </label>
              <input
                type="datetime-local"
                required
                value={pickupStartTime}
                onChange={(e) => setPickupStartTime(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-dark-border outline-none focus:border-brand-600"
              />
              <p className="text-[10px] text-dark-secondary mt-1">When food is ready for handover.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Safe Pickup Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={pickupDeadline}
                onChange={(e) => setPickupDeadline(e.target.value)}
                className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none font-bold ${
                  formErrors.pickupDeadline ? 'border-red-500 bg-red-50' : 'border-dark-border focus:border-brand-600'
                }`}
              />
              <p className="text-[10px] text-dark-secondary mt-1">Countdown locks after this time.</p>
              {formErrors.pickupDeadline && <p className="text-[11px] text-red-600 mt-1">{formErrors.pickupDeadline}</p>}
            </div>
          </div>
        </div>

        {/* Section 4: Storage Method & Allergens */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-900 pb-2 border-b border-dark-border">
            <Thermometer className="w-4 h-4 text-brand-700" />
            <span>4. Storage Conditions & Allergens</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-text mb-2">
              Current Food Storage Method *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STORAGE_METHODS.map(m => (
                <label
                  key={m.id}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer flex items-start gap-2.5 transition ${
                    storageMethod === m.id
                      ? 'border-brand-700 bg-brand-50/80 shadow-soft-sm'
                      : 'border-dark-border hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="storageMethod"
                    value={m.id}
                    checked={storageMethod === m.id}
                    onChange={(e) => setStorageMethod(e.target.value)}
                    className="mt-0.5 text-brand-700 focus:ring-brand-600"
                  />
                  <div>
                    <span className="font-bold text-dark-text block">{m.label}</span>
                    <span className="text-[11px] text-dark-secondary leading-tight block mt-0.5">{m.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-text mb-2">
              Allergen Disclosures (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_ALLERGENS.map(item => {
                const isSelected = selectedAllergens.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAllergen(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      isSelected
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                        : 'bg-gray-50 text-dark-secondary border-dark-border hover:bg-gray-100'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Pickup Location & Contact Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-900 pb-2 border-b border-dark-border">
            <MapPin className="w-4 h-4 text-brand-700" />
            <span>5. Pickup Location & Contact</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-dark-text mb-1">
                Full Street Address / Building Entrance *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 742 Grand Banquet Blvd, Back Loading Bay 2"
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none ${
                  formErrors.address ? 'border-red-500 bg-red-50' : 'border-dark-border focus:border-brand-600'
                }`}
              />
              {formErrors.address && <p className="text-[11px] text-red-600 mt-1">{formErrors.address}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Area / District *
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Downtown / City Center"
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none ${
                  formErrors.area ? 'border-red-500 bg-red-50' : 'border-dark-border focus:border-brand-600'
                }`}
              />
              {formErrors.area && <p className="text-[11px] text-red-600 mt-1">{formErrors.area}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border focus:border-brand-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-text mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="kitchen@domain.com"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border focus:border-brand-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Food Image Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-900 pb-2 border-b border-dark-border">
            <ImageIcon className="w-4 h-4 text-brand-700" />
            <span>6. Food Presentation Image (Select Preset or Provide URL)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PRESET_PHOTOS.map(p => {
              const isSelected = imageUrl === p.url;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className={`rounded-2xl overflow-hidden border-2 text-left transition relative group ${
                    isSelected ? 'border-brand-700 ring-2 ring-brand-600' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-20 object-cover" />
                  <span className="block text-[10px] font-bold p-1 bg-white text-dark-text truncate">
                    {p.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-brand-700 text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-secondary mb-1">
              Custom Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-dark-border outline-none focus:border-brand-600"
            />
          </div>
        </div>

        {/* Section 7: Mandatory Donor Declaration */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cream-100 border border-amber-300 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Mandatory Donor Food Safety & Hygiene Declaration</span>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={donorDeclarationAccepted}
              onChange={(e) => setDonorDeclarationAccepted(e.target.checked)}
              className="mt-1 rounded text-brand-700 focus:ring-brand-600 w-4 h-4 cursor-pointer"
            />
            <div className="text-xs text-amber-950 leading-relaxed">
              <strong>I hereby declare:</strong> The surplus food listed above was prepared under clean, compliant hygiene conditions, has not been served to plates, is properly packed in sanitary food-grade containers, and the preparation and expiration times provided are true and accurate.
            </div>
          </label>
          {formErrors.declaration && (
            <p className="text-xs text-red-600 font-semibold">{formErrors.declaration}</p>
          )}

          <p className="text-[11px] text-amber-800/80 italic">
            * PlateShare does not independently test food safety in a laboratory; food donors and recipient organizations share mutual responsibility for safe redistribution.
          </p>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-dark-border">
          <button
            type="button"
            onClick={() => navigate('/find')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-dark-secondary hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white shadow-soft hover:shadow-soft-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing Food...' : 'Publish Surplus Food Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
