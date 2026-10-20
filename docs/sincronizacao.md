# Merge e sincronização

## O que foi configurado

O nó Merge usa mode: combine e combineBy: combineByPosition, com options vazio. Sua entrada 0 recebe a saída SQL de contatos; sua entrada 1 recebe a saída SQL de eventos. A combinação é por posição, não por UUID. A [documentação oficial do Merge](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/) explica esse modo de combinação.

Cada gerador monta um lote, e cada SQL termina em um SELECT de resumo. O desenho espera combinar esses resultados antes de seguir. Sem itens em um ramo, ou com quantidades diferentes, o resultado precisa ser testado: combinar por posição não cria uma confirmação de sucesso por registro.

## Três responsabilidades distintas

| Componente | Responsabilidade |
| --- | --- |
| MERGE SQL | Correspondência para atualizar/inserir registros |
| Merge do n8n | Convergência dos resultados dos ramos |
| Wait | Intervalo antes de solicitar refresh |

O Merge não faz rollback, não valida a consistência de todo o banco e não elimina duplicados por si só. Os nomes dos campos dos dois resumos podem coincidir; a saída não deve ser tratada como soma confiável dos volumes sem separar as métricas de cada ramo.

## Espera

O export contém amount: 30 e Wait na versão 1.1, sem unidade explícita. O [código oficial do Wait](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Wait/Wait.node.ts) define segundos como padrão para versões posteriores à 1. No template público, unit: seconds e resume: timeInterval foram explicitados para tornar o intervalo legível.

Uma espera de 30 segundos é local à execução. Não agrupa solicitações entre execuções, não garante conclusão de outro refresh e não substitui tratamento de concorrência.
