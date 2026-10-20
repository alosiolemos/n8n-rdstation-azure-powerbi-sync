# Autenticação Microsoft e refresh

O nó Obter Token envia client_id, client_secret, grant_type e scope ao endpoint Microsoft de token. O fluxo usa grant_type client_credentials. O token retornado alimenta a autorização da requisição de refresh.

No template, tenant, app, segredo, workspace e dataset são marcadores. Nenhuma credencial real é distribuída. Use credenciais privadas do n8n ou um gerenciador de segredos; não publique um JSON preenchido com client_secret.

## Sequência

```text
Gravações SQL → Merge → Wait → token → POST /groups/{workspace}/datasets/{dataset}/refreshes
```

O dataset do painel usa Importação. Os dados gravados no SQL precisam ser lidos por um refresh concluído antes de integrar o cache do Power BI. A chamada HTTP solicita a operação; o export não contém polling para acompanhar sua conclusão.

O nó Refresh possui onError: continueRegularOutput no original e no template. Portanto, o workflow pode continuar pela saída regular mesmo quando a requisição falha. Uma execução que chega ao fim não comprova atualização bem-sucedida.

## Para configurar

Validar acesso da aplicação ao workspace, permissões e configurações do serviço para o cenário. Confirmar capacidade, limites de refresh, conectividade SQL e monitoramento. Este case não promete eliminar limites de atualização, operar em tempo real ou funcionar indefinidamente sem manutenção.

O tempo de aproximadamente 60 segundos que observei depende do ambiente e da etapa considerada; a espera isolada não comprova a duração completa.

Token e refresh permanecem desabilitados na distribuição pública.
