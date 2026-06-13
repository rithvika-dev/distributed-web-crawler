import { Queue, Worker } from 'bullmq';
import crawlPage from '../workers/crawlerWorker.js';
import Job from '../models/Job.js';

// ── Redis Connection Config ───────────────────────────
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
};

// ── Create the Queue ──────────────────────────────────
export const crawlQueue = new Queue('crawlQueue', {
  connection: redisConnection
});

// ── Add a URL to the Queue ────────────────────────────
export const addToQueue = async (jobId, url, depth) => {
  await crawlQueue.add('crawl', {
    jobId,
    url,
    depth
  });
  console.log(`📥 Added to queue: ${url}`);
};

// ── Worker: Processes URLs from the Queue ─────────────
export const startWorker = () => {
  const worker = new Worker('crawlQueue', async (job) => {

    const { jobId, url, depth } = job.data;

    // Get the job from MongoDB to check its settings
    const crawlJob = await Job.findById(jobId);

    // Stop if job was paused or cancelled
    if (!crawlJob || crawlJob.status === 'paused' || crawlJob.status === 'failed') {
      console.log(`⏸️ Job ${jobId} is paused or stopped`);
      return;
    }

    // Stop if max pages reached
    if (crawlJob.pagesCount >= crawlJob.maxPages) {
      console.log(`🏁 Max pages reached for job ${jobId}`);
      await Job.findByIdAndUpdate(jobId, { status: 'completed', completedAt: Date.now() });
      return;
    }

    // Stop if max depth reached
    if (depth > crawlJob.depth) {
      console.log(`🏁 Max depth reached for ${url}`);
      return;
    }

    // ── Crawl the page ──────────────────────────────────
    const result = await crawlPage(jobId, url, depth);

    // ── Add discovered links back to queue ──────────────
    if (result.success && result.links.length > 0) {
      for (const link of result.links) {
        await addToQueue(jobId, link, depth + 1);
      }
    }

  }, { connection: redisConnection, concurrency: 5 }); // 5 parallel workers!

  worker.on('completed', (job) => {
    console.log(`✅ Queue job done: ${job.data.url}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Queue job failed: ${job.data.url} | ${err.message}`);
  });

  console.log('👷 Crawler workers started (concurrency: 5)');
};