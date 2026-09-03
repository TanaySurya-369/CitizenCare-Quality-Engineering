export const ComplaintPayloads = {
  validHighRoad: (categoryId: string) => ({
    title: 'Severe Subsidence and Pavement Rutting',
    description: 'Road foundation has shifted causing deep ruts that risk vehicle alignment.',
    categoryId,
    location: '450 Park Avenue & 57th St',
    priority: 'HIGH',
    latitude: 40.7614,
    longitude: -73.9712,
  }),
  validCriticalWater: (categoryId: string) => ({
    title: 'Major Water Main Fracture and Street Flooding',
    description: 'High-pressure water main bursting through asphalt and flooding basements.',
    categoryId,
    location: '120 West 44th St',
    priority: 'CRITICAL',
  }),
  invalidShortTitle: (categoryId: string) => ({
    title: 'Bad',
    description: 'Valid description that has enough characters to pass validation.',
    categoryId,
    location: 'Main St',
  }),
};

export const FeedbackPayloads = {
  fiveStar: {
    rating: 5,
    comment: 'Exceptional work, clean repair, and polite field crew!',
    resolutionConfirmed: true,
  },
  oneStar: {
    rating: 1,
    comment: 'Issue was marked resolved but pavement is still uneven.',
    resolutionConfirmed: false,
  },
  invalidOutOfRange: {
    rating: 7,
    comment: 'Invalid 7 star rating.',
  },
};
