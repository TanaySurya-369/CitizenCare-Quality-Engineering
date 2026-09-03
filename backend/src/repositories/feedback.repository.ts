import prisma from '../prisma';
import { Feedback } from '@prisma/client';

export class FeedbackRepository {
  static async create(data: {
    complaintId: string;
    citizenId: string;
    rating: number;
    comment?: string;
    resolutionConfirmed?: boolean;
  }): Promise<Feedback> {
    return prisma.feedback.create({
      data: {
        complaintId: data.complaintId,
        citizenId: data.citizenId,
        rating: data.rating,
        comment: data.comment,
        resolutionConfirmed: data.resolutionConfirmed ?? true,
      },
      include: {
        citizen: { select: { id: true, name: true, email: true } },
        complaint: { select: { id: true, complaintNumber: true, title: true } },
      },
    });
  }

  static async findByComplaintId(complaintId: string): Promise<Feedback | null> {
    return prisma.feedback.findUnique({
      where: { complaintId },
      include: {
        citizen: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async getAverageSatisfaction(): Promise<{ average: number; count: number }> {
    const aggregations = await prisma.feedback.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      average: aggregations._avg.rating ? Number(aggregations._avg.rating.toFixed(2)) : 5.0,
      count: aggregations._count.rating || 0,
    };
  }

  static async getFeedbackDistribution(): Promise<Record<number, number>> {
    const feedbacks = await prisma.feedback.groupBy({
      by: ['rating'],
      _count: { rating: true },
    });

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(f => {
      distribution[f.rating] = f._count.rating;
    });

    return distribution;
  }
}
