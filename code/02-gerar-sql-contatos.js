const registros = $input.all().map(item => item.json);

if (registros.length === 0) {
  return [];
}

const json = JSON.stringify(registros)
  .replace(/'/g, "''");

const query = `
DECLARE @json NVARCHAR(MAX) = N'${json}';

;WITH RawData AS
(
    SELECT *
    FROM OPENJSON(@json)
    WITH
    (
        uuid NVARCHAR(100) '$.uuid',

        name NVARCHAR(500) '$.name',
        email NVARCHAR(500) '$.email',

        phone NVARCHAR(200) '$.phone',
        personal_phone NVARCHAR(200) '$.personal_phone',
        mobile_phone NVARCHAR(200) '$.mobile_phone',

        job_title NVARCHAR(500) '$.job_title',
        birthdate NVARCHAR(100) '$.birthdate',

        bio NVARCHAR(MAX) '$.bio',
        website NVARCHAR(MAX) '$.website',

        city NVARCHAR(500) '$.city',
        state NVARCHAR(300) '$.state',
        country NVARCHAR(300) '$.country',

        twitter NVARCHAR(MAX) '$.twitter',
        facebook NVARCHAR(MAX) '$.facebook',
        linkedin NVARCHAR(MAX) '$.linkedin',

        tags NVARCHAR(MAX) '$.tags',
        extra_emails NVARCHAR(MAX) '$.extra_emails',

        legal_basis_category NVARCHAR(500) '$.legal_basis_category',
        legal_basis_type NVARCHAR(500) '$.legal_basis_type',
        legal_basis_status NVARCHAR(500) '$.legal_basis_status',

        self_uuid_url NVARCHAR(MAX) '$.self_uuid_url',
        self_email_url NVARCHAR(MAX) '$.self_email_url',
        self_phone_url NVARCHAR(MAX) '$.self_phone_url',

        events_url NVARCHAR(MAX) '$.events_url',
        funnel_url NVARCHAR(MAX) '$.funnel_url',

        created_at NVARCHAR(100) '$.created_at',
        last_conversion_date NVARCHAR(100) '$.last_conversion_date',

        cf_ja_e_cliente_demo NVARCHAR(MAX) '$.cf_ja_e_cliente_demo',
        cf_ferramenta NVARCHAR(MAX) '$.cf_ferramenta',
        cf_procura NVARCHAR(MAX) '$.cf_procura',
        cf_origem_do_lead_legado NVARCHAR(MAX) '$.cf_origem_do_lead_legado',
        cf_agendamento NVARCHAR(MAX) '$.cf_agendamento',
        cf_origem_do_lead NVARCHAR(MAX) '$.cf_origem_do_lead',
        cf_mensagem NVARCHAR(MAX) '$.cf_mensagem',

        cf_qual_produto_da_demo_mais_te_interessou
            NVARCHAR(MAX)
            '$.cf_qual_produto_da_demo_mais_te_interessou',

        cf_url_do_arquivo NVARCHAR(MAX) '$.cf_url_do_arquivo',
        cf_informacao_importante NVARCHAR(MAX) '$.cf_informacao_importante',
        cf_canal NVARCHAR(MAX) '$.cf_canal',
        cf_cargo NVARCHAR(MAX) '$.cf_cargo',
        cf_consultor_a NVARCHAR(MAX) '$.cf_consultor_a',
        cf_voce_ja_conhece_a_demo NVARCHAR(MAX) '$.cf_voce_ja_conhece_a_demo',
        cf_obs NVARCHAR(MAX) '$.cf_obs',
        cf_segmentos NVARCHAR(MAX) '$.cf_segmentos',
        cf_totem_segmento NVARCHAR(MAX) '$.cf_totem_segmento',
        cf_hub_id_do_registro NVARCHAR(MAX) '$.cf_hub_id_do_registro',
        cf_observacao_hub NVARCHAR(MAX) '$.cf_observacao_hub'
    )
),

SourceData AS
(
    SELECT
        TRY_CONVERT(UNIQUEIDENTIFIER, uuid) AS uuid,

        name,
        email,

        phone,
        personal_phone,
        mobile_phone,

        job_title,
        TRY_CONVERT(DATE, birthdate) AS birthdate,

        bio,
        website,

        city,
        state,
        country,

        twitter,
        facebook,
        linkedin,

        tags,
        extra_emails,

        legal_basis_category,
        legal_basis_type,
        legal_basis_status,

        self_uuid_url,
        self_email_url,
        self_phone_url,

        events_url,
        funnel_url,

        TRY_CONVERT(DATETIMEOFFSET(3), created_at)
            AS created_at,

        TRY_CONVERT(DATETIMEOFFSET(3), last_conversion_date)
            AS last_conversion_date,

        cf_ja_e_cliente_demo,
        cf_ferramenta,
        cf_procura,
        cf_origem_do_lead_legado,
        cf_agendamento,
        cf_origem_do_lead,
        cf_mensagem,
        cf_qual_produto_da_demo_mais_te_interessou,
        cf_url_do_arquivo,
        cf_informacao_importante,
        cf_canal,
        cf_cargo,
        cf_consultor_a,
        cf_voce_ja_conhece_a_demo,
        cf_obs,
        cf_segmentos,
        cf_totem_segmento,
        cf_hub_id_do_registro,
        cf_observacao_hub,

        ROW_NUMBER() OVER
        (
            PARTITION BY uuid
            ORDER BY
                TRY_CONVERT(
                    DATETIMEOFFSET(3),
                    last_conversion_date
                ) DESC
        ) AS rn

    FROM RawData
)

MERGE [Landing].[RD_Contacts] AS T

USING
(
    SELECT *
    FROM SourceData
    WHERE
        uuid IS NOT NULL
        AND rn = 1
) AS S

ON T.uuid = S.uuid

WHEN MATCHED THEN

UPDATE SET

    T.name = S.name,
    T.email = S.email,

    T.phone = S.phone,
    T.personal_phone = S.personal_phone,
    T.mobile_phone = S.mobile_phone,

    T.job_title = S.job_title,
    T.birthdate = S.birthdate,

    T.bio = S.bio,
    T.website = S.website,

    T.city = S.city,
    T.state = S.state,
    T.country = S.country,

    T.twitter = S.twitter,
    T.facebook = S.facebook,
    T.linkedin = S.linkedin,

    T.tags = S.tags,
    T.extra_emails = S.extra_emails,

    T.legal_basis_category = S.legal_basis_category,
    T.legal_basis_type = S.legal_basis_type,
    T.legal_basis_status = S.legal_basis_status,

    T.self_uuid_url = S.self_uuid_url,
    T.self_email_url = S.self_email_url,
    T.self_phone_url = S.self_phone_url,

    T.events_url = S.events_url,
    T.funnel_url = S.funnel_url,

    T.created_at = S.created_at,
    T.last_conversion_date = S.last_conversion_date,

    T.cf_ja_e_cliente_demo = S.cf_ja_e_cliente_demo,
    T.cf_ferramenta = S.cf_ferramenta,
    T.cf_procura = S.cf_procura,
    T.cf_origem_do_lead_legado = S.cf_origem_do_lead_legado,
    T.cf_agendamento = S.cf_agendamento,
    T.cf_origem_do_lead = S.cf_origem_do_lead,
    T.cf_mensagem = S.cf_mensagem,

    T.cf_qual_produto_da_demo_mais_te_interessou =
        S.cf_qual_produto_da_demo_mais_te_interessou,

    T.cf_url_do_arquivo = S.cf_url_do_arquivo,
    T.cf_informacao_importante = S.cf_informacao_importante,
    T.cf_canal = S.cf_canal,
    T.cf_cargo = S.cf_cargo,
    T.cf_consultor_a = S.cf_consultor_a,

    T.cf_voce_ja_conhece_a_demo =
        S.cf_voce_ja_conhece_a_demo,

    T.cf_obs = S.cf_obs,
    T.cf_segmentos = S.cf_segmentos,
    T.cf_totem_segmento = S.cf_totem_segmento,
    T.cf_hub_id_do_registro = S.cf_hub_id_do_registro,
    T.cf_observacao_hub = S.cf_observacao_hub,

    T.dt_atualizacao = SYSUTCDATETIME()

WHEN NOT MATCHED THEN

INSERT
(
    uuid,

    name,
    email,

    phone,
    personal_phone,
    mobile_phone,

    job_title,
    birthdate,

    bio,
    website,

    city,
    state,
    country,

    twitter,
    facebook,
    linkedin,

    tags,
    extra_emails,

    legal_basis_category,
    legal_basis_type,
    legal_basis_status,

    self_uuid_url,
    self_email_url,
    self_phone_url,

    events_url,
    funnel_url,

    created_at,
    last_conversion_date,

    cf_ja_e_cliente_demo,
    cf_ferramenta,
    cf_procura,
    cf_origem_do_lead_legado,
    cf_agendamento,
    cf_origem_do_lead,
    cf_mensagem,
    cf_qual_produto_da_demo_mais_te_interessou,
    cf_url_do_arquivo,
    cf_informacao_importante,
    cf_canal,
    cf_cargo,
    cf_consultor_a,
    cf_voce_ja_conhece_a_demo,
    cf_obs,
    cf_segmentos,
    cf_totem_segmento,
    cf_hub_id_do_registro,
    cf_observacao_hub
)

VALUES
(
    S.uuid,

    S.name,
    S.email,

    S.phone,
    S.personal_phone,
    S.mobile_phone,

    S.job_title,
    S.birthdate,

    S.bio,
    S.website,

    S.city,
    S.state,
    S.country,

    S.twitter,
    S.facebook,
    S.linkedin,

    S.tags,
    S.extra_emails,

    S.legal_basis_category,
    S.legal_basis_type,
    S.legal_basis_status,

    S.self_uuid_url,
    S.self_email_url,
    S.self_phone_url,

    S.events_url,
    S.funnel_url,

    S.created_at,
    S.last_conversion_date,

    S.cf_ja_e_cliente_demo,
    S.cf_ferramenta,
    S.cf_procura,
    S.cf_origem_do_lead_legado,
    S.cf_agendamento,
    S.cf_origem_do_lead,
    S.cf_mensagem,
    S.cf_qual_produto_da_demo_mais_te_interessou,
    S.cf_url_do_arquivo,
    S.cf_informacao_importante,
    S.cf_canal,
    S.cf_cargo,
    S.cf_consultor_a,
    S.cf_voce_ja_conhece_a_demo,
    S.cf_obs,
    S.cf_segmentos,
    S.cf_totem_segmento,
    S.cf_hub_id_do_registro,
    S.cf_observacao_hub
);

SELECT
    @@ROWCOUNT AS total_processado,
    SYSUTCDATETIME() AS dt_processamento;
`;

return [
  {
    json: {
      quantidade: registros.length,
      query
    }
  }
];
