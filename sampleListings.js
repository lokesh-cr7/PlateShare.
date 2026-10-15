/**
 * Sample Demo Listings for PlateShare
 * 
 * Timestamps are dynamically generated relative to current time
 * so that judges always experience live, active states:
 * - Fresh (Active)
 * - Expiring Soon (Warning / Orange)
 * - Expired (Red / Disabled)
 * - Claimed / Scheduled Pickup
 * - Collected / Completed Pickup
 */

export function generateSampleListings() {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_MIN = 60 * 1000;

  return [
    {
      id: 'demo-listing-1',
      title: 'Vegetable Dum Biryani & Mirchi Ka Salan',
      description: 'Fragrant saffron basmati rice layered with seasonal vegetables, garden herbs, and roasted spices. Packaged in sanitized, food-grade thermal catering trays immediately after banquet conclusion.',
      donorName: 'Royal Feast Banquet & Catering',
      donorType: 'Event Organizer',
      category: 'Rice and biryani',
      servings: 45,
      weightKg: 18.0,
      preparedAt: new Date(now - 1.5 * ONE_HOUR).toISOString(),
      pickupStartTime: new Date(now - 0.5 * ONE_HOUR).toISOString(),
      pickupDeadline: new Date(now + 3.5 * ONE_HOUR).toISOString(), // 3.5 hours remaining -> Fresh
      address: '742 Grand Banquet Blvd, Bayview District',
      area: 'Downtown / City Center',
      city: 'Metro City',
      storageMethod: 'Heated / Insulated',
      allergens: ['Dairy (Ghee)'],
      contactPhone: '+1 (555) 349-8120',
      contactEmail: 'kitchen@royalfeastbanquets.com',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      status: 'Available',
      isDemo: true,
      donorDeclarationAccepted: true,
      createdAt: new Date(now - 1.5 * ONE_HOUR).toISOString()
    },
    {
      id: 'demo-listing-2',
      title: 'Artisanal Sourdough Breads & Morning Pastries',
      description: 'Assorted freshly baked whole wheat sourdough boules, butter croissants, cinnamon swirls, and multi-grain dinner rolls. Baked this morning in our certified bakery kitchen.',
      donorName: 'Boulangerie Golden Crust',
      donorType: 'Restaurant',
      category: 'Bakery items',
      servings: 40,
      weightKg: 12.5,
      preparedAt: new Date(now - 3 * ONE_HOUR).toISOString(),
      pickupStartTime: new Date(now - 1 * ONE_HOUR).toISOString(),
      pickupDeadline: new Date(now + 4.5 * ONE_HOUR).toISOString(), // 4.5 hours remaining -> Fresh
      address: '128 Baker Street, North Hills',
      area: 'North District',
      city: 'Metro City',
      storageMethod: 'Room Temperature',
      allergens: ['Gluten', 'Dairy'],
      contactPhone: '+1 (555) 781-4420',
      contactEmail: 'manager@goldencrust.com',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      status: 'Available',
      isDemo: true,
      donorDeclarationAccepted: true,
      createdAt: new Date(now - 2 * ONE_HOUR).toISOString()
    },
    {
      id: 'demo-listing-3',
      title: 'Cooked Rice, Yellow Dal Tadka & Mix Veg Curry',
      description: 'Slow-simmered homestyle yellow lentil dal with cumin-garlic tempering, steamed jeera rice, and dry spiced vegetable sabzi. Maintained in insulated warmers.',
      donorName: 'Taj Express Diner',
      donorType: 'Restaurant',
      category: 'Cooked meals',
      servings: 25,
      weightKg: 11.0,
      preparedAt: new Date(now - 3.8 * ONE_HOUR).toISOString(),
      pickupStartTime: new Date(now - 2 * ONE_HOUR).toISOString(),
      pickupDeadline: new Date(now + 25 * ONE_MIN).toISOString(), // ONLY 25 MINS LEFT -> Expiring Soon!
      address: '45 Heritage Colony, Commercial Road',
      area: 'Central Commercial Area',
      city: 'Metro City',
      storageMethod: 'Heated / Insulated',
      allergens: ['None reported'],
      contactPhone: '+1 (555) 892-1134',
      contactEmail: 'contact@tajexpressdiner.org',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      status: 'Available',
      isDemo: true,
      donorDeclarationAccepted: true,
      createdAt: new Date(now - 3.5 * ONE_HOUR).toISOString()
    },
    {
      id: 'demo-listing-4',
      title: 'Fresh Farm Apples, Oranges & Leafy Greens',
      description: 'Surplus organic gala apples, sweet navel oranges, ripe bananas, and boxed crisp salad greens. Pristine quality from weekly local farm partner delivery.',
      donorName: 'Green Valley Natural Market',
      donorType: 'Household',
      category: 'Fruits and vegetables',
      servings: 35,
      weightKg: 20.0,
      preparedAt: new Date(now - 4 * ONE_HOUR).toISOString(),
      pickupStartTime: new Date(now - 2 * ONE_HOUR).toISOString(),
      pickupDeadline: new Date(now + 5 * ONE_HOUR).toISOString(),
      address: '302 Market Square, West End',
      area: 'West Suburbs',
      city: 'Metro City',
      storageMethod: 'Refrigerated',
      allergens: ['None'],
      contactPhone: '+1 (555) 431-7788',
      contactEmail: 'community@greenvalleymarket.com',
      imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
      status: 'Pickup scheduled', // CLAIMED DEMO CASE
      claimDetails: {
        claimId: 'CLM-7842',
        receiverName: 'Sister Maria',
        orgName: 'Hope Community Food Pantry',
        receiverType: 'NGO',
        contactPhone: '+1 (555) 912-3344',
        contactEmail: 'maria@hopecommunitypantry.org',
        servingsClaimed: 35,
        preferredTime: 'Scheduled within 1 hour',
        pickupCode: 'PS-4821',
        claimedAt: new Date(now - 45 * ONE_MIN).toISOString(),
        vehicleInfo: 'Van with cold storage boxes'
      },
      isDemo: true,
      donorDeclarationAccepted: true,
      createdAt: new Date(now - 3 * ONE_HOUR).toISOString()
    },
    {
      id: 'demo-listing-5',
      title: 'Steamed Rice, South Indian Sambar & Poriyal',
      description: 'Lentil stew with vegetables and aromatic spices with steamed short-grain rice. Prepared for lunch session.',
      donorName: 'Southern Spice Canteen',
      donorType: 'Restaurant',
      category: 'Cooked meals',
      servings: 30,
      weightKg: 14.0,
      preparedAt: new Date(now - 6 * ONE_HOUR).toISOString(),
      pickupStartTime: new Date(now - 4 * ONE_HOUR).toISOString(),
      pickupDeadline: new Date(now - 35 * ONE_MIN).toISOString(), // EXPIRED 35 MINS AGO! -> Expired state!
      address: '89 Temple Road, South Gate',
      area: 'South Quarter',
      city: 'Metro City',
      storageMethod: 'Room Temperature',
      allergens: ['Mustard seeds'],
      contactPhone: '+1 (555) 670-9921',
      contactEmail: 'kitchen@southernspice.net',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      status: 'Expired',
      isDemo: true,
      donorDeclarationAccepted: true,
      createdAt: new Date(now - 5 * ONE_HOUR).toISOString()
    },
    {
      id: 'demo-listing-6',
      title: 'Gourmet Deli Wraps, Club Sandwiches & Pasta Salad',
      description: 'Individually wrapped vegetarian and turkey deli wraps, roasted pepper pasta salad in cold boxes. Prepared for corporate tech summit luncheon.',
      donorName: 'The Westin Grand Hotel & Conventions',
      donorType: 'Hotel',
      category: 'Packaged food',
      servings: 60,
      weightKg: 24.0,
      preparedAt: new Date(now - 8 * ONE_HOUR).toISOString(),
      pickupStartTime: new Date(now - 5 * ONE_HOUR).toISOString(),
      pickupDeadline: new Date(now - 2 * ONE_HOUR).toISOString(),
      address: '1000 Skyline Promenade, Financial District',
      area: 'Downtown / City Center',
      city: 'Metro City',
      storageMethod: 'Refrigerated',
      allergens: ['Gluten', 'Dairy'],
      contactPhone: '+1 (555) 201-9000',
      contactEmail: 'banquets@westingrandmetro.com',
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      status: 'Collected', // COMPLETED PICKUP DEMO CASE!
      claimDetails: {
        claimId: 'CLM-6102',
        receiverName: 'David Chen',
        orgName: 'City Meal Volunteer Corps',
        receiverType: 'Volunteer',
        contactPhone: '+1 (555) 887-2190',
        contactEmail: 'david.chen@citymealvolunteers.org',
        servingsClaimed: 60,
        preferredTime: 'Collected on schedule',
        pickupCode: 'PS-3914',
        claimedAt: new Date(now - 4 * ONE_HOUR).toISOString(),
        collectedAt: new Date(now - 2.5 * ONE_HOUR).toISOString(),
        vehicleInfo: 'Cargo EV'
      },
      isDemo: true,
      donorDeclarationAccepted: true,
      createdAt: new Date(now - 7 * ONE_HOUR).toISOString()
    }
  ];
}

