// Testes locais sem rede e sem executar SQL. Execute: node tests/validar-codigo.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = path.resolve(__dirname, '..');
const load = name => fs.readFileSync(path.join(base, 'code', name), 'utf8');
const run = (name, json, items = []) => new Function('$json', '$input', load(name))(json, { all: () => items });
const results = [];
function test(name, fn) { fn(); results.push({ teste: name, resultado: 'passou' }); }
const sample = JSON.parse(fs.readFileSync(path.join(base, 'examples/webhook-demo.json'), 'utf8'));
test('Sintaxe dos quatro nós Code', () => {
  for (const file of fs.readdirSync(path.join(base, 'code'))) new Function('$json', '$input', load(file));
});
test('Contato: arrays, campos opcionais e data de conversão', () => {
  const items = run('01-normalizar-contatos.js', sample);
  assert.equal(items.length, 1);
  assert.equal(items[0].json.tags, 'demo, portfolio');
  assert.equal(items[0].json.birthdate, null);
  assert.equal(items[0].json.last_conversion_date, '2026-01-02T12:00:00Z');
  assert.equal(items[0].json.cf_ja_e_cliente_demo, 'Não');
});
test('Entrada sem leads produz listas vazias', () => {
  assert.deepEqual(run('01-normalizar-contatos.js', {}), []);
  assert.deepEqual(run('03-normalizar-eventos.js', {}), []);
});
test('Eventos: repetição da mesma chave é removida na execução', () => {
  const lead = sample.body.leads[0];
  const items = run('03-normalizar-eventos.js', { body: { leads: [lead, structuredClone(lead)] } });
  assert.equal(items.length, 1);
  assert.equal(items[0].json.event_identifier, 'formulario-demo');
  assert.match(items[0].json.event_key_source, /CONVERSION\|formulario-demo\|2026-01-02/);
  const payload = JSON.parse(items[0].json.payload_json);
  assert.equal(payload.traffic_medium, 'cpc');
  assert.equal(items[0].json.traffic_medium, undefined);
});
test('Eventos: novo timestamp gera outra chave', () => {
  const first = sample.body.leads[0], second = structuredClone(first);
  second.last_conversion.created_at = '2026-01-03T12:00:00Z';
  assert.equal(run('03-normalizar-eventos.js', { body: { leads: [first, second] } }).length, 2);
});
test('Eventos sem UUID ou sem identificador são descartados', () => {
  const noId = structuredClone(sample.body.leads[0]); noId.uuid = '';
  const noEvent = structuredClone(sample.body.leads[0]); delete noEvent.last_conversion.content.conversion_identifier;
  assert.equal(run('03-normalizar-eventos.js', { body: { leads: [noId, noEvent] } }).length, 0);
});
test('Geradores SQL: lotes vazios não geram consulta', () => {
  assert.deepEqual(run('02-gerar-sql-contatos.js', {}, []), []);
  assert.deepEqual(run('04-gerar-sql-eventos.js', {}, []), []);
});
test('SQL de contatos: JSON com apóstrofo preservado e MERGE por UUID', () => {
  const items = run('01-normalizar-contatos.js', sample);
  items[0].json.name = "Contato O'Brien";
  const generated = run('02-gerar-sql-contatos.js', {}, items);
  assert.equal(generated[0].json.quantidade, 1);
  const sql = generated[0].json.query;
  const embedded = sql.match(/DECLARE @json NVARCHAR\(MAX\) = N'([\s\S]*?)';/)[1].replace(/''/g, "'");
  assert.equal(JSON.parse(embedded)[0].name, "Contato O'Brien");
  assert.match(sql, /ROW_NUMBER\(\)/);
  assert.match(sql, /ON T\.uuid = S\.uuid/);
});
test('SQL de eventos: hash e MERGE por event_key', () => {
  const items = run('03-normalizar-eventos.js', sample);
  const generated = run('04-gerar-sql-eventos.js', {}, items);
  assert.equal(generated[0].json.quantidade, 1);
  assert.match(generated[0].json.query, /HASHBYTES\([\s\S]*?'SHA2_256'/);
  assert.match(generated[0].json.query, /ON T\.event_key = S\.event_key/);
});
test('Template: estrutura, proteção de integrações e destinos das conexões', () => {
  const template = JSON.parse(fs.readFileSync(path.join(base, 'workflows/rdstation-azure-powerbi.template.json'), 'utf8'));
  assert.equal(template.active, false);
  assert.deepEqual(template.pinData, {});
  assert.equal(template.nodes.length, 16);
  assert.equal(template.nodes.filter(n => n.disabled).length, 4);
  assert.equal(template.nodes.filter(n => n.credentials).length, 0);
  const names = new Set(template.nodes.map(n => n.name));
  for (const [source, groups] of Object.entries(template.connections)) {
    assert.ok(names.has(source));
    for (const outputs of Object.values(groups)) for (const links of outputs) for (const link of links) assert.ok(names.has(link.node));
  }
  const merge = template.nodes.find(n => n.name === 'Merge');
  assert.equal(merge.parameters.combineBy, 'combineByPosition');
  const wait = template.nodes.find(n => n.name === 'Wait');
  assert.equal(wait.parameters.amount, 30);
  assert.equal(wait.parameters.unit, 'seconds');
  assert.equal(template.nodes.find(n => n.name === 'Refresh - PAINEL').onError, 'continueRegularOutput');
});
const report = { escopo: 'Testes JavaScript e estrutura JSON; sem n8n, SQL ou APIs reais', total: results.length, testes: results };
fs.writeFileSync(path.join(__dirname, 'resultados-testes.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
