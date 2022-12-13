import { NodeSDK } from "@opentelemetry/sdk-node";
import { TraceIdRatioBasedSampler } from "@opentelemetry/core";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter as OTLPTraceExporterGrpc } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

/*
  Initialize tracing
  Example of url: "http://host.docker.internal:4317"
*/
if (process.env.OTLP_GRPC_ENDPOINT) {
  const exporterGrpc = new OTLPTraceExporterGrpc({
    url: process.env.OTLP_GRPC_ENDPOINT
  });

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.DD_SERVICE ?? "todos-api",
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.DD_VERSION ?? "v0.0.0",
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.DD_ENV ?? "development"
    }),
    traceExporter: exporterGrpc,
    instrumentations: [getNodeAutoInstrumentations()],
    sampler: new TraceIdRatioBasedSampler(1)
  });

  sdk.start();
  console.log("Tracing started");
}
