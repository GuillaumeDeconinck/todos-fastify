import { NodeSDK } from "@opentelemetry/sdk-node";
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
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.APP_NAME ?? "todos-api"
    }),
    traceExporter: exporterGrpc,
    instrumentations: [getNodeAutoInstrumentations()]
  });

  sdk.start();
}
