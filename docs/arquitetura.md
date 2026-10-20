# Arquitetura

## Entrada → processamento → saída

**Entrada:** body.leads do webhook. **Processamento:** normalização em JavaScript, serialização de lotes, SQL, convergência e autenticação Microsoft. **Saída:** contatos/eventos persistidos e uma solicitação de atualização do dataset Power BI.

| Etapa | Responsabilidade |
| --- | --- |
| Webhook | Receber o lote enviado pelo RD Station |
| Ramo contatos | Normalizar dados cadastrais e gerar SQL por UUID |
| Ramo eventos | Interpretar a conversão recebida e gerar SQL por chave de evento |
| Microsoft SQL | Executar os lotes de persistência |
| Merge | Combinar por posição os itens devolvidos pelos dois ramos |
| Wait | Aguardar antes de pedir atualização |
| Obter Token | Solicitar access token Microsoft com client credentials |
| Refresh | Solicitar atualização do dataset Power BI |

Os ramos são caminhos separados do grafo; não se afirma execução física simultânea. O grafo não fornece uma transação única para as duas gravações.

O painel complementar lê as tabelas por Importação e aplica DAX e HTML dinâmico. A automação escreve no SQL e solicita refresh; não envia cards HTML ao Power BI.
