# error.md

```bash
Rebuilt steps bundle 104ms
Rebuilt workflow bundle 12ms
 GET / 200 in 3.2s (compile: 1986ms, proxy.ts: 86ms, render: 1123ms)
 GET /api/auth/session 200 in 1114ms (compile: 1095ms, render: 19ms)
 GET / 200 in 492ms (compile: 2ms, proxy.ts: 3ms, render: 487ms)
 GET / 200 in 193ms (compile: 3ms, proxy.ts: 4ms, render: 187ms)
 GET /diary/cmilsxzui000jsbom8gfmw7uu 200 in 1506ms (compile: 729ms, proxy.ts: 3ms, render: 774ms)
 GET / 200 in 156ms (compile: 1698µs, proxy.ts: 3ms, render: 151ms)
 GET /creation 200 in 467ms (compile: 302ms, proxy.ts: 2ms, render: 163ms)
Error [NeonDbError]: null value in column "updatedAt" of relation "Diary" violates not-null constraint
    at async POST (app/api/diary/create/route.ts:50:3)
  48 |          }
  49 |
> 50 |          await db.insert(diaries).values({
     |          ^
  51 |                  id: randomUUID(),
  52 |                  title: "",
  53 |                  date, {
  severity: 'ERROR',
  code: '23502',
  detail: 'Failing row contains (983a4b77-7d45-4910-b144-b3b2acd48e2a, , 2025-11-30 15:59:37.851, ・ジャパンカップを見に行った\n' +
    '・府中競馬場は..., null, f, 104263134803068175465, 2025-11-30 15:59:38.59, null, DRAFT, 470a3842-9ca1-430a-bd89-2bb1e7aa482a).',
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: 'public',
  table: 'Diary',
  column: 'updatedAt',
  dataType: undefined,
  constraint: undefined,
  file: 'execMain.c',
  line: '1991',
  routine: 'ExecConstraints',
  sourceError: undefined
}
 POST /api/diary/create 200 in 1911ms (compile: 947ms, proxy.ts: 4ms, render: 960ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 322ms (compile: 193ms, proxy.ts: 4ms, render: 124ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 143ms (compile: 1315µs, proxy.ts: 3ms, render: 139ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 125ms (compile: 1243µs, proxy.ts: 1972µs, render: 122ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 124ms (compile: 1251µs, proxy.ts: 1704µs, render: 121ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 141ms (compile: 1184µs, proxy.ts: 2ms, render: 138ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 131ms (compile: 1149µs, proxy.ts: 3ms, render: 127ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 153ms (compile: 1042µs, proxy.ts: 1752µs, render: 150ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 148ms (compile: 1113µs, proxy.ts: 1771µs, render: 145ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 133ms (compile: 1115µs, proxy.ts: 1880µs, render: 130ms)
 POST /api/internal/ai/stream-start 200 in 20.9s (compile: 731ms, proxy.ts: 3ms, render: 20.2s)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 136ms (compile: 1043µs, proxy.ts: 1790µs, render: 133ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 132ms (compile: 1033µs, proxy.ts: 1616µs, render: 129ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 121ms (compile: 1032µs, proxy.ts: 1624µs, render: 119ms)
 GET /api/workflow/status?workflowId=470a3842-9ca1-430a-bd89-2bb1e7aa482a 202 in 124ms (compile: 1112µs, proxy.ts: 1783µs, render: 121ms)
 GET / 200 in 166ms (compile: 2ms, proxy.ts: 2ms, render: 162ms)
 GET / 200 in 241ms (compile: 1859µs, proxy.ts: 3ms, render: 236ms)
 GET /api/auth/session 200 in 12ms (compile: 5ms, render: 7ms)
 GET / 200 in 149ms (compile: 1308µs, proxy.ts: 4ms, render: 144ms)
 GET / 200 in 176ms (compile: 1731µs, proxy.ts: 1737µs, render: 173ms)
 GET / 200 in 206ms (compile: 1188µs, proxy.ts: 1861µs, render: 203ms)
 GET /creation 200 in 139ms (compile: 3ms, proxy.ts: 1891µs, render: 134ms)
 GET /api/auth/session 200 in 24ms (compile: 16ms, render: 8ms)
Error [NeonDbError]: null value in column "updatedAt" of relation "Diary" violates not-null constraint
    at async POST (app/api/diary/create/route.ts:50:3)
  48 |          }
  49 |
> 50 |          await db.insert(diaries).values({
     |          ^
  51 |                  id: randomUUID(),
  52 |                  title: "",
  53 |                  date, {
  severity: 'ERROR',
  code: '23502',
  detail: 'Failing row contains (daf1148d-e92f-4e73-9187-ff35eda34a33, , 2025-11-30 16:00:31.59, ・ジャパンカップを見に行った, null, f, 104263134803068175465, 2025-11-30 16:00:32.357, null, DRAFT, c0f1541c-02b8-4672-8684-68b8eafb69b3).',
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: 'public',
  table: 'Diary',
  column: 'updatedAt',
  dataType: undefined,
  constraint: undefined,
  file: 'execMain.c',
  line: '1991',
  routine: 'ExecConstraints',
  sourceError: undefined
}
 POST /api/diary/create 200 in 955ms (compile: 10ms, proxy.ts: 5ms, render: 940ms)
 GET /api/workflow/status?workflowId=c0f1541c-02b8-4672-8684-68b8eafb69b3 202 in 128ms (compile: 3ms, proxy.ts: 3ms, render: 123ms)
 GET /api/workflow/status?workflowId=c0f1541c-02b8-4672-8684-68b8eafb69b3 202 in 132ms (compile: 1049µs, proxy.ts: 2ms, render: 129ms)
 GET /api/workflow/status?workflowId=c0f1541c-02b8-4672-8684-68b8eafb69b3 202 in 159ms (compile: 1066µs, proxy.ts: 1757µs, render: 156ms)
 POST /api/internal/ai/stream-start 200 in 6.2s (compile: 4ms, proxy.ts: 4ms, render: 6.2s)
Error [NeonDbError]: null value in column "updatedAt" of relation "Diary" violates not-null constraint
    at async POST (app/api/diary/create/route.ts:50:3)
  48 |          }
  49 |
> 50 |          await db.insert(diaries).values({
     |          ^
  51 |                  id: randomUUID(),
  52 |                  title: "",
  53 |                  date, {
  severity: 'ERROR',
  code: '23502',
  detail: 'Failing row contains (19e8384c-62f1-438c-967b-6497366bd07c, , 2025-11-30 16:00:37.766, ・ジャパンカップを見に行った, null, f, 104263134803068175465, 2025-11-30 16:00:38.236, null, DRAFT, 6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7).',
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: 'public',
  table: 'Diary',
  column: 'updatedAt',
  dataType: undefined,
  constraint: undefined,
  file: 'execMain.c',
  line: '1991',
  routine: 'ExecConstraints',
  sourceError: undefined
}
 POST /api/diary/create 200 in 630ms (compile: 8ms, proxy.ts: 2ms, render: 621ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 133ms (compile: 934µs, proxy.ts: 1506µs, render: 131ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 122ms (compile: 1043µs, proxy.ts: 2ms, render: 118ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 115ms (compile: 1037µs, proxy.ts: 1722µs, render: 112ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 136ms (compile: 1072µs, proxy.ts: 1737µs, render: 133ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 128ms (compile: 1143µs, proxy.ts: 1692µs, render: 125ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 116ms (compile: 1101µs, proxy.ts: 1596µs, render: 114ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 116ms (compile: 1210µs, proxy.ts: 1816µs, render: 113ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 137ms (compile: 1006µs, proxy.ts: 1522µs, render: 135ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 144ms (compile: 1043µs, proxy.ts: 3ms, render: 140ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 127ms (compile: 1087µs, proxy.ts: 2ms, render: 124ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 227ms (compile: 1276µs, proxy.ts: 3ms, render: 222ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 127ms (compile: 1529µs, proxy.ts: 3ms, render: 122ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 131ms (compile: 684µs, proxy.ts: 2ms, render: 128ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 134ms (compile: 1012µs, proxy.ts: 1580µs, render: 131ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 133ms (compile: 1951µs, proxy.ts: 1944µs, render: 129ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 134ms (compile: 1577µs, proxy.ts: 3ms, render: 130ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 144ms (compile: 1138µs, proxy.ts: 3ms, render: 140ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 108ms (compile: 1100µs, proxy.ts: 1541µs, render: 106ms)
 POST /api/internal/ai/stream-start 200 in 47s (compile: 1888µs, proxy.ts: 1721µs, render: 47s)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 126ms (compile: 1048µs, proxy.ts: 1901µs, render: 123ms)
 GET /api/auth/session 200 in 13ms (compile: 5ms, render: 8ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 135ms (compile: 1007µs, proxy.ts: 1620µs, render: 132ms)
 GET /api/workflow/status?workflowId=6a30c6a2-c6bd-4fa4-a5c1-8188f6cdfea7 202 in 115ms (compile: 969µs, proxy.ts: 1821µs, render: 112ms)
 GET /creation 200 in 190ms (compile: 3ms, proxy.ts: 1985µs, render: 185ms)
 GET /api/auth/session 200 in 9ms (compile: 4ms, render: 5ms
```
