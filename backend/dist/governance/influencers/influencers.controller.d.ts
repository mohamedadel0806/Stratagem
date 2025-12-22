import { Response } from 'express';
import { InfluencersService } from './influencers.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { InfluencerQueryDto } from './dto/influencer-query.dto';
import { ReviewInfluencerDto } from './dto/review-influencer.dto';
export declare class InfluencersController {
    private readonly influencersService;
    constructor(influencersService: InfluencersService);
    create(createInfluencerDto: CreateInfluencerDto, req: any): Promise<import("./entities/influencer.entity").Influencer>;
    findAll(queryDto: InfluencerQueryDto): Promise<{
        data: import("./entities/influencer.entity").Influencer[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/influencer.entity").Influencer>;
    update(id: string, updateInfluencerDto: UpdateInfluencerDto, req: any): Promise<import("./entities/influencer.entity").Influencer>;
    remove(id: string): Promise<void>;
    uploadDocument(id: string, file: Express.Multer.File, req: any): Promise<{
        message: string;
        document_path: string;
        filename: string;
    }>;
    downloadDocument(filename: string, res: Response): Promise<void>;
    getAllTags(): Promise<string[]>;
    getTagStatistics(): Promise<{
        tag: string;
        count: number;
    }[]>;
    reviewInfluencer(id: string, reviewDto: ReviewInfluencerDto, req: any): Promise<import("./entities/influencer.entity").Influencer>;
    getRevisionHistory(id: string): Promise<import("./entities/influencer-revision.entity").InfluencerRevision[]>;
    importInfluencers(file: Express.Multer.File, req: any): Promise<{
        created: number;
        skipped: number;
        errors: string[];
    }>;
}
