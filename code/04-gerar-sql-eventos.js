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
        contact_uuid NVARCHAR(100) '$.contact_uuid',
        contact_email NVARCHAR(500) '$.contact_email',

        event_type NVARCHAR(100) '$.event_type',
        event_family NVARCHAR(100) '$.event_family',
        event_identifier NVARCHAR(500) '$.event_identifier',
        event_timestamp NVARCHAR(100) '$.event_timestamp',

        event_key_source NVARCHAR(MAX) '$.event_key_source',

        traffic_source NVARCHAR(1000) '$.traffic_source',
        traffic_medium NVARCHAR(255) '$.traffic_medium',
        traffic_campaign NVARCHAR(1000) '$.traffic_campaign',

        payload_json NVARCHAR(MAX) '$.payload_json'
    )
),

SourceData AS
(
    SELECT
        TRY_CONVERT(UNIQUEIDENTIFIER, contact_uuid) AS contact_uuid,

        LOWER(LTRIM(RTRIM(contact_email))) AS contact_email,

        event_type,
        event_family,
        event_identifier,

        TRY_CONVERT(
            DATETIMEOFFSET(3),
            event_timestamp
        ) AS event_timestamp,

        traffic_source,
        traffic_medium,
        traffic_campaign,

        HASHBYTES(
            'SHA2_256',
            event_key_source
        ) AS event_key,

        payload_json

    FROM RawData
)

MERGE [Landing].[RD_Eventos_Contato] AS T

USING
(
    SELECT *
    FROM SourceData
    WHERE
        contact_uuid IS NOT NULL
        AND event_timestamp IS NOT NULL
) AS S

ON T.event_key = S.event_key

WHEN MATCHED THEN
UPDATE SET

    T.contact_uuid = S.contact_uuid,
    T.contact_email = S.contact_email,

    T.event_type = S.event_type,
    T.event_family = S.event_family,
    T.event_identifier = S.event_identifier,
    T.event_timestamp = S.event_timestamp,

    T.traffic_source = S.traffic_source,
    T.traffic_medium = S.traffic_medium,
    T.traffic_campaign = S.traffic_campaign,

    T.payload_json = S.payload_json,

    T.dt_atualizacao = SYSUTCDATETIME()

WHEN NOT MATCHED THEN

INSERT
(
    contact_uuid,
    contact_email,

    event_type,
    event_family,
    event_identifier,
    event_timestamp,

    traffic_source,
    traffic_medium,
    traffic_campaign,

    payload_json,
    event_key
)

VALUES
(
    S.contact_uuid,
    S.contact_email,

    S.event_type,
    S.event_family,
    S.event_identifier,
    S.event_timestamp,

    S.traffic_source,
    S.traffic_medium,
    S.traffic_campaign,

    S.payload_json,
    S.event_key
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
