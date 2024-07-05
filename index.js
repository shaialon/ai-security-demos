import { processUserQuery } from "./src/agent/endpoint.js";
import { processUserRefundRequest } from "./src/refund_chain/endpoint.js";
import { generateStory } from "./src/story_generator/endpoint.js"; // Make sure to create and import your story generation handler

import { config } from "./config.js";

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyStatic, {
  root: path.join(config.__dirname, "public"),
  // prefix: "/public/",
});

fastify.route({
  method: "GET",
  url: "/ai_search",
  schema: {
    querystring: {
      type: "object",
      properties: {
        search: { type: "string" },
        seller_id: { type: "string" },
      },
      required: ["search"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "string" },
          results: { type: "array" },
          output_image: { type: "string" },
        },
      },
    },
  },

  handler: async (request, reply) => {
    const { results, output_image } = await processUserQuery(request.query.search, request.query.seller_id);
    return { status: "success", results: results, output_image: output_image };
  },
});

fastify.route({
  method: "GET",
  url: "/ai_refund",
  schema: {
    querystring: {
      type: "object",
      properties: {
        query: { type: "string" },
      },
      required: ["query"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "string" },
          decision: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
  },

  handler: async (request, reply) => {
    const { decision, reason } = await processUserRefundRequest(request.query.query);
    return { status: "success", decision, reason };
  },
});

fastify.route({
  method: "POST",
  url: "/generate_story",
  schema: {
    body: {
      type: "object",
      properties: {
        contentType: { type: "string" },
        style: { type: "string" },
        emojiUse: { type: "string" },
        audience: { type: "string" },
        purpose: { type: "string" },
        primaryMessage: { type: "string" },
        keyPoints: { type: "string" },
        length: { type: "string" },
        visualElements: { type: "string" },
        visualDescription: { type: "string" },
        emotion: { type: "string" },
        voice: { type: "string" },
        structure: { type: "string" },
        cta: { type: "string" },
        examples: { type: "string" },
        keywords: { type: "string" },
        references: { type: "string" },
        background: { type: "string" },
      },
      required: [
        "contentType",
        "style",
        "emojiUse",
        "audience",
        "purpose",
        "primaryMessage",
        "keyPoints",
        "length",
        "visualElements",
        "emotion",
        "voice",
        "structure",
        "cta",
      ],
    },
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "string" },
          story: { type: "string" },
        },
      },
    },
  },

  handler: async (request, reply) => {
    const storyData = request.body;
    const story = await generateStory(storyData);
    return { status: "success", story: story };
  },
});

try {
  await fastify.listen({ port: config.PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
