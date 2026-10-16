import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
for(const [name,args,message] of [
 ['fixture traversal rejected before staging',['--fixture','--slug','../escape'],'invalid rehearsal arguments'],
 ['unknown fixture case rejected before staging',['--fixture','--case','unknown'],'invalid rehearsal arguments'],
 ['negative cases require explicit fixture mode',['--case','invalid-source'],'negative cases require fixture']
])test(name,()=>{
 const r=spawnSync(process.execPath,['scripts/dryrun-stage.mjs',...args],{encoding:'utf8',timeout:15000});
 assert.equal(r.status,1);assert.ok((r.stdout+r.stderr).includes(message));
});
