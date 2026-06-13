import axios from 'axios';
import * as cheerio from 'cheerio';
import Page from '../models/Page.js';
import Link from '../models/Link.js';
import Job from '../models/Job.js';
import { io } from '../server.js';

const crawlPage = async (jobId, url, depth) => {
  try {
    console.log(`🕷️ Crawling: ${url}`);

    // ── Step 1: Fetch the page ────────────────────────
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MyCrawler/1.0)'
      }
    });

    const html = response.data;
    const statusCode = response.status;

    // ── Step 2: Parse HTML with Cheerio ───────────────
    const $ = cheerio.load(html);
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const content = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000);

    // ── Step 3: Extract all links ─────────────────────
    const links = [];
    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http')) {
        links.push(href);
      }
    });

    // ── Step 4: Save Page to MongoDB ──────────────────
    const page = await Page.create({
      jobId,
      url,
      title,
      description,
      content,
      statusCode,
      depth,
      linksFound: links.length
    });

    // ── Step 5: Save Links to MongoDB ─────────────────
    const linkDocs = links.map(link => ({
      jobId,
      fromUrl: url,
      toUrl: link,
      depth: depth + 1,
      isCrawled: false
    }));

    if (linkDocs.length > 0) {
      await Link.insertMany(linkDocs);
    }

    // ── Step 6: Update Job counters ───────────────────
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $inc: { pagesCount: 1, linksCount: links.length } },
      { new: true }
    );

    // ── Step 7: Emit real time update to React ────────
    io.emit('crawl_update', {
      jobId,
      url,
      title,
      pagesCount: updatedJob.pagesCount,
      linksCount: updatedJob.linksCount
    });

    console.log(`✅ Done: ${url} | Links: ${links.length}`);
    return { success: true, links };

  } catch (error) {
    console.error(`❌ Failed: ${url} | ${error.message}`);

    // ── Emit error event to React ─────────────────────
    io.emit('crawl_error', { jobId, url, error: error.message });
    return { success: false, links: [] };
  }
};

export default crawlPage;