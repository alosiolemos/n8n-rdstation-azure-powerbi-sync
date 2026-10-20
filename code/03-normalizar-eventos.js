const leads = $json.body?.leads ?? [];

const resultado = [];
const chaves = new Set();

for (const lead of leads) {

  const uuid = String(lead.uuid ?? '')
    .trim()
    .toLowerCase();

  if (!uuid) continue;

  const conversao = lead.last_conversion;

  if (!conversao) continue;

  const content = conversao.content ?? {};
  const original = content.__cdp__original_event ?? {};

  const eventType =
    original.event_type ??
    content.event_type ??
    'CONVERSION';

  const eventFamily =
    original.event_family ??
    'CDP';

  const eventIdentifier =
    original.event_identifier ??
    content.event_identifier ??
    content.conversion_identifier ??
    content.identificador ??
    conversao.source ??
    null;

  // IMPORTANTE:
  // prioriza a data externa da conversão,
  // que é a mesma utilizada no histórico
  const eventTimestamp =
    conversao.created_at ??
    original.event_timestamp ??
    content.event_timestamp ??
    content.created_at ??
    null;

  const email =
    String(
      original.payload?.email ??
      content.email_lead ??
      lead.email ??
      ''
    )
      .trim()
      .toLowerCase() || null;

  if (!eventIdentifier || !eventTimestamp) {
    continue;
  }

  // Se existir payload CDP usa ele.
  // Caso contrário monta o payload com os dados do webhook.
  const payload =
  original.payload ??
  {
    name:
      content.nome ??
      content.Nome ??
      lead.name ??
      null,

    email:
      content.email_lead ??
      lead.email ??
      null,

    company_name:
      content.empresa ??
      content.Empresa ??
      lead.company ??
      null,

    personal_phone:
      content.telefone ??
      content.Telefone ??
      lead.personal_phone ??
      lead.phone ??
      null,

    job_title:
      content.cargo ??
      content.Cargo ??
      lead.job_title ??
      null,

    conversion_identifier:
      content.conversion_identifier ??
      content.event_identifier ??
      content.identificador ??
      null,

    traffic_source:
      content.traffic_source ??
      null,

    traffic_medium:
      content.traffic_medium ??
      null,

    traffic_campaign:
      content.traffic_campaign ??
      null,

    traffic_channel:
      content.traffic_channel ??
      null,

    traffic_term:
      content.traffic_term ??
      null
  };

  const eventKeySource = [
    uuid,
    eventType,
    eventIdentifier,
    eventTimestamp
  ].join('|');

  if (chaves.has(eventKeySource)) {
    continue;
  }

  chaves.add(eventKeySource);

  resultado.push({
    json: {
      contact_uuid: uuid,
      contact_email: email,

      event_type: eventType,
      event_family: eventFamily,
      event_identifier: eventIdentifier,
      event_timestamp: eventTimestamp,
      traffic_source: payload.traffic_source ?? null,
      event_key_source: eventKeySource,
      payload_json: JSON.stringify(payload)
    }
  });
}

return resultado;
