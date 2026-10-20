# Persistência e controle de duplicidade

## Dois mecanismos de MERGE SQL

| Entidade | Correspondência no banco | Tratamento do lote |
| --- | --- | --- |
| Contatos | T.uuid = S.uuid | ROW_NUMBER por UUID e seleção rn = 1 |
| Eventos | T.event_key = S.event_key | Set no normalizador e SHA2_256 no SQL |

Os geradores serializam os itens em JSON, escapam apóstrofos para o literal SQL e usam OPENJSON com schema explícito. TRY_CONVERT interpreta tipos; MERGE atualiza correspondentes ou insere novos registros. Ao final, o SQL retorna total_processado e dt_processamento.

## Chave do evento

```text
UUID | tipo do evento | identificador | timestamp
             ↓
        SHA2_256 no SQL
             ↓
     comparação com event_key
```

Reenviar o mesmo evento, com a mesma representação da chave, deve encontrar o registro existente. O hash reconhece igualdade da chave técnica; não compara semanticamente todo o payload.

## Limites que precisam ser considerados

- O Set existe somente naquela execução; não é memória global nem substitui uma chave no banco.
- Índices únicos e DDL não foram fornecidos. Concorrência e integridade precisam ser validadas antes de afirmar ausência global de duplicados.
- Timestamps equivalentes em formatos diferentes podem gerar chaves diferentes, pois a chave textual é montada antes da conversão SQL.
- Contatos que chegam atrasados podem sobrescrever dados mais recentes: o MATCHED não compara a data atual com a do destino.
- Campos ausentes podem sobrescrever valores com null no UPDATE do contato.
- Em empate de data, ROW_NUMBER não fornece desempate adicional no código recebido.
- As gravações de contatos e eventos não compartilham uma transação explícita no workflow.

Esses pontos não foram alterados na publicação. Evoluções possíveis incluem índices únicos, controle de concorrência, atualização condicionada à data e comandos parametrizados ou procedures com JSON como parâmetro.

Os arquivos em code são corpos de nós n8n; a consulta é gerada em tempo de execução. Não é fornecido um script DDL ou SQL pronto para executar isoladamente.
