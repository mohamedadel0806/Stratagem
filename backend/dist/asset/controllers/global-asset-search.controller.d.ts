import { GlobalAssetSearchService } from '../services/global-asset-search.service';
import { GlobalAssetSearchQueryDto, GlobalAssetSearchResponseDto } from '../dto/global-asset-search.dto';
export declare class GlobalAssetSearchController {
    private readonly globalAssetSearchService;
    constructor(globalAssetSearchService: GlobalAssetSearchService);
    search(query: GlobalAssetSearchQueryDto): Promise<GlobalAssetSearchResponseDto>;
    findAll(query: GlobalAssetSearchQueryDto): Promise<GlobalAssetSearchResponseDto>;
}
