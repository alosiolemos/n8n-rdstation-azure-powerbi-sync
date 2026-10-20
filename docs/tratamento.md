# Tratamento de dados

## Contatos

O nó Normalizar Contatos percorre body.leads. Preserva UUID, nome, e-mail, telefones, datas e campos personalizados. A função toText trata arrays e objetos: listas viram texto separado por vírgulas; objetos viram JSON. Campos ausentes recebem null.

A data de última conversão prioriza last_conversion.created_at e usa um campo do conteúdo como alternativa. O código não faz uma nova consulta de contato à API RD nessa etapa: trabalha com o webhook recebido.

O SQL usa TRY_CONVERT para UUID e datas e ROW_NUMBER particionado por UUID, ordenado pela última conversão. Registros sem UUID válido são descartados da fonte do MERGE.

## Eventos

- Normaliza UUID e e-mail com trim e caixa baixa.
- Utiliza lead.last_conversion; sem conversão, o lead não gera evento nesse ramo.
- Busca tipo, família e identificador no evento CDP original, conteúdo e alternativas.
- Prioriza o timestamp externo da conversão.
- Preserva o payload original quando disponível; caso contrário, monta um payload com os campos recebidos.
- Descarta eventos sem UUID, identificador ou timestamp.
- Usa um Set para remover chaves repetidas na execução.

No lote SQL, TRY_CONVERT descarta UUID/timestamp inválidos antes da persistência. No contato, a normalização não transforma o UUID em caixa baixa; a conversão SQL para UNIQUEIDENTIFIER fornece sua representação tipada.

## Tráfego e campos ausentes

O normalizador de eventos emite traffic_source no nível principal e armazena outros campos no payload_json. O SQL também procura traffic_medium e traffic_campaign no nível principal; no código recebido esses campos não são emitidos ali e podem chegar nulos. O painel utiliza o payload para complementar a classificação. Essa diferença foi documentada, sem alterar silenciosamente a implementação.

Os campos específicos da organização foram generalizados de forma consistente no template e no código. Para usar seus dados, adapte o mapeamento de campos personalizados.
