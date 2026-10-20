# Validação

## Preparação e leitura estática

Foi verificada a existência dos 16 nós e dos destinos das conexões; preservadas as ligações dos dois ramos até o Merge e a sequência Wait → token → refresh. Confirmados JSON público válido, ausência de referências a credenciais, pinData vazio, estado inativo e quatro integrações desabilitadas.

Os quatro corpos JavaScript foram verificados sintaticamente e executados com payloads fictícios no ambiente local. O relatório dos testes está em [resultados-testes.json](../tests/resultados-testes.json) e o teste pode ser reproduzido com [validar-codigo.cjs](../tests/validar-codigo.cjs).

## O que os testes não demonstram

Não houve importação no n8n, execução do Merge/Wait pelos motores do n8n, chamada a API, conexão SQL ou refresh Power BI. SQL gerado foi inspecionado como texto; não foi executado por um motor SQL. Não foram validados DDL, índices únicos, permissões, concorrência ou duração operacional.

Documentação de referência para comportamento do Merge e unidade padrão do Wait: [Merge](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/) e [Wait.node.ts](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Wait/Wait.node.ts). A execução real deve ser validada na versão da sua instância.
