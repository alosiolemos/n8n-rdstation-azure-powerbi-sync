const leads = $json.body?.leads ?? [];

function toText(value) {
  if (value === null || value === undefined) return null;

  if (Array.isArray(value)) {
    return value
      .map(v => typeof v === 'object' ? JSON.stringify(v) : String(v))
      .filter(Boolean)
      .join(', ') || null;
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

return leads.map(c => {

  const cf = c.custom_fields ?? {};

  return {
    json: {

      // =============================================
      // IDENTIFICAÇÃO
      // =============================================

      uuid: c.uuid ?? null,

      name: c.name ?? null,
      email: c.email ?? null,

      phone: c.phone ?? null,
      personal_phone: c.personal_phone ?? null,
      mobile_phone: c.mobile_phone ?? null,

      job_title: c.job_title ?? null,

      // Não existem no webhook atual
      birthdate: null,

      bio: c.bio ?? null,
      website: c.website ?? null,

      city: c.city ?? null,
      state: c.state ?? null,

      // Não existem no webhook atual
      country: null,

      twitter: null,
      facebook: null,
      linkedin: null,

      tags: toText(c.tags),

      // Não existe no webhook atual
      extra_emails: null,

      // =============================================
      // LEGAL BASIS
      // Não vem nesse webhook
      // =============================================

      legal_basis_category: null,
      legal_basis_type: null,
      legal_basis_status: null,

      // =============================================
      // LINKS API
      // Não precisamos consultar novamente o contato
      // =============================================

      self_uuid_url: null,
      self_email_url: null,
      self_phone_url: null,

      events_url: null,
      funnel_url: null,

      // =============================================
      // DATAS
      // =============================================

      created_at:
        c.created_at ?? null,

      last_conversion_date:
        c.last_conversion?.created_at ??
        c.last_conversion?.content?.event_timestamp ??
        null,

      // =============================================
      // CAMPOS PERSONALIZADOS
      // Mapeados para as colunas atuais do Azure
      // =============================================

      cf_ja_e_cliente_demo:
        toText(cf["Já é cliente DEMO?"]),

      cf_ferramenta:
        toText(cf["Ferramenta"]),

      cf_procura:
        toText(cf["Procura"]),

      cf_origem_do_lead_legado:
        toText(cf["Origem do lead - Legado"]),

      cf_agendamento:
        toText(cf["Agendamento"]),

      cf_origem_do_lead:
        toText(cf["Origem lead"]),

      cf_mensagem:
        toText(cf["Mensagem"]),

      cf_qual_produto_da_demo_mais_te_interessou:
        toText(cf["Qual produto da DEMO mais te interessou?"]),

      cf_url_do_arquivo:
        toText(cf["URL do arquivo"]),

      cf_informacao_importante:
        null,

      cf_canal:
        toText(cf["Canal"]),

      cf_cargo:
        toText(cf["Cargo:*"]),

      cf_consultor_a:
        toText(cf["Responsável"]),

      cf_voce_ja_conhece_a_demo:
        toText(cf["Qual é o seu vínculo com a DEMO?"]),

      cf_obs:
        toText(cf["Obs"]),

      cf_segmentos:
        toText(cf["Segmentos"]),

      cf_totem_segmento:
        toText(cf["segmento"]),

      cf_hub_id_do_registro:
        toText(cf["Hub_Pipedrive"]),

      cf_observacao_hub:
        toText(cf["Observação - HUB"])

    }
  };
});
