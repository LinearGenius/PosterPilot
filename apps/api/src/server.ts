import cors from "@fastify/cors";
import { executePosterAgent } from "@poster-pilot/agent";
import Fastify from "fastify";
import { z } from "zod";

const briefSchema = z.object({
  productName: z.string().max(80),
  campaign: z.string().max(80),
  sellingPoint: z.string().max(120),
  style: z.enum(["energetic", "minimal", "premium"]),
  ratio: z.enum(["4:5", "1:1", "16:9"]),
});

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
});

app.get("/health", async () => ({
  status: "ok",
  service: "poster-pilot-api",
  planner: "deterministic-v2",
}));

app.post("/api/runs", async (request, reply) => {
  const parsed = briefSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.code(400).send({
      error: "INVALID_BRIEF",
      message: "提交的海报需求格式不正确。",
      details: parsed.error.flatten(),
    });
  }

  return executePosterAgent(parsed.data);
});

const port = Number(process.env.PORT ?? 8787);

try {
  await app.listen({ port, host: "0.0.0.0" });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
