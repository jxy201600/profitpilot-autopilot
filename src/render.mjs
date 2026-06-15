export function renderMarkdown(result) {
  if (!result.ok) {
    return `# ProfitPilot Autopilot Result\n\nStatus: blocked\n\nReason: ${result.message}\n\nCompliance policy: ${result.compliance.policy}\n`;
  }
  const { packet, plan, compliance, mode } = result;
  return `# ProfitPilot Autopilot Packet

Mode: ${mode}

## Compliance

- Policy: ${compliance.policy}
- Risk level: ${plan.riskLevel}
- Human review required: ${compliance.requiresHumanReview ? "yes" : "no"}

## Quote

- Service: ${packet.quote.title}
- Price: ${packet.quote.price} ${packet.quote.currency}
- Delivery time: ${packet.quote.deliveryTime}

Scope:
${packet.quote.scope.map((item) => `- ${item}`).join("\n")}

Assumptions:
${packet.quote.assumptions.map((item) => `- ${item}`).join("\n")}

## Customer Reply

${packet.customerReply}

## Missing Inputs

${packet.missingInputs.map((item) => `- ${item}`).join("\n")}

## Operator Checklist

${packet.operatorChecklist.map((item) => `- ${item}`).join("\n")}

## Order Draft

- Order ID: ${packet.orderDraft.id}
- Amount: ${packet.orderDraft.amount} ${packet.orderDraft.currency}
- Payment status: ${packet.orderDraft.paymentStatus}
- Delivery status: ${packet.orderDraft.deliveryStatus}

## Delivery Preview

${packet.deliveryPreview.files.map((item) => `- ${item}`).join("\n")}

Release gate: ${packet.deliveryPreview.releaseGate}

## Human Checkpoints

${packet.humanCheckpoints.map((item) => `- ${item}`).join("\n")}
`;
}
