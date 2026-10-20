# Preparação pública

- Template reconstruído com nós, conexões e uma lista permitida de configurações.
- active: false e pinData vazio.
- Referências a credenciais Microsoft SQL removidas.
- Client ID, client secret, tenant, workspace e dataset substituídos por marcadores.
- Dados de leads fixados, metadados de execução, IDs do ambiente e identificadores de webhook originais não incluídos.
- IDs dos nós regenerados e caminho do webhook substituído por demonstração.
- Marcas e campos específicos generalizados de forma consistente.
- Cinco notas de tela reescritas para explicar o fluxo público.
- Wait explicitado como 30 segundos.
- Dois nós SQL e dois HTTP Request desabilitados.
- executionOrder fixado como v1 no template; a publicação não depende de metadados externos do original.

O export original contém um valor inválido dentro de pinData e não passa pelo parser JSON integral. Os blocos nodes e connections foram lidos separadamente, sem corrigir ou copiar dados fixados. O template reconstruído é JSON válido.

O arquivo original permaneceu intocado. O template não é uma cópia conectada ao ambiente de origem e não inclui tabelas, permissões ou dados reais.
