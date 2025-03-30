import { Controller, Get, Query } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Get('jobs')
  async getJobs(
    @Query('title') title: string,
    @Query('location') location: string,
  ) {
    return this.scrapingService.scrapeJobs(title, location);
  }
}
