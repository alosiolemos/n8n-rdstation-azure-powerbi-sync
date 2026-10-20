# Inventário dos nós

Foram identificados 16 nós: quatro Code, dois Microsoft SQL, dois HTTP Request, um Webhook, um Merge, um Wait e cinco Sticky Notes.

| Nó | Tipo | Versão do nó | Estado na publicação |
| --- | --- | --- | --- |
| Normalizar Contatos | code | 2 | Preservado |
| Gerar SQL | code | 2 | Preservado |
| Sticky Note | stickyNote | 1 | Preservado |
| rd_contacts_azure | webhook | 2.1 | Preservado |
| Sticky Note1 | stickyNote | 1 | Preservado |
| Sticky Note3 | stickyNote | 1 | Preservado |
| Insert - SQL AZURE - Contatos | microsoftSql | 1.1 | Desabilitado |
| Normalizar Eventos | code | 2 | Preservado |
| Gerar SQL - Lote | code | 2 | Preservado |
| Insert - SQL AZURE - Contatos eventos | microsoftSql | 1.1 | Desabilitado |
| Sticky Note2 | stickyNote | 1 | Preservado |
| Merge | merge | 3.2 | Preservado |
| Wait | wait | 1.1 | Preservado |
| Sticky Note4 | stickyNote | 1 | Preservado |
| Refresh - PAINEL | httpRequest | 4.4 | Desabilitado |
| Obter Token | httpRequest | 4.4 | Desabilitado |

## Código extraído

| Arquivo | Nó correspondente |
| --- | --- |
| [01-normalizar-contatos.js](../code/01-normalizar-contatos.js) | Normalizar Contatos |
| [02-gerar-sql-contatos.js](../code/02-gerar-sql-contatos.js) | Gerar SQL |
| [03-normalizar-eventos.js](../code/03-normalizar-eventos.js) | Normalizar Eventos |
| [04-gerar-sql-eventos.js](../code/04-gerar-sql-eventos.js) | Gerar SQL - Lote |

Os nomes de nós foram preservados, inclusive um espaço final em Gerar SQL - Lote, porque as conexões e expressões podem depender deles. IDs internos dos nós foram regenerados.
