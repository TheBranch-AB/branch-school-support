// Google Apps Script receiver for The Branch School Facilities.
// Deploy as Web app: Execute as Me; access Anyone.
// Script Properties: GITHUB_TOKEN = fine-grained token with Contents: Read & Write
// for only TheBranch-AB/branch-school-support.
// Public anonymous submission endpoints can be spammed. Do not store private data.
const OWNER='TheBranch-AB', REPO='branch-school-support';
function doPost(e){
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{
    const data=JSON.parse(e.postData.contents);
    if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(data.date)||!Array.isArray(data.sections)||data.sections.length!==10)throw Error('Invalid checklist');
    if(JSON.stringify(data).length>32000)throw Error('Report too large');
    if(!/^[a-f0-9-]{36}$/.test(data.id||''))throw Error('Invalid report ID');
    // Limit file content to expected form fields to avoid writing arbitrary objects.
    const safe={id:data.id,date:data.date,initials:String(data.initials||'').slice(0,30),notes:String(data.notes||'').slice(0,3000),
      submittedAt:new Date().toISOString(),
      sections:data.sections.map(s=>({title:String(s.title||'').slice(0,100),tasks:(s.tasks||[]).slice(0,60).map(t=>({task:String(t.task||'').slice(0,350),complete:t.complete===true}))}))};
    const path='reports/'+safe.date+'/'+safe.id+'.json';
    const token=PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
    if(!token)throw Error('Missing GITHUB_TOKEN');
    const url='https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+path;
    const payload={message:'Save facilities checklist '+safe.date,content:Utilities.base64Encode(Utilities.newBlob(JSON.stringify(safe,null,2)).getBytes()),branch:'main'};
    const response=UrlFetchApp.fetch(url,{method:'put',muteHttpExceptions:true,
      headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},
      contentType:'application/json',payload:JSON.stringify(payload)});
    const code=response.getResponseCode();
    if(code!==201)throw Error('GitHub rejected report: '+code+' '+response.getContentText().slice(0,300));
    return ContentService.createTextOutput('saved');
  }catch(err){console.error(err);return ContentService.createTextOutput('error');}
  finally{lock.releaseLock();}
}