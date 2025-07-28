import { 
  type User, 
  type InsertUser, 
  type Campaign, 
  type InsertCampaign,
  type Metrics,
  type InsertMetrics,
  type RevenueData,
  type InsertRevenueData,
  type UsersByRegion,
  type InsertUsersByRegion,
  type ConversionsByChannel,
  type InsertConversionsByChannel
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: string): Promise<boolean>;
  
  getMetrics(): Promise<Metrics | undefined>;
  createMetrics(metrics: InsertMetrics): Promise<Metrics>;
  
  getRevenueData(): Promise<RevenueData[]>;
  createRevenueData(data: InsertRevenueData): Promise<RevenueData>;
  
  getUsersByRegion(): Promise<UsersByRegion[]>;
  createUsersByRegion(data: InsertUsersByRegion): Promise<UsersByRegion>;
  
  getConversionsByChannel(): Promise<ConversionsByChannel[]>;
  createConversionsByChannel(data: InsertConversionsByChannel): Promise<ConversionsByChannel>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private campaigns: Map<string, Campaign>;
  private metrics: Metrics | undefined;
  private revenueData: RevenueData[];
  private usersByRegion: UsersByRegion[];
  private conversionsByChannel: ConversionsByChannel[];

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.revenueData = [];
    this.usersByRegion = [];
    this.conversionsByChannel = [];
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Current metrics
    this.metrics = {
      id: randomUUID(),
      date: new Date(),
      revenue: 847392,
      users: 24573,
      conversions: 1847,
      growth: 15.3
    };

    // Revenue data for line chart
    const revenueDataSample = [
      { month: "Jan", revenue: 420000 },
      { month: "Feb", revenue: 532000 },
      { month: "Mar", revenue: 468000 },
      { month: "Apr", revenue: 625000 },
      { month: "May", revenue: 578000 },
      { month: "Jun", revenue: 847392 }
    ];

    revenueDataSample.forEach(data => {
      const revenueEntry: RevenueData = {
        id: randomUUID(),
        ...data
      };
      this.revenueData.push(revenueEntry);
    });

    // Users by region for bar chart
    const regionDataSample = [
      { region: "North America", users: 8547 },
      { region: "Europe", users: 7234 },
      { region: "Asia Pacific", users: 6025 },
      { region: "South America", users: 3512 },
      { region: "Africa", users: 2498 }
    ];

    regionDataSample.forEach(data => {
      const regionEntry: UsersByRegion = {
        id: randomUUID(),
        ...data
      };
      this.usersByRegion.push(regionEntry);
    });

    // Conversions by channel for pie chart
    const channelDataSample = [
      { channel: "Organic Search", conversions: 738, percentage: 40 },
      { channel: "Social Media", conversions: 462, percentage: 25 },
      { channel: "Email Marketing", conversions: 369, percentage: 20 },
      { channel: "Paid Advertising", conversions: 278, percentage: 15 }
    ];

    channelDataSample.forEach(data => {
      const channelEntry: ConversionsByChannel = {
        id: randomUUID(),
        ...data
      };
      this.conversionsByChannel.push(channelEntry);
    });

    // Sample campaigns
    const campaignsSample = [
      { name: "Summer Sale 2024", status: "active", budget: 25000, impressions: 1234567, clicks: 45678, ctr: 3.7 },
      { name: "Holiday Promotion", status: "paused", budget: 15000, impressions: 876543, clicks: 32145, ctr: 3.7 },
      { name: "Brand Awareness Q1", status: "active", budget: 40000, impressions: 2345678, clicks: 78901, ctr: 3.4 },
      { name: "Product Launch", status: "draft", budget: 30000, impressions: 0, clicks: 0, ctr: 0 },
      { name: "Retargeting Campaign", status: "active", budget: 12500, impressions: 567890, clicks: 23456, ctr: 4.1 }
    ];

    campaignsSample.forEach(campaign => {
      const campaignEntry: Campaign = {
        id: randomUUID(),
        createdAt: new Date(),
        ...campaign
      };
      this.campaigns.set(campaignEntry.id, campaignEntry);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const newCampaign: Campaign = {
      ...campaign,
      id,
      createdAt: new Date()
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const existing = this.campaigns.get(id);
    if (!existing) return undefined;
    
    const updated: Campaign = { ...existing, ...campaign };
    this.campaigns.set(id, updated);
    return updated;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  async getMetrics(): Promise<Metrics | undefined> {
    return this.metrics;
  }

  async createMetrics(metrics: InsertMetrics): Promise<Metrics> {
    const newMetrics: Metrics = {
      ...metrics,
      id: randomUUID()
    };
    this.metrics = newMetrics;
    return newMetrics;
  }

  async getRevenueData(): Promise<RevenueData[]> {
    return this.revenueData;
  }

  async createRevenueData(data: InsertRevenueData): Promise<RevenueData> {
    const newData: RevenueData = {
      ...data,
      id: randomUUID()
    };
    this.revenueData.push(newData);
    return newData;
  }

  async getUsersByRegion(): Promise<UsersByRegion[]> {
    return this.usersByRegion;
  }

  async createUsersByRegion(data: InsertUsersByRegion): Promise<UsersByRegion> {
    const newData: UsersByRegion = {
      ...data,
      id: randomUUID()
    };
    this.usersByRegion.push(newData);
    return newData;
  }

  async getConversionsByChannel(): Promise<ConversionsByChannel[]> {
    return this.conversionsByChannel;
  }

  async createConversionsByChannel(data: InsertConversionsByChannel): Promise<ConversionsByChannel> {
    const newData: ConversionsByChannel = {
      ...data,
      id: randomUUID()
    };
    this.conversionsByChannel.push(newData);
    return newData;
  }
}

export const storage = new MemStorage();
