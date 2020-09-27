import { PageService } from './page.service';
export declare class PageController {
    private readonly pageService;
    constructor(pageService: PageService);
    createPage(): Promise<import("../../types").Response<any>>;
}
