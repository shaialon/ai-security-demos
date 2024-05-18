import { processUserQuery } from "./src/agent/endpoint.js";
import { processUserRefundRequest } from "./src/refund_chain/endpoint.js";

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

try {
  await fastify.listen({ port: config.PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
