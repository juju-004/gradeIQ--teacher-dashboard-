// // 🔒 Cache extractor instance
// let extractorPromise: Promise<any> | null = null;

// async function getExtractor() {
//   if (!extractorPromise) {
//     extractorPromise = (async () => {
//       const { pipeline } = await import("@xenova/transformers");

//       return pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
//     })();
//   }

//   return extractorPromise;
// }

// // 🧠 Cosine similarity (safe + stable)
// function cosineSimilarity(a: number[], b: number[]) {
//   if (a.length !== b.length) return 0;

//   let dot = 0;
//   let magA = 0;
//   let magB = 0;

//   for (let i = 0; i < a.length; i++) {
//     const x = a[i];
//     const y = b[i];

//     dot += x * y;
//     magA += x * x;
//     magB += y * y;
//   }

//   if (magA === 0 || magB === 0) return 0;

//   return dot / (Math.sqrt(magA) * Math.sqrt(magB));
// }

// 🚀 Main grading function
// export async function gradeSentence(
//   rubric: string,
//   student: string,
// ): Promise<number> {
//   const extractor = await getExtractor();

//   if (!extractor) return 0;

//   const [emb1, emb2] = await Promise.all([
//     extractor(rubric),
//     extractor(student),
//   ]);

//   const vec1 = Array.from(emb1.data as Float32Array);
//   const vec2 = Array.from(emb2.data as Float32Array);

//   return cosineSimilarity(vec1, vec2);
// }
