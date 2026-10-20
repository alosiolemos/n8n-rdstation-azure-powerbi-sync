# Configuração em ambiente de teste

## 1. Importar sem executar integrações

Baixe workflows/rdstation-azure-powerbi.template.json e utilize a importação de arquivo do n8n. O fluxo está inativo e quatro nós externos estão desabilitados. A importação ainda não foi testada em uma instância n8n nesta preparação.

Os typeVersion dos nós foram preservados; isso não informa a versão exata da instalação n8n de origem.

## 2. Preparar os dados

Use examples/webhook-demo.json em uma simulação local do webhook. O envelope do exemplo corresponde ao $json recebido pelos nós de normalização: body.leads. Ao enviar uma requisição HTTP ao webhook, o corpo deve ser o objeto interno body, pois o Webhook do n8n já cria o envelope body.

Os campos de demonstração precisam ser ajustados aos campos personalizados da sua conta RD. O webhook público recebeu um novo caminho de demonstração. Configure autenticação e validação de origem adequadas ao seu ambiente antes de ativar.

## 3. Preparar Azure SQL

Crie um banco de demonstração com tabelas Landing.RD_Contacts e Landing.RD_Eventos_Contato compatíveis com os SQLs gerados. O schema, os tipos e os índices únicos precisam ser definidos por você: o DDL original não foi recebido. Configure credencial Microsoft SQL privada e vincule aos dois nós SQL.

Teste primeiro cada ramo com dados fictícios. Só então habilite os nós SQL no ambiente de demonstração.

## 4. Configurar Power BI

Informe CONFIGURE_TENANT_ID, CONFIGURE_CLIENT_ID, CONFIGURE_WORKSPACE_ID e CONFIGURE_DATASET_ID nos locais correspondentes. Configure o segredo de forma privada, preferencialmente via credenciais ou mecanismo de segredos da sua instalação. O marcador CONFIGURE_CLIENT_SECRET_PRIVATELY não é uma credencial funcional.

Valide o app Microsoft e as permissões do workspace. Habilite token e refresh apenas para seu dataset de teste. Verifique o status de atualização no serviço, porque o fluxo não monitora a conclusão.

## 5. Cenários de aceitação

- Reenvio do mesmo evento não deve criar uma segunda linha de evento segundo sua chave.
- Um mesmo UUID com nova conversão deve preservar o novo evento e atualizar o contato.
- Um lote sem conversões deve ser testado para observar a saída do Merge.
- Uma falha SQL não deve ser interpretada como sincronização completa.
- Um refresh rejeitado não deve ser registrado como sucesso somente porque a execução terminou.

Esses testes no n8n/SQL/Power BI não foram executados nesta preparação; os testes locais de JavaScript estão documentados em validacao.md.
