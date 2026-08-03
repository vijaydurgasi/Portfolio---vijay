/**
 * Pre-computes embeddings for all resume chunks using all-MiniLM-L6-v2.
 * Run with: node scripts/generateEmbeddings.mjs
 * Output: src/data/resumeEmbeddings.json
 */

import { pipeline } from '@huggingface/transformers';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically import the resume data
const resumeDataPath = join(__dirname, '..', 'src', 'data', 'resumeData.js');

async function main() {
  console.log('🔄 Loading embedding model (all-MiniLM-L6-v2)...');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    dtype: 'fp32',
  });
  console.log('✅ Model loaded');

  // Import resume chunks dynamically
  const { default: resumeChunks } = await import(`file://${resumeDataPath.replace(/\\/g, '/')}`);

  console.log(`📝 Processing ${resumeChunks.length} chunks...\n`);

  const embeddings = [];

  for (const chunk of resumeChunks) {
    process.stdout.write(`  Embedding: ${chunk.id}...`);

    const output = await embedder(chunk.content, {
      pooling: 'mean',
      normalize: true,
    });

    const embeddingArray = Array.from(output.data);

    embeddings.push({
      id: chunk.id,
      section: chunk.section,
      content: chunk.content,
      keywords: chunk.keywords,
      embedding: embeddingArray,
    });

    console.log(` ✅ (${embeddingArray.length}-dim)`);
  }

  // Write output
  const outputPath = join(__dirname, '..', 'src', 'data', 'resumeEmbeddings.json');
  writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));

  console.log(`\n🎉 Done! Wrote ${embeddings.length} embeddings to src/data/resumeEmbeddings.json`);
  console.log(`   Vector dimensions: ${embeddings[0].embedding.length}`);
}

main().catch(console.error);
