import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';

@Injectable()
export class ScrapingService {
  async scrapeJobs(jobTitle: string, location: string): Promise<any[]> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Example: Indeed job scraping
    const searchURL = `https://www.indeed.com/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`;
    await page.goto(searchURL, { waitUntil: 'domcontentloaded' });

    // Extract job listings
    const jobs = await page.$$eval('.job_seen_beacon', (jobElements) =>
      jobElements.map((job) => ({
        title: job.querySelector('h2 a')?.textContent?.trim() || 'No title',
        company:
          job.querySelector('.companyName')?.textContent?.trim() ||
          'No company',
        location:
          job.querySelector('.companyLocation')?.textContent?.trim() ||
          'No location',
        link: job.querySelector('h2 a')?.getAttribute('href')
          ? 'https://www.indeed.com' +
            job.querySelector('h2 a')?.getAttribute('href')
          : '',
      })),
    );

    await browser.close();
    return jobs;
  }
}