export const DEMO_PROFILES = {
  donor: {
    id: 'usr-donor-1',
    role: 'donor',
    name: 'Chef Marcus Vance',
    organization: 'Royal Feast Banquet & Catering',
    donorType: 'Event Organizer',
    phone: '+1 (555) 349-8120',
    email: 'marcus@royalfeastbanquets.com',
    address: '742 Grand Banquet Blvd, Downtown',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    roleLabel: 'Food Donor'
  },
  volunteer: {
    id: 'usr-vol-1',
    role: 'volunteer',
    name: 'Alex Rivera',
    organization: 'City Food Rescue Squad',
    receiverType: 'Volunteer',
    phone: '+1 (555) 674-9021',
    email: 'alex.rivera@rescuesquad.org',
    vehicle: 'Sedan with insulated carrier bags',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    roleLabel: 'Volunteer Runner'
  },
  ngo: {
    id: 'usr-ngo-1',
    role: 'ngo',
    name: 'Dr. Sarah Jenkins',
    organization: 'Hope Community Food Pantry',
    receiverType: 'NGO',
    phone: '+1 (555) 912-3344',
    email: 'sarah.j@hopecommunitypantry.org',
    registrationNumber: 'NGO-501C3-98214',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    roleLabel: 'NGO Food Bank Director'
  }
};
