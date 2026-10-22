/* NovelOS plugin - generated file, do not edit directly */
"use strict";var W=Object.defineProperty;var Ft=Object.getOwnPropertyDescriptor;var It=Object.getOwnPropertyNames;var $t=Object.prototype.hasOwnProperty;var _t=(n,r)=>{for(var t in r)W(n,t,{get:r[t],enumerable:!0})},Ot=(n,r,t,e)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of It(r))!$t.call(n,s)&&s!==t&&W(n,s,{get:()=>r[s],enumerable:!(e=Ft(r,s))||e.enumerable});return n};var Dt=n=>Ot(W({},"__esModule",{value:!0}),n);var Gt={};_t(Gt,{default:()=>B});module.exports=Dt(Gt);var V=require("obsidian");var Z=require("obsidian");function m(n,r){var t,e;return(e=(t=n.metadataCache.getFileCache(r))==null?void 0:t.frontmatter)!=null?e:{}}function g(n,r){return n.vault.getMarkdownFiles().filter(t=>m(n,t).type===r)}function b(n){return n?Array.isArray(n)?n.map(r=>String(r)):[String(n)]:[]}function x(n){let r=n.match(/^\[\[([^\]|]+)/);return r?r[1]:n}function I(n){if(!n.startsWith("---"))return n;let r=n.indexOf(`
---`,3);return r===-1?n:n.slice(r+4).replace(/^\s*\n/,"")}function $(n){return I(n).replace(/\s/g,"").length}var A="novelos-home",_=class extends Z.ItemView{constructor(r){super(r)}getViewType(){return A}getDisplayText(){return"Creative Partner Home"}getIcon(){return"home"}async onOpen(){this.registerEvent(this.app.metadataCache.on("changed",()=>this.render())),this.registerEvent(this.app.vault.on("delete",()=>this.render())),this.registerEvent(this.app.vault.on("rename",()=>this.render())),this.render()}openFile(r){this.app.workspace.openLinkText(r,"",!1)}renderLinkList(r,t,e){if(t.length===0){r.createEl("p",{text:e,cls:"novelos-empty"});return}let s=r.createEl("ul");for(let a of t){let c=s.createEl("li").createEl("a",{text:a.label,href:"#"});c.onclick=l=>{l.preventDefault(),this.openFile(a.path)}}}async render(){let r=this.containerEl.children[1];r.empty(),r.createEl("h2",{text:"Creative Partner"});let t=g(this.app,"core_problem")[0],e=g(this.app,"end_state")[0],s=r.createDiv({cls:"novelos-section"});if(s.createEl("h3",{text:"Core Problem"}),t){let d=m(this.app,t);this.renderLinkList(s,[{path:t.path,label:d.title||t.basename}],"")}else s.createEl("p",{text:"(\u672A\u8BBE\u5B9A\uFF0C\u89C1 00_Core/Core Problem.md)",cls:"novelos-empty"});if(s.createEl("h3",{text:"End State"}),e){let d=m(this.app,e);this.renderLinkList(s,[{path:e.path,label:d.title||e.basename}],"")}else s.createEl("p",{text:"(\u672A\u8BBE\u5B9A\uFF0C\u89C1 00_Core/End State.md)",cls:"novelos-empty"});let a=g(this.app,"chapter").sort((d,P)=>d.basename.localeCompare(P.basename)),i=await Promise.all(a.map(d=>this.app.vault.cachedRead(d).then($))),c=i.reduce((d,P)=>d+P,0),l=r.createDiv({cls:"novelos-section"});l.createEl("h3",{text:`Chapters (${a.length}) \xB7 \u5171 ${c} \u5B57`}),this.renderLinkList(l,a.map((d,P)=>{let X=m(this.app,d);return{path:d.path,label:`${X.title||d.basename} [${X.status||"no status"}] \xB7 ${i[P]} \u5B57`}}),"\u8FD8\u6CA1\u6709 Chapter\uFF0C\u53BB 01_Chapters/ \u65B0\u5EFA\u4E00\u4E2A\u5F00\u59CB\u5199\u3002");let o=g(this.app,"scene"),p=r.createDiv({cls:"novelos-section"});p.createEl("h3",{text:`Scenes (${o.length})`}),this.renderLinkList(p,o.map(d=>({path:d.path,label:m(this.app,d).title||d.basename})),"\u6682\u65E0\u8DE8\u7AE0\u8282\u7684 Scene \u5361\u7247\uFF0C\u89C1 08_Scenes/README.md\u3002");let h=g(this.app,"question").filter(d=>m(this.app,d).status!=="resolved"),u=r.createDiv({cls:"novelos-section"});u.createEl("h3",{text:`Open Questions (${h.length})`}),this.renderLinkList(u,h.map(d=>({path:d.path,label:m(this.app,d).title||d.basename})),"\u6682\u65E0\u672A\u89E3\u51B3\u7684 Question\u3002");let f=g(this.app,"unknown"),v=r.createDiv({cls:"novelos-section"});v.createEl("h3",{text:`Unknowns (${f.length})`}),this.renderLinkList(v,f.map(d=>({path:d.path,label:m(this.app,d).title||d.basename})),"\u6682\u65E0 Unknown\u3002");let k=g(this.app,"editor_feedback"),Q=r.createDiv({cls:"novelos-section"});Q.createEl("h3",{text:`Editor Feedback (${k.length})`}),this.renderLinkList(Q,k.map(d=>({path:d.path,label:d.basename})),"\u6682\u65E0 Editor Feedback\u3002")}async onClose(){}};var tt=require("obsidian");var S="novelos-chapter-navigator",O=class extends tt.ItemView{constructor(r){super(r)}getViewType(){return S}getDisplayText(){return"Chapter Navigator"}getIcon(){return"list-ordered"}async onOpen(){this.registerEvent(this.app.metadataCache.on("changed",()=>this.render())),this.registerEvent(this.app.vault.on("delete",()=>this.render())),this.registerEvent(this.app.vault.on("rename",()=>this.render())),this.render()}async render(){let r=this.containerEl.children[1];r.empty(),r.createEl("h2",{text:"Chapter Navigator"});let t=g(this.app,"chapter").sort((c,l)=>c.basename.localeCompare(l.basename));if(t.length===0){r.createEl("p",{text:"\u8FD8\u6CA1\u6709 Chapter\uFF0C\u53BB 01_Chapters/ \u65B0\u5EFA\u4E00\u4E2A\u5F00\u59CB\u5199\u3002",cls:"novelos-empty"});return}let e=await Promise.all(t.map(c=>this.app.vault.cachedRead(c).then($))),s=r.createEl("table",{cls:"novelos-scene-table"}),a=s.createEl("tr");a.createEl("th",{text:"#"}),a.createEl("th",{text:"Title"}),a.createEl("th",{text:"Status"}),a.createEl("th",{text:"POV"}),a.createEl("th",{text:"\u5B57\u6570"}),t.forEach((c,l)=>{let o=m(this.app,c),p=s.createEl("tr");p.createEl("td",{text:String(l+1)});let u=p.createEl("td").createEl("a",{text:o.title||c.basename,href:"#"});u.onclick=f=>{f.preventDefault(),this.app.workspace.openLinkText(c.path,"",!1)},p.createEl("td",{text:o.status||""}),p.createEl("td",{text:o.pov||""}),p.createEl("td",{text:String(e[l])})});let i=e.reduce((c,l)=>c+l,0);r.createEl("p",{text:`\u5168\u4E66\u5171 ${t.length} \u7AE0 / ${i} \u5B57`,cls:"novelos-empty"})}async onClose(){}};var et=require("obsidian");var T="novelos-story-graph",D=class extends et.ItemView{constructor(r){super(r)}getViewType(){return T}getDisplayText(){return"Story Graph"}getIcon(){return"git-fork"}async onOpen(){this.registerEvent(this.app.metadataCache.on("changed",()=>this.render())),this.registerEvent(this.app.vault.on("delete",()=>this.render())),this.registerEvent(this.app.vault.on("rename",()=>this.render())),this.render()}link(r,t,e){if(!e){r.createSpan({text:t});return}let s=r.createEl("a",{text:t,href:"#"});s.onclick=a=>{a.preventDefault(),this.app.workspace.openLinkText(e,"",!1)}}render(){var a,i;let r=this.containerEl.children[1];r.empty(),r.createEl("h2",{text:"Story Graph"}),r.createEl("p",{text:"\u6309 Chapter \u5206\u7EC4\u663E\u793A\u5173\u8054\u7684\u4EBA\u7269 / \u5B9E\u4F53 / Question\uFF1B\u4E0B\u65B9\u53E6\u5217 Scene \u7D22\u5F15\u8DE8\u7AE0\u8282\u7684\u5173\u8054\u3002",cls:"novelos-empty"});let t=g(this.app,"chapter").sort((c,l)=>c.basename.localeCompare(l.basename)),e=new Map(g(this.app,"entity").map(c=>[c.basename,c])),s=new Map(g(this.app,"question").map(c=>[c.basename,c]));t.length===0&&r.createEl("p",{text:"\u8FD8\u6CA1\u6709 Chapter\u3002",cls:"novelos-empty"});for(let c of t){let l=m(this.app,c),o=r.createDiv({cls:"novelos-graph-block"}),p=o.createEl("h4");this.link(p,l.title||c.basename,c.path);let h=[...b(l.characters),...b(l.entities)].map(x),u=l.question?x(l.question):null,f=o.createEl("ul");if(u){let v=f.createEl("li");v.createSpan({text:"Question: "}),this.link(v,u,(a=s.get(u))==null?void 0:a.path)}for(let v of h){let k=f.createEl("li");k.createSpan({text:"Entity: "}),this.link(k,v,(i=e.get(v))==null?void 0:i.path)}!u&&h.length===0&&f.createEl("li",{text:"(\u6682\u65E0\u5173\u8054)",cls:"novelos-empty"})}this.renderSceneIndex(r,Lt(t))}renderSceneIndex(r,t){var s;let e=g(this.app,"scene").sort((a,i)=>a.basename.localeCompare(i.basename));if(r.createEl("h3",{text:"Scenes\uFF08\u8DE8\u7AE0\u8282\u5173\u8054\uFF09"}),e.length===0){r.createEl("p",{text:"\u8FD8\u6CA1\u6709 Scene \u5361\u7247\uFF0C\u89C1 08_Scenes/README.md\u3002",cls:"novelos-empty"});return}for(let a of e){let i=m(this.app,a),c=r.createDiv({cls:"novelos-graph-block"}),l=c.createEl("h4");this.link(l,i.title||a.basename,a.path);let o=b(i.chapters).map(x),p=c.createEl("ul");o.length===0&&p.createEl("li",{text:"(\u672A\u5173\u8054\u7AE0\u8282)",cls:"novelos-empty"});for(let h of o){let u=p.createEl("li");u.createSpan({text:"Chapter: "}),this.link(u,h,(s=t.get(h))==null?void 0:s.path)}}}async onClose(){}};function Lt(n){return new Map(n.map(r=>[r.basename,{path:r.path,title:r.basename}]))}var C=require("obsidian");var rt=require("obsidian"),j="07_Editor";function J(n){return new Date(n).toLocaleString("zh-CN",{hour12:!1})}async function U(n,r){n.vault.getAbstractFileByPath(j)||await n.vault.createFolder(j);let t=`${j}/${r.basename}.md`,e=n.vault.getAbstractFileByPath(t);if(e instanceof rt.TFile)return e;let s=["---","type: editor_feedback",`chapter: "[[${r.basename}]]"`,"---","",`# AI Editor Log: ${r.basename}`,"","> AI Editor \u5BF9\u8BDD\u4E0E\u53CD\u9988\u7684\u81EA\u52A8\u5B58\u6863\uFF0C\u4F9B\u56DE\u770B\u601D\u8DEF\u7528\u3002AI Editor \u4E0D\u4F1A\u4FEE\u6539\u6B63\u6587\uFF0C\u8FD9\u4EFD\u65E5\u5FD7\u4E5F\u4E00\u6837\uFF0C\u53EA\u8FFD\u52A0\u4E0D\u6539\u5199\u3002",""].join(`
`);return n.vault.create(t,s)}async function st(n,r,t,e){let s=await U(n,r),a=`
## ${J(e.timestamp)} \xB7 Chat

**You:** ${t}

**AI Editor:** ${e.text}
`;await n.vault.append(s,a)}async function nt(n,r,t){let e=await U(n,r),s=t.severity==="warning"?"\u26A0":"\u2139",a=`
## ${J(t.timestamp)} \xB7 Feedback: ${t.category}

${s} ${t.summary}

${t.detail}
`;await n.vault.append(e,a)}async function at(n,r,t){let e=await U(n,r),s=`
## ${J(Date.now())} \xB7 Resolved: ${t.category}

"${t.summary}" \u5DF2\u6807\u8BB0\u4E3A\u5DF2\u89E3\u51B3\u3002
`;await n.vault.append(e,s)}var ot=require("obsidian");var ct="00_Core/Writing Profile.md",it=3,q="<!-- novelos:writing-profile:end-of-auto-section -->";async function lt(n){var l;let r=n.vault.getAbstractFileByPath(ct);if(!(r instanceof ot.TFile))return{file:null,state:{counts:{},authorNotes:""}};let t=(l=n.metadataCache.getFileCache(r))==null?void 0:l.frontmatter,e={};if(t&&typeof t.pattern_counts=="string")try{e=JSON.parse(t.pattern_counts)}catch(o){e={}}let s=await n.vault.cachedRead(r),a=I(s),i=a.indexOf(q),c=i>=0?a.slice(i+q.length).replace(/^\s*\n/,""):"";return{file:r,state:{counts:e,authorNotes:c}}}function Mt(n){let r=Object.entries(n.counts).sort((i,c)=>c[1]-i[1]),t=r.filter(([,i])=>i>=it).map(([i,c])=>`- **${i}**\uFF08\u7D2F\u8BA1\u51FA\u73B0 ${c} \u6B21\uFF09\u2014 \u8FD9\u4E0D\u662F\u67D0\u4E00\u573A\u620F\u7684\u5076\u7136\u95EE\u9898\uFF0C\u662F\u4F60\u53CD\u590D\u51FA\u73B0\u7684\u5199\u4F5C\u6A21\u5F0F\uFF0C\u4E0B\u6B21\u52A8\u7B14\u524D\u53EF\u4EE5\u5148\u60F3\u4E00\u4E0B\u8FD9\u4E00\u70B9\u3002`),e=["# Writing Profile","",'> \u7531 AI Editor \u81EA\u52A8\u7EF4\u62A4\uFF1A\u8BB0\u5F55\u4F60\u5728\u591A\u4E2A\u7AE0\u8282\u91CC\u53CD\u590D\u51FA\u73B0\u7684\u5199\u4F5C\u95EE\u9898\u7C7B\u522B\u3002\u6BCF\u6B21 AI Editor \u5206\u6790\u6216\u5BF9\u8BDD\u90FD\u4F1A\u628A\u8FD9\u4EFD\u6587\u4EF6\u8BFB\u56DE\u53BB\u5F53\u4E0A\u4E0B\u6587\uFF0C\u6240\u4EE5\u5373\u4F7F\u6362\u4E86 AI \u540E\u53F0\uFF0C\u6216\u8005\u91CD\u542F\u4E86 Obsidian\uFF0C\u5B83\u90FD\u4E0D\u4F1A"\u5931\u5FC6"\u3002',"> \u300C\u53CD\u590D\u51FA\u73B0\u7684\u6A21\u5F0F\u300D\u548C\u300C\u539F\u59CB\u8BA1\u6570\u300D\u4E24\u6BB5\u662F\u81EA\u52A8\u751F\u6210\u7684\uFF0C\u4E0B\u6B21\u5206\u6790\u4F1A\u6574\u6BB5\u8986\u76D6\uFF0C\u522B\u624B\u52A8\u6539\u8FD9\u4E24\u6BB5\u3002\u4E0B\u9762 `\u624B\u8BB0` \u533A\u4F60\u53EF\u4EE5\u968F\u4FBF\u5199\uFF0CAI Editor \u4E0D\u4F1A\u8986\u76D6\u5B83\u2014\u2014\u5199\u5728\u8FD9\u91CC\u7684\u4E1C\u897F\u4F1A\u88AB\u5F53\u6210\u4F60\u7ED9 AI \u7684\u6301\u7EED\u6027\u8BF4\u660E\u3002","","## \u53CD\u590D\u51FA\u73B0\u7684\u6A21\u5F0F","",t.length>0?t.join(`
`):`(\u6682\u65E0\u8FBE\u5230\u9608\u503C\u7684\u91CD\u590D\u6A21\u5F0F\u2014\u2014\u540C\u4E00\u7C7B\u95EE\u9898\u8981\u7D2F\u8BA1\u51FA\u73B0 ${it} \u6B21\u4EE5\u4E0A\u624D\u4F1A\u5217\u5728\u8FD9\u91CC\u3002)`,"","## \u539F\u59CB\u8BA1\u6570\uFF08\u8C03\u8BD5\u7528\uFF09","",r.length>0?r.map(([i,c])=>`- ${i}: ${c}`).join(`
`):"(\u6682\u65E0\u8BB0\u5F55)","",q,n.authorNotes||`
(\u8FD9\u91CC\u53EF\u4EE5\u5199\u4F60\u81EA\u5DF1\u7684\u89C2\u5BDF\u6216\u7ED9 AI \u7684\u957F\u671F\u8BF4\u660E\u3002)
`].join(`
`),s=JSON.stringify(n.counts).replace(/\\/g,"\\\\").replace(/"/g,'\\"');return`${["---","type: writing_profile",`updated: "${new Date().toISOString()}"`,`pattern_counts: "${s}"`,"---",""].join(`
`)}
${e}
`}async function pt(n){let{file:r}=await lt(n);if(!r)return"";let t=await n.vault.cachedRead(r);return I(t).trim()}async function ht(n,r){var a;if(r.length===0)return;let{file:t,state:e}=await lt(n);for(let i of r)e.counts[i.category]=((a=e.counts[i.category])!=null?a:0)+1;let s=Mt(e);t?await n.vault.modify(t,s):(n.vault.getAbstractFileByPath("00_Core")||await n.vault.createFolder("00_Core"),await n.vault.create(ct,s))}var F="novelos-editor-panel";function Rt(n){return new Date(n).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}var L=class extends C.ItemView{constructor(t,e){super(t);this.plugin=e;this.chapterFile=null;this.chatInput=""}get aiEditor(){return this.plugin.aiEditor}getViewType(){return F}getDisplayText(){return"AI Editor"}getIcon(){return"bot"}async onOpen(){this.registerEvent(this.app.workspace.on("active-leaf-change",()=>{this.chatInput="",this.render()})),await this.render()}currentChapterFile(){let t=this.app.workspace.getActiveFile();return t&&m(this.app,t).type==="chapter"?t:null}async render(){this.chapterFile=this.currentChapterFile();let t=this.containerEl.children[1];if(t.empty(),t.addClass("novelos-editor-panel"),t.createEl("h2",{text:"AI Editor"}),t.createEl("p",{text:"\u5206\u6790 \u2192 \u6307\u51FA\u95EE\u9898 \u2192 \u89E3\u91CA \u2192 \u7ED9\u51FA\u4FEE\u6539\u65B9\u5411\u3002AI Editor \u4E0D\u4F1A\u76F4\u63A5\u4FEE\u6539\u6B63\u6587\u3002",cls:"novelos-empty"}),t.createEl("p",{text:"\u5373\u4F7F\u4EBA\u5DE5\u667A\u80FD\u80FD\u591F\u751F\u6210\u4E07\u5343\u7B54\u6848\uFF0C\u4EBA\u7C7B\u4F9D\u7136\u62E5\u6709\u67D0\u79CD\u65E0\u6CD5\u88AB\u7A77\u5C3D\u7684\u5149\u3002\u8FD9\u79CD\u5149\uFF0C\u53EB\u4F5C\u521B\u610F\u3002",cls:"novelos-empty novelos-quote"}),this.renderUsageGuide(t),this.renderCurrentChapter(t),!this.chapterFile)return;let e=this.chapterFile.path;await this.renderChat(t,e),await this.renderFeedback(t,e),await this.renderHistory(t,e)}renderUsageGuide(t){let e=t.createEl("details",{cls:"novelos-section novelos-usage-guide"});e.createEl("summary",{text:"\u4F7F\u7528\u8BF4\u660E"});let s=e.createEl("ol");s.createEl("li",{text:"\u5148\u6253\u5F00\u4E00\u4E2A Chapter \u6587\u4EF6\uFF08\u5E26 type: chapter \u7684\u6B63\u6587\uFF09\u3002\u8FD9\u4E2A\u9762\u677F\u53EA\u5728\u6253\u5F00 Chapter \u65F6\u663E\u793A Chat / Feedback / History\uFF0C\u6CA1\u6253\u5F00\u65F6\u4E0B\u9762\u662F\u7A7A\u7684\u3002"}),s.createEl("li",{text:"Chat\uFF1A\u76F4\u63A5\u8DDF AI Editor \u804A\u3002\u5B83\u53EA\u8BFB\u5F53\u524D Chapter \u6B63\u6587 + \u4E00\u4EFD\u8DE8\u7AE0\u8282\u7D22\u5F15\uFF08\u7AE0\u8282\u5217\u8868\u3001\u672A\u89E3\u51B3 Question\u3001Scene \u5173\u8054\uFF09\u6765\u56DE\u590D\uFF0C\u4ECE\u4E0D\u4F1A\u6539\u4F60\u7684\u6B63\u6587\u3002"}),s.createEl("li",{text:"Analyze Current Chapter\uFF1A\u6309\u6210\u719F\u7684\u53D9\u4E8B\u65B9\u6CD5\u8BBA\u751F\u6210\u8BCA\u65AD\u5F0F\u53CD\u9988\u5361\u7247\uFF1B\u6BCF\u6761\u53CD\u9988\u53EF\u4EE5\u70B9 Discuss \u4E22\u8FDB Chat \u7EE7\u7EED\u804A\uFF0C\u6216 Mark resolved \u6807\u8BB0\u5DF2\u5904\u7406\u3002"}),s.createEl("li",{text:"\u5BF9\u8BDD\u548C\u53CD\u9988\u4F1A\u81EA\u52A8\u8BB0\u8FDB 07_Editor/ \u5BF9\u5E94\u6587\u4EF6\uFF0C\u65F6\u95F4\u7EBF\u80FD\u5728\u4E0B\u9762\u7684 Editor History \u91CC\u770B\u3002"}),s.createEl("li",{text:"\u60F3\u6362 AI \u540E\u53F0\uFF08Mock \u6D4B\u8BD5 / \u81EA\u5DF1\u914D\u7684 OpenAI \u517C\u5BB9\u30FBClaude\u30FBGemini\u30FB\u81EA\u5B9A\u4E49 API\uFF09\u2014\u2014\u53BB\u63D2\u4EF6\u8BBE\u7F6E\u91CC\u914D Provider\uFF0C\u914D\u5B8C\u91CD\u65B0\u6253\u5F00\u4E00\u6B21\u8FD9\u4E2A\u9762\u677F\u624D\u751F\u6548\u3002"})}renderCurrentChapter(t){let e=t.createDiv({cls:"novelos-section"});if(e.createEl("h3",{text:"Current Chapter"}),!this.chapterFile){e.createEl("p",{text:"(\u6CA1\u6709\u6253\u5F00\u7684 Chapter)",cls:"novelos-empty"});return}let s=m(this.app,this.chapterFile);e.createEl("p",{text:`${s.title||this.chapterFile.basename} [${s.status||"no status"}]`})}async renderChat(t,e){let s=t.createDiv({cls:"novelos-section"});s.createEl("h3",{text:"Chat"});let a=await this.aiEditor.getChatHistory(e),i=s.createDiv({cls:"novelos-chat-thread"});a.length===0&&i.createEl("p",{text:"\u8FD8\u6CA1\u6709\u5BF9\u8BDD\u3002",cls:"novelos-empty"});for(let p of a)this.renderChatMessage(i,p);let c=s.createDiv({cls:"novelos-chat-input-row"}),l=c.createEl("textarea",{cls:"novelos-chat-input"});l.value=this.chatInput,l.placeholder="\u548C AI Editor \u8BF4\u70B9\u4EC0\u4E48...",l.rows=2,l.oninput=()=>{this.chatInput=l.value};let o=c.createEl("button",{text:"Send"});o.onclick=async()=>{let p=this.chatInput.trim(),h=this.chapterFile;if(!(!p||!h)){o.disabled=!0,o.setText("Thinking...");try{let u=await this.aiEditor.sendMessage(e,p);await st(this.app,h,p,u),this.chatInput="",await this.render()}catch(u){new C.Notice(`Creative Partner: ${u instanceof Error?u.message:String(u)}`,1e4),o.disabled=!1,o.setText("Send")}}}}renderChatMessage(t,e){let s=t.createDiv({cls:`novelos-chat-message novelos-chat-${e.role}`});s.createEl("div",{text:e.role==="author"?"You":"AI Editor",cls:"novelos-chat-speaker"});let a=s.createEl("div",{cls:"novelos-chat-text"});for(let i of e.text.split(`
`))a.createEl("div",{text:i||" "})}async renderFeedback(t,e){let s=t.createDiv({cls:"novelos-section"}),a=s.createDiv({cls:"novelos-feedback-header"});a.createEl("h3",{text:"Editor Feedback"});let i=a.createEl("button",{text:"Analyze Current Chapter"});i.onclick=async()=>{let l=this.chapterFile;if(l){i.disabled=!0,i.setText("Analyzing...");try{let o=await this.aiEditor.analyzeChapter(e);for(let p of o)await nt(this.app,l,p);await ht(this.app,o),await this.render()}catch(o){new C.Notice(`Creative Partner: ${o instanceof Error?o.message:String(o)}`,1e4),i.disabled=!1,i.setText("Analyze Current Chapter")}}};let c=await this.aiEditor.getFeedback(e);if(c.length===0){s.createEl("p",{text:"\u6682\u65E0\u53CD\u9988\u3002\u70B9\u51FB\u4E0A\u65B9\u6309\u94AE\u751F\u6210\u4E00\u6B21\u5206\u6790\u3002",cls:"novelos-empty"});return}for(let l of c)this.renderFeedbackItem(s,e,l)}renderFeedbackItem(t,e,s){let a=t.createDiv({cls:`novelos-feedback-card novelos-feedback-${s.status}`}),i=a.createEl("div",{cls:"novelos-feedback-title"});i.createSpan({text:s.severity==="warning"?"\u26A0 ":"\u2139 "}),i.createSpan({text:s.category}),s.status==="resolved"&&i.createSpan({text:" (resolved)",cls:"novelos-empty"}),a.createEl("p",{text:s.summary});for(let p of s.detail.split(`
`))a.createEl("p",{text:p,cls:"novelos-empty"});let c=a.createDiv({cls:"novelos-feedback-actions"}),l=c.createEl("button",{text:"Discuss"});l.onclick=()=>{this.chatInput=`\u5173\u4E8E "${s.summary}"\uFF0C`,this.render()};let o=c.createEl("button",{text:"Mark resolved"});o.disabled=s.status==="resolved",o.onclick=async()=>{let p=this.chapterFile;if(p)try{await this.aiEditor.resolveFeedback(e,s.id),await at(this.app,p,s),await this.render()}catch(h){new C.Notice(`Creative Partner: ${h instanceof Error?h.message:String(h)}`,1e4)}}}async renderHistory(t,e){let s=t.createEl("details",{cls:"novelos-section novelos-history"});s.createEl("summary",{text:"Editor History"});let a=await this.aiEditor.getHistory(e);if(a.length===0){s.createEl("p",{text:"\u6682\u65E0\u5386\u53F2\u8BB0\u5F55\u3002",cls:"novelos-empty"});return}let i=s.createEl("ul");for(let c of a)this.renderHistoryEvent(i,c)}renderHistoryEvent(t,e){let s=t.createEl("li");s.createSpan({text:Rt(e.timestamp),cls:"novelos-history-time"}),s.createSpan({text:` ${e.label}`})}async onClose(){}};var dt=0;function E(n){return dt+=1,`${n}-${Date.now()}-${dt}`}var K=[{category:"Psychology",severity:"warning",summary:"\u8FD9\u91CC\u53EF\u80FD\u5B58\u5728\u201C\u76F4\u63A5\u89E3\u91CA\u60C5\u7EEA\u201D\u7684\u95EE\u9898\u3002",detail:`\u5EFA\u8BAE\u601D\u8003\uFF1A
\u4EBA\u7269\u6709\u6CA1\u6709\u53EF\u4EE5\u89C2\u5BDF\u5230\u7684\u884C\u4E3A\uFF1F\u5979\u7684\u8EAB\u4F53\u53D1\u751F\u4E86\u4EC0\u4E48\uFF1F\u5979\u6709\u6CA1\u6709\u8BD5\u56FE\u9690\u85CF\uFF1F`},{category:"Dialogue",severity:"info",summary:"\u8FD9\u6BB5\u5BF9\u8BDD\u4FE1\u606F\u91CF\u504F\u4F4E\uFF0C\u4E24\u53E5\u8BDD\u5728\u8BF4\u540C\u4E00\u4EF6\u4E8B\u3002",detail:`\u5EFA\u8BAE\u601D\u8003\uFF1A
\u80FD\u4E0D\u80FD\u8BA9\u5176\u4E2D\u4E00\u53E5\u8BDD\u540C\u65F6\u900F\u9732\u4E00\u4E2A\u65B0\u4FE1\u606F\u6216\u6001\u5EA6\uFF1F`},{category:"Continuity",severity:"warning",summary:"\u8FD9\u91CC\u63D0\u5230\u7684\u65F6\u95F4\uFF0C\u548C\u524D\u4E00\u573A\u620F\u7ED3\u5C3E\u7684\u65F6\u95F4\u70B9\u53EF\u80FD\u5BF9\u4E0D\u4E0A\u3002",detail:`\u5EFA\u8BAE\u68C0\u67E5\uFF1A
\u4E0A\u4E00\u573A\u620F\u7ED3\u675F\u65F6\u662F\u4EC0\u4E48\u65F6\u95F4\uFF1F\u8FD9\u573A\u620F\u5F00\u59CB\u65F6\u8FC7\u53BB\u4E86\u591A\u4E45\uFF1F`}],w=class{constructor(){this.chapters=new Map}state(r){let t=this.chapters.get(r);return t||(t={chat:[],feedback:[],history:[]},this.chapters.set(r,t),this.seed(t)),t}seed(r){let t=Date.now();r.chat.push({id:E("m"),role:"author",text:"\u6211\u89C9\u5F97\u8FD9\u91CC\u7684\u4EBA\u7269\u53CD\u5E94\u4E0D\u592A\u81EA\u7136\u3002",timestamp:t},{id:E("m"),role:"ai",text:`\u6211\u6682\u65F6\u4E0D\u4F1A\u4FEE\u6539\u6B63\u6587\u3002

\u6211\u8BA4\u4E3A\u8FD9\u91CC\u53EF\u80FD\u6D89\u53CA\u4EBA\u7269\u52A8\u673A\u3002
\u6211\u4EEC\u53EF\u4EE5\u5148\u68C0\u67E5\uFF1A
\u4E3A\u4EC0\u4E48\u4EBA\u7269\u5FC5\u987B\u5728\u8FD9\u4E2A\u65F6\u5019\u505A\u51FA\u8FD9\u4E2A\u53CD\u5E94\uFF1F`,timestamp:t+1});let e=K[0];r.feedback.push({id:E("fb"),status:"open",timestamp:t,...e}),r.history.push({id:E("h"),label:`${e.category} feedback`,timestamp:t})}pushHistory(r,t){this.state(r).history.push({id:E("h"),label:t,timestamp:Date.now()})}async analyzeChapter(r){let t=this.state(r),e=K[t.feedback.length%K.length],s={id:E("fb"),status:"open",timestamp:Date.now(),...e};return t.feedback=[s,...t.feedback],this.pushHistory(r,`${e.category} feedback`),[s]}async sendMessage(r,t){let e=this.state(r);e.chat.push({id:E("m"),role:"author",text:t,timestamp:Date.now()});let s={id:E("m"),role:"ai",text:Ht(t),timestamp:Date.now()};return e.chat.push(s),this.pushHistory(r,"Chat exchange"),s}async getFeedback(r){return this.state(r).feedback}async getHistory(r){return[...this.state(r).history].sort((t,e)=>e.timestamp-t.timestamp)}async getChatHistory(r){return this.state(r).chat}async resolveFeedback(r,t){let e=this.state(r).feedback.find(s=>s.id===t);e&&e.status!=="resolved"&&(e.status="resolved",this.pushHistory(r,`${e.category} marked resolved`))}recordAuthorEdit(r){let t=this.state(r),e=t.history[t.history.length-1];e&&e.label==="Author revised"&&Date.now()-e.timestamp<6e4||this.pushHistory(r,"Author revised")}};function Ht(n){return`\u6211\u6682\u65F6\u4E0D\u4F1A\u4FEE\u6539\u6B63\u6587\u3002

\u5173\u4E8E\u201C${n.length>40?`${n.slice(0,40)}...`:n}\u201D\uFF0C\u6211\u8BA4\u4E3A\u8FD9\u91CC\u53EF\u80FD\u6D89\u53CA\u4EBA\u7269\u52A8\u673A\u3002
\u6211\u4EEC\u53EF\u4EE5\u5148\u68C0\u67E5\uFF1A
\u4E3A\u4EC0\u4E48\u4EBA\u7269\u5FC5\u987B\u5728\u8FD9\u4E2A\u65F6\u5019\u505A\u51FA\u8FD9\u4E2A\u53CD\u5E94\uFF1F`}var At=require("obsidian");var ut=require("obsidian"),M=require("fs"),gt=require("path");var mt=`# Novel Editor

\u4F60\u662F\u4F5C\u8005\u7684 AI Editor / Writing Coach\uFF0C\u670D\u52A1\u4E8E Creative Partner \u8FD9\u5957\u521B\u4F5C\u966A\u7EC3\u7CFB\u7EDF\u3002

\u4F60\u7684\u804C\u8D23\u4E0D\u662F\u4EE3\u66FF\u4F5C\u8005\u5199\u5C0F\u8BF4\uFF0C\u800C\u662F\u5E2E\u52A9\u4F5C\u8005\u53D1\u73B0\u95EE\u9898\u3001\u7406\u89E3\u95EE\u9898\u3001\u5B66\u4E60\u5199\u4F5C\uFF0C\u5E76\u81EA\u5DF1\u5B8C\u6210\u4FEE\u6539\u3002

\u5373\u4F7F\u4F60\u80FD\u751F\u6210\u4E07\u5343\u79CD\u5199\u6CD5\uFF0C\u521B\u610F\u672C\u8EAB\u5C5E\u4E8E\u4F5C\u8005\u2014\u2014\u4F60\u7684\u4EF7\u503C\u662F\u8BA9\u4F5C\u8005\u770B\u6E05\u81EA\u5DF1\u5DF2\u7ECF\u5199\u51FA\u6765\u7684\u4E1C\u897F\uFF0C\u4E0D\u662F\u66FF\u4ED6\u60F3\u8C61\u4E00\u4E2A"\u66F4\u597D\u7684\u7248\u672C"\u3002

---

## 0. \u4F60\u7684\u5206\u6790\u5DE5\u5177\u4E0D\u662F\u51ED\u611F\u89C9\uFF0C\u800C\u662F\u4E24\u5957\u65B9\u6CD5\u8BBA

\u4F60\u7684\u8BCA\u65AD\u4E0D\u9760"\u8BFB\u8D77\u6765\u600E\u4E48\u6837"\u7684\u76F4\u89C9\uFF0C\u800C\u662F\u663E\u5F0F\u4F7F\u7528\u4E24\u5957\u5206\u6790\u5DE5\u5177\uFF1A

- **\u6545\u4E8B\u7ED3\u6784\u65B9\u6CD5\u8BBA**\uFF1A\u56DE\u7B54"\u4EBA\u7269\u548C\u4E8B\u4EF6\u600E\u6837\u7EC4\u7EC7\uFF0C\u624D\u80FD\u5F62\u6210\u6709\u529B\u91CF\u7684\u6545\u4E8B"\u2014\u2014\u7528\u5728\u4EBA\u7269\u6B32\u671B\u3001\u573A\u6B21\u7684\u4EF7\u503C\u53D8\u5316\u3001\u51B2\u7A81\u5347\u7EA7\u3001\u5371\u673A/\u9AD8\u6F6E/\u7ED3\u5C40\u3001\u7ED3\u6784\u8BCA\u65AD\u3002
- **\u53D9\u8FF0\u4FEE\u8F9E\u65B9\u6CD5\u8BBA**\uFF1A\u56DE\u7B54"\u4F5C\u8005\u600E\u6837\u901A\u8FC7\u53D9\u8FF0\u3001\u89C6\u89D2\u548C\u4FE1\u606F\u5B89\u6392\uFF0C\u5F71\u54CD\u8BFB\u8005\u5BF9\u6545\u4E8B\u7684\u7406\u89E3"\u2014\u2014\u7528\u5728\u53D9\u8FF0\u8005\u53EF\u9760\u6027\u3001\u53D9\u8FF0\u8DDD\u79BB\u3001\u4FE1\u606F\u63A7\u5236\u3001\u9690\u542B\u4F5C\u8005\u4E0E\u4EBA\u7269\u81EA\u6211\u8BC4\u4EF7\u662F\u5426\u4E00\u81F4\u3002

\u4E24\u5957\u65B9\u6CD5\u8BBA\u90FD**\u4E0D\u63D0\u4F9B\u5224\u65AD\u5C0F\u8BF4\u597D\u574F\u7684\u552F\u4E00\u6807\u51C6**\u3002\u5B83\u4EEC\u662F\u5206\u6790\u5DE5\u5177\uFF0C\u5E2E\u4F60\uFF1A

1. \u628A\u4E00\u4E2A\u6A21\u7CCA\u7684\u9605\u8BFB\u611F\u53D7\uFF0C\u53D8\u6210\u53EF\u4EE5\u8BF4\u6E05\u695A\u7684\u8BCA\u65AD\uFF1B
2. \u628A\u8BCA\u65AD\u53D8\u6210**\u591A\u4E2A**\u53EF\u4F9B\u4F5C\u8005\u9009\u62E9\u7684\u4FEE\u6539\u65B9\u5411\uFF0C\u800C\u4E0D\u662F\u4E00\u4E2A"\u6B63\u786E\u7B54\u6848"\uFF1B
3. \u533A\u5206"\u6587\u672C\u91CC\u786E\u5B9E\u5B58\u5728\u7684\u73B0\u8C61"\u3001"\u4F60\u7684\u89E3\u91CA"\u3001"\u5BF9\u4F5C\u8005\u610F\u56FE\u7684\u731C\u6D4B"\u4E09\u4E2A\u5C42\u6B21\uFF0C\u4E0D\u8981\u6DF7\u4E3A\u4E00\u8C08\u3002

\u7B2C 5\u30016 \u8282\u662F\u8FD9\u4E24\u5957\u5DE5\u5177\u7684\u5177\u4F53\u5185\u5BB9\uFF0C\u7B2C 7 \u8282\u662F\u628A\u5B83\u4EEC\u5408\u8D77\u6765\u7528\u7684\u516D\u6B65\u6CD5\uFF0C\u7B2C 8 \u8282\u662F\u53CD\u9988\u5FC5\u987B\u9075\u5B88\u7684\u8F93\u51FA\u683C\u5F0F\u3002\u8BFB\u5B8C\u8FD9\u51E0\u8282\u518D\u5F00\u59CB\u5206\u6790\u3002

---

## 1. \u6838\u5FC3\u539F\u5219

\u4F5C\u8005\u62E5\u6709\uFF1A

- \u6545\u4E8B
- \u4EBA\u7269
- \u5267\u60C5
- \u4E16\u754C
- \u8BED\u8A00
- \u6700\u7EC8\u4FEE\u6539\u6743

AI Editor \u62E5\u6709\uFF1A

- \u5206\u6790
- \u63D0\u95EE
- \u8BCA\u65AD
- \u89E3\u91CA
- \u63D0\u4F9B\u4FEE\u6539\u65B9\u5411
- \u68C0\u67E5\u524D\u540E\u903B\u8F91
- \u8BB0\u5F55\u91CD\u590D\u6027\u5199\u4F5C\u95EE\u9898

\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF1A

**\u4E0D\u8981\u76F4\u63A5\u4FEE\u6539\u5C0F\u8BF4\u6B63\u6587\u3002**

---

## 2. \u4F5C\u8005\u7684\u521B\u4F5C\u65B9\u5F0F

\u4F5C\u8005\u4E0D\u4F1A\u63D0\u524D\u8BBE\u8BA1\u5B8C\u6574\u5C0F\u8BF4\uFF0C\u4E5F\u4E0D\u4F1A\u63D0\u524D\u628A\u6BCF\u4E00\u7AE0\u62C6\u6210\u4E00\u4E2A\u4E2A\u573A\u666F\u6587\u4EF6\u3002

\u57FA\u672C\u65B9\u6CD5\uFF1A

Core Problem
\u2193
\u5047\u5B9A End State
\u2193
\u5F00\u59CB\u5199\uFF08\u4E00\u4E2A Chapter \u6587\u4EF6 = \u4E00\u7AE0\uFF0C\u6309\u5199\u4F5C\u8282\u594F\u8FDE\u7EED\u5199\u4E0B\u53BB\uFF0C\u7AE0\u5185\u60F3\u600E\u4E48\u5207\u573A\u666F\u5C31\u600E\u4E48\u5207\uFF09
\u2193
\u65B0\u4EBA\u7269 / \u65B0\u4E8B\u4EF6 / \u65B0\u7269\u54C1\u81EA\u7136\u51FA\u73B0
\u2193
\u5F62\u6210\u65B0\u7684 Question
\u2193
\u4EA7\u751F\u65B0\u7684\u56E0\u679C\u5173\u7CFB
\u2193
\u4E0D\u65AD\u63A8\u8FDB
\u2193
\u6700\u7EC8\u8D70\u5411 End State

\u56E0\u6B64\uFF0C\u4E0D\u8981\u8981\u6C42\u4F5C\u8005\u63D0\u524D\u5B9A\u4E49\uFF1A

- \u5B8C\u6574\u4EBA\u7269\u8868
- \u5B8C\u6574\u5267\u60C5
- \u5B8C\u6574\u65F6\u95F4\u7EBF
- \u5B8C\u6574\u7AE0\u8282\u7ED3\u6784
- \u6240\u6709\u4F0F\u7B14
- \u6BCF\u4E00\u573A\u620F\u7684\u5F52\u6863\u65B9\u5F0F\uFF08\u573A\u666F\u662F\u5426\u503C\u5F97\u5355\u72EC\u7528 \`08_Scenes/\` \u5361\u7247\u8DE8\u7AE0\u8282\u8FFD\u8E2A\uFF0C\u7531\u4F5C\u8005\u81EA\u5DF1\u5224\u65AD\uFF0C\u4E0D\u662F\u5FC5\u987B\u7684\uFF09

---

## 3. Unknown \u662F\u5408\u6CD5\u72B6\u6001

\u4E00\u4E2A\u65B0\u51FA\u73B0\u7684\u5143\u7D20\u53EF\u4EE5\u6682\u65F6\u6CA1\u6709\u4F5C\u7528\u3002

\u4F8B\u5982\uFF1A

- \u4E00\u4E2A\u964C\u751F\u4EBA
- \u4E00\u53EA\u732B
- \u4E00\u628A\u94A5\u5319
- \u4E00\u4E2A\u5730\u70B9
- \u4E00\u4E2A\u5947\u602A\u7684\u52A8\u4F5C
- \u4E00\u53E5\u8BDD
- \u4E00\u4E2A\u4E8B\u4EF6

\u5982\u679C\u6682\u65F6\u65E0\u6CD5\u5224\u65AD\u4F5C\u7528\uFF1A

\u4E0D\u8981\u8BA4\u4E3A\u5B83\u4E00\u5B9A\u662F\u9519\u8BEF\u3002

\u53EF\u4EE5\u6807\u8BB0\uFF1A

\`Unknown\`

\u6216\u8005\uFF1A

\`Unresolved\`

---

## 4. \u4F60\u80FD\u770B\u5230\u4EC0\u4E48\uFF08\u4E0A\u4E0B\u6587\u8FB9\u754C\uFF09

\u6BCF\u6B21\u8C03\u7528\uFF0C\u4F60\u62FF\u5230\u7684\u5185\u5BB9\u5206\u4E09\u5C42\uFF0C\u5C42\u6B21\u4E0D\u540C\uFF0C\u53EF\u4FE1\u5EA6\u4E5F\u4E0D\u540C\uFF1A

1. **\u5F53\u524D Chapter \u5168\u6587**\u2014\u2014\u9010\u5B57\u53EF\u4FE1\uFF0C\u8FD9\u662F\u5206\u6790\u7684\u4E3B\u4F53\u3002
2. **\u4E0A\u4E00\u7AE0\u5168\u6587**\uFF08\u5982\u679C\u5B58\u5728\uFF09\u2014\u2014\u9010\u5B57\u53EF\u4FE1\uFF0C\u7528\u6765\u5224\u65AD\u6700\u8FD1\u7684\u56E0\u679C\u8854\u63A5\u3002
3. **\u6545\u4E8B\u7D22\u5F15**\uFF08\u7AE0\u8282\u5217\u8868\u3001\u672A\u89E3\u51B3/\u5DF2\u89E3\u51B3 Question\u3001Character/Entity \u6458\u8981\u3001Scene \u8DE8\u7AE0\u8282\u5173\u8054\uFF09
   \u548C **Writing Profile**\u2014\u2014\u90FD\u662F\u538B\u7F29\u540E\u7684\u7ED3\u6784\u5316\u6458\u8981\uFF0C\u4E0D\u662F\u539F\u6587\u3002

\u66F4\u65E9\u7684\u7AE0\u8282\uFF08\u4E0D\u662F\u4E0A\u4E00\u7AE0\uFF09**\u4F60\u6CA1\u6709\u770B\u5230\u9010\u5B57\u539F\u6587**\uFF0C\u53EA\u6709\u7D22\u5F15\u91CC\u7684\u6807\u9898/\u72B6\u6001\u3002\u6D89\u53CA\u8FD9\u4E9B\u7AE0\u8282\u65F6\uFF1A

- \u53EF\u4EE5\u5F15\u7528\u7D22\u5F15\u91CC\u5199\u660E\u7684\u4E8B\u5B9E\uFF08\u6BD4\u5982"\u67D0 Question \u4ECD\u662F open"\uFF09\uFF1B
- \u4E0D\u8981\u51ED\u7A7A\u8865\u5168\u81EA\u5DF1\u6CA1\u770B\u5230\u7684\u5177\u4F53\u6587\u5B57\u3001\u53F0\u8BCD\u6216\u7EC6\u8282\uFF1B
- \u9700\u8981\u7528\u5230\u66F4\u65E9\u7AE0\u8282\u7684\u7EC6\u8282\u65F6\uFF0C\u8BDA\u5B9E\u5730\u8BF4"\u8FD9\u4E00\u70B9\u9700\u8981\u56DE\u770B\u7B2C N \u7AE0\u7684\u539F\u6587\u786E\u8BA4"\uFF0C\u800C\u4E0D\u662F\u7F16\u9020\u3002

---

## 5. \u5206\u6790\u5DE5\u5177\u4E00\uFF1A\u6545\u4E8B\u7ED3\u6784

### \u6280\u672F\u4E00\uFF1A\u4EBA\u7269\u6B32\u671B\u5206\u6790

\u533A\u5206\u4E09\u4E2A\u6982\u5FF5\uFF1A

- **\u5916\u5728\u76EE\u6807\uFF08Goal\uFF09**\uFF1A\u4EBA\u7269\u5177\u4F53\u60F3\u5F97\u5230\u4EC0\u4E48\u3002
- **\u5185\u5728\u9700\u6C42\uFF08Need\uFF09**\uFF1A\u4EBA\u7269\u53EF\u80FD\u9700\u8981\u8BA4\u8BC6\u3001\u6539\u53D8\u6216\u9762\u5BF9\u4EC0\u4E48\u3002
- **\u969C\u788D\uFF08Obstacle\uFF09**\uFF1A\u4EC0\u4E48\u963B\u6B62\u4EBA\u7269\u5B9E\u73B0\u76EE\u6807\u3002

\u5185\u5728\u9700\u6C42\u662F\u4F60\u7684\u5206\u6790\u5047\u8BBE\uFF0C\u4E0D\u4E00\u5B9A\u662F\u4F5C\u8005\u9884\u5148\u8BBE\u5B9A\u7684\u7B54\u6848\uFF0C\u4EBA\u7269\u4E5F\u4E0D\u4E00\u5B9A\u5FC5\u987B\u5728\u7ED3\u5C3E\u5B8C\u6210\u6210\u957F\u3002

\u64CD\u4F5C\u65B9\u6CD5\uFF1A\u8BFB\u5B8C\u4E00\u6BB5\uFF0C\u5148\u5199\u4E0B\u4EBA\u7269\u6B64\u523B\u60F3\u5F97\u5230\u4EC0\u4E48\uFF0C\u518D\u95EE\uFF1A\u4ED6\u4E3A\u4EC0\u4E48\u5F97\u4E0D\u5230\uFF1F\u4ED6\u4F1A\u91C7\u53D6\u4EC0\u4E48\u884C\u52A8\uFF1F

### \u6280\u672F\u4E8C\uFF1A\u4EF7\u503C\u53D8\u5316\u5206\u6790

"\u4EF7\u503C"\u6307\u80FD\u591F\u53D1\u751F\u53D8\u5316\u7684\u72B6\u6001\uFF1A\u4FE1\u4EFB/\u4E0D\u4FE1\u4EFB\u3001\u5B89\u5168/\u5371\u9669\u3001\u81EA\u7531/\u675F\u7F1A\u3001\u5C0A\u4E25/\u7F9E\u8FB1\u3001\u7231/\u758F\u79BB\u3001\u6210\u529F/\u5931\u8D25\u3002

| \u9879\u76EE | \u9700\u8981\u56DE\u7B54\u7684\u95EE\u9898 |
|---|---|
| \u573A\u666F\u5F00\u59CB | \u4EBA\u7269\u5904\u4E8E\u4EC0\u4E48\u72B6\u6001\uFF1F |
| \u89E6\u53D1\u4E8B\u4EF6 | \u4EC0\u4E48\u6253\u7834\u4E86\u539F\u6765\u7684\u72B6\u6001\uFF1F |
| \u4EBA\u7269\u884C\u52A8 | \u4EBA\u7269\u8BD5\u56FE\u6539\u53D8\u4EC0\u4E48\uFF1F |
| \u573A\u666F\u7ED3\u675F | \u4EC0\u4E48\u53D1\u751F\u4E86\u53D8\u5316\uFF1F |

\u5982\u679C\u4E00\u6BB5\u53EA\u662F\u91CD\u590D\u4EBA\u7269/\u8BFB\u8005\u5DF2\u7ECF\u77E5\u9053\u7684\u4E89\u8BBA\uFF0C\u4EF7\u503C\u6CA1\u6709\u53D8\u5316\uFF0C\u8FD9\u573A\u620F\u5C31\u503C\u5F97\u68C0\u67E5\u662F\u5426\u9700\u8981\u4FDD\u7559\u3001\u7F29\u77ED\uFF0C\u6216\u6362\u4E00\u4E2A\u529F\u80FD\u3002\u8FD9\u662F\u8BCA\u65AD\u65B9\u6CD5\uFF0C\u4E0D\u662F\u8981\u6C42\u6BCF\u573A\u620F\u90FD\u5FC5\u987B\u6709\u660E\u663E\u8F6C\u6298\u3002

### \u6280\u672F\u4E09\uFF1A\u9884\u671F\u4E0E\u7ED3\u679C\u7684\u843D\u5DEE

\u4EBA\u7269\u7684\u884C\u52A8\u5E26\u7740\u67D0\u79CD\u9884\u671F\uFF0C\u884C\u52A8\u7684\u7ED3\u679C\u53EF\u80FD\u4E0E\u9884\u671F\u4E0D\u540C\u2014\u2014\u8FD9\u79CD\u843D\u5DEE\u662F\u6545\u4E8B\u83B7\u5F97\u65B0\u53D1\u5C55\u52A8\u529B\u7684\u5E38\u89C1\u65B9\u5F0F\u3002

\u5206\u6790\u6B65\u9AA4\uFF1A\u4EBA\u7269\u539F\u672C\u671F\u5F85\u4EC0\u4E48\uFF1F\u4ED6\u91C7\u53D6\u4E86\u4EC0\u4E48\u884C\u52A8\uFF1F\u5B9E\u9645\u53D1\u751F\u4E86\u4EC0\u4E48\uFF1F\u4E3A\u4EC0\u4E48\u7ED3\u679C\u8D85\u51FA\u9884\u671F\uFF1F\u8FD9\u4E2A\u7ED3\u679C\u8FEB\u4F7F\u4ED6\u505A\u51FA\u4EC0\u4E48\u65B0\u9009\u62E9\uFF1F

\u8F6C\u6298\u4E0D\u5FC5\u60CA\u5929\u52A8\u5730\uFF0C\u4E00\u4E2A\u7EC6\u5C0F\u4F46\u6539\u53D8\u4EBA\u7269\u7406\u89E3\u7684\u7ED3\u679C\u4E5F\u8DB3\u591F\u3002

### \u6280\u672F\u56DB\uFF1A\u51B2\u7A81\u5347\u7EA7

\u771F\u6B63\u6709\u7528\u7684\u51B2\u7A81\u5347\u7EA7\uFF0C\u4E0D\u662F\u8BA9\u4EBA\u7269\u9047\u5230\u8D8A\u6765\u8D8A\u591A\u9EBB\u70E6\uFF0C\u800C\u662F\u8BA9\u4ED6**\u8D8A\u6765\u8D8A\u96BE\u4EE5\u7528\u539F\u6765\u7684\u65B9\u5F0F\u89E3\u51B3\u95EE\u9898**\u3002\u68C0\u67E5\uFF1A

- \u65B0\u95EE\u9898\u662F\u5426\u7531\u4EBA\u7269\u4E4B\u524D\u7684\u884C\u52A8\u5F15\u53D1\uFF1F
- \u969C\u788D\u662F\u5426\u6539\u53D8\u4E86\u4EBA\u7269\u539F\u6709\u7684\u9009\u62E9\uFF1F
- \u4EBA\u7269\u662F\u5426\u9700\u8981\u627F\u62C5\u66F4\u5927\u7684\u4EE3\u4EF7\uFF1F
- \u60C5\u8282\u662F\u5728\u53D1\u5C55\uFF0C\u8FD8\u662F\u5728\u91CD\u590D\u540C\u4E00\u79CD\u51B2\u7A81\uFF1F

### \u6280\u672F\u4E94\uFF1A\u5371\u673A\u3001\u9AD8\u6F6E\u4E0E\u7ED3\u5C40

\u4E09\u4E2A\u4E0D\u540C\u7684\u73AF\u8282\uFF1A

- **\u5371\u673A\uFF08Crisis\uFF09**\uFF1A\u4EBA\u7269\u5FC5\u987B\u9762\u5BF9\u4E00\u4E2A\u91CD\u8981\u9009\u62E9\u3002
- **\u9AD8\u6F6E\uFF08Climax\uFF09**\uFF1A\u4EBA\u7269\u4F5C\u51FA\u9009\u62E9\u3001\u91C7\u53D6\u884C\u52A8\uFF0C\u6838\u5FC3\u51B2\u7A81\u8FBE\u5230\u5173\u952E\u7ED3\u679C\u3002
- **\u7ED3\u5C40\uFF08Resolution\uFF09**\uFF1A\u8FD9\u4E2A\u7ED3\u679C\u5BF9\u4EBA\u7269\u3001\u5173\u7CFB\u3001\u6545\u4E8B\u4E16\u754C\u9020\u6210\u7684\u5F71\u54CD\u3002

\u9AD8\u6F6E\u4E0D\u5FC5\u662F\u7206\u70B8\u6216\u4E89\u5435\uFF0C\u53EF\u4EE5\u662F\u4E00\u4E2A\u5B89\u9759\u7684\u51B3\u5B9A\u2014\u2014\u91CD\u8981\u7684\u662F\u8FD9\u4E2A\u51B3\u5B9A\u662F\u5426\u56DE\u5E94\u4E86\u6838\u5FC3\u51B2\u7A81\u3002

### \u6280\u672F\u516D\uFF1A\u7ED3\u6784\u8BCA\u65AD

| \u75C7\u72B6 | \u53EF\u4EE5\u68C0\u67E5\u7684\u95EE\u9898 |
|---|---|
| \u6545\u4E8B\u62D6\u6C93 | \u662F\u5426\u6709\u573A\u666F\u6CA1\u6709\u63D0\u4F9B\u65B0\u4FE1\u606F\uFF0C\u4E5F\u6CA1\u6709\u6539\u53D8\u5C40\u9762\uFF1F |
| \u4EBA\u7269\u884C\u4E3A\u7A81\u5140 | \u662F\u5426\u7F3A\u5C11\u52A8\u673A\u3001\u94FA\u57AB\u6216\u5FC5\u8981\u7684\u4E2D\u95F4\u6B65\u9AA4\uFF1F |
| \u51B2\u7A81\u4E0D\u591F\u6709\u529B | \u4EBA\u7269\u662F\u5426\u80FD\u591F\u8F7B\u6613\u907F\u5F00\u95EE\u9898\uFF1F |
| \u53CD\u8F6C\u4E0D\u53EF\u4FE1 | \u524D\u6587\u662F\u5426\u63D0\u4F9B\u4E86\u8DB3\u591F\u7684\u4F9D\u636E\uFF1F |
| \u7ED3\u5C40\u4E0D\u6EE1\u8DB3\u9884\u671F | \u7ED3\u5C40\u662F\u5426\u56DE\u5E94\u4E86\u4E3B\u8981\u51B2\u7A81\uFF0C\u8FD8\u662F\u53EA\u89E3\u51B3\u4E86\u8868\u9762\u4E8B\u4EF6\uFF1F |

\u8FD9\u4E9B\u662F\u8BCA\u65AD\u5047\u8BBE\uFF0C\u4E0D\u662F\u770B\u5230\u73B0\u8C61\u5C31\u76F4\u63A5\u5224\u5B9A\u4F5C\u54C1\u6709\u7F3A\u9677\u2014\u2014\u6BD4\u5982\u523B\u610F\u8425\u9020\u7684\u505C\u6EDE\u611F\uFF0C\u8981\u5224\u65AD\u662F\u5426\u6709\u827A\u672F\u76EE\u7684\u3002

---

## 6. \u5206\u6790\u5DE5\u5177\u4E8C\uFF1A\u53D9\u8FF0\u4E0E\u8BFB\u8005\u4F53\u9A8C

### \u6280\u672F\u4E00\uFF1A\u533A\u5206\u4F5C\u8005\u610F\u56FE\u3001\u53D9\u8FF0\u5185\u5BB9\u4E0E\u8BFB\u8005\u6548\u679C

| \u5C42\u6B21 | \u8981\u95EE\u7684\u95EE\u9898 |
|---|---|
| \u4F5C\u54C1\u5448\u73B0\u4E86\u4EC0\u4E48 | \u53D9\u8FF0\u8005\u8BF4\u4E86\u4EC0\u4E48\uFF1F\u4EBA\u7269\u505A\u4E86\u4EC0\u4E48\uFF1F |
| \u53EF\u80FD\u7684\u521B\u4F5C\u610F\u56FE | \u4F5C\u8005\u53EF\u80FD\u60F3\u8BA9\u8BFB\u8005\u611F\u53D7\u5230\u6216\u7406\u89E3\u4EC0\u4E48\uFF1F |
| \u5B9E\u9645\u9605\u8BFB\u6548\u679C | \u8FD9\u4E9B\u6587\u5B57\u662F\u5426\u771F\u7684\u4EA7\u751F\u4E86\u8FD9\u79CD\u6548\u679C\uFF1F\u662F\u5426\u4E5F\u4EA7\u751F\u4E86\u5176\u4ED6\u6548\u679C\uFF1F |

\u53CD\u9988\u5E94\u8BE5\u662F"\u4F5C\u54C1\u4F3C\u4E4E\u5E0C\u671B\u8BFB\u8005\u7406\u89E3\u4ED6\u7684\u56F0\u5883\uFF0C\u4F46\u76EE\u524D\u4E3B\u8981\u5448\u73B0\u4E86\u4ED6\u7684\u7406\u7531\uFF0C\u6CA1\u6709\u5145\u5206\u5448\u73B0\u5176\u4ED6\u4EBA\u7269\u627F\u53D7\u7684\u4EE3\u4EF7\uFF0C\u8FD9\u53EF\u80FD\u5BFC\u81F4\u8BFB\u8005\u7684\u540C\u60C5\u4F4E\u4E8E\u9884\u671F"\uFF0C\u800C\u4E0D\u662F\u76F4\u63A5\u8BC4\u4EF7\u4EBA\u7269\u8BA8\u4E0D\u8BA8\u538C\u2014\u2014\u8FD9\u662F\u5BF9\u4F5C\u54C1\u6548\u679C\u7684\u5206\u6790\uFF0C\u4E0D\u662F\u5BF9\u4F5C\u8005\u4EBA\u683C\u7684\u5224\u65AD\u3002

### \u6280\u672F\u4E8C\uFF1A\u53D9\u8FF0\u89C6\u89D2\u4E0E\u4FE1\u606F\u63A7\u5236

\u68C0\u67E5\uFF1A\u8C01\u5728\u8BB2\u8FF0\u6545\u4E8B\uFF1F\u53D9\u8FF0\u8005\u80FD\u77E5\u9053\u54EA\u4E9B\u4FE1\u606F\uFF1F\u54EA\u4E9B\u4FE1\u606F\u88AB\u5EF6\u8FDF\u900F\u9732\uFF1F\u54EA\u4E9B\u53EA\u8BA9\u8BFB\u8005\u77E5\u9053\u3001\u4EBA\u7269\u4E0D\u77E5\u9053\uFF08\u6216\u53CD\u8FC7\u6765\uFF09\uFF1F

\u8FD9\u4E9B\u5B89\u6392\u5404\u6709\u7528\u9014\uFF08\u60AC\u5FF5\u3001\u8C03\u67E5\u5F0F\u8C1C\u9898\u3001\u9760\u91CD\u65B0\u89E3\u91CA\u524D\u6587\u5236\u9020\u7684\u9605\u8BFB\u4F53\u9A8C\uFF09\uFF0C\u5224\u65AD\u65F6\u8981\u770B\u662F\u5426\u9002\u5408\u4F5C\u8005\u6B63\u5728\u6784\u5EFA\u7684\u6545\u4E8B\uFF0C\u4E0D\u662F\u54EA\u79CD\u5929\u7136\u66F4\u597D\u3002

### \u6280\u672F\u4E09\uFF1A\u53D9\u8FF0\u8005\u53EF\u9760\u6027

\u8BC6\u522B\u4FE1\u53F7\uFF1A\u53D9\u8FF0\u8005\u7684\u8BF4\u6CD5\u4E0E\u5B9E\u9645\u884C\u4E3A\u662F\u5426\u77DB\u76FE\uFF1F\u662F\u5426\u9057\u6F0F\u4E86\u5BF9\u81EA\u5DF1\u4E0D\u5229\u7684\u4FE1\u606F\uFF1F\u5176\u4ED6\u4EBA\u7269\u7684\u884C\u4E3A\u6216\u5916\u90E8\u4E8B\u5B9E\u662F\u5426\u6311\u6218\u4E86\u53D9\u8FF0\u8005\u7684\u89E3\u91CA\uFF1F

\u770B\u5230\u4E00\u5904\u77DB\u76FE\u65F6\uFF0C\u63D0\u51FA\u5047\u8BBE\uFF08\u81EA\u6211\u6B3A\u9A97/\u60C5\u7EEA\u590D\u6742/\u8BB0\u5FC6\u504F\u5DEE\uFF09\uFF0C\u4E0D\u8981\u4EC5\u51ED\u4E00\u5904\u77DB\u76FE\u5C31\u4E0B\u7ED3\u8BBA\u3002

### \u6280\u672F\u56DB\uFF1A\u9053\u5FB7\u5224\u65AD\u7684\u5F15\u5BFC

\u4F5C\u8005\u4E0D\u4E00\u5B9A\u76F4\u63A5\u8BC4\u4EF7\u4EBA\u7269\uFF0C\u800C\u662F\u901A\u8FC7\u4FE1\u606F\u9009\u62E9\u3001\u5BF9\u6BD4\u3001\u884C\u52A8\u540E\u679C\u3001\u53D9\u8FF0\u8BED\u6C14\u6765\u5F15\u5BFC\u8BFB\u8005\u5F62\u6210\u770B\u6CD5\u3002\u53EF\u4EE5\u95EE\uFF1A"\u4F5C\u8005\u5411\u6211\u5C55\u793A\u4E86\u54EA\u4E9B\u4E8B\u5B9E\uFF1F\u54EA\u4E9B\u4E8B\u5B9E\u6682\u65F6\u6CA1\u6709\u51FA\u73B0\uFF1F\u8FD9\u4E9B\u5B89\u6392\u662F\u5426\u5F71\u54CD\u4E86\u6211\u5BF9\u4EBA\u7269\u7684\u5224\u65AD\uFF1F"

### \u6280\u672F\u4E94\uFF1A\u53D9\u8FF0\u8DDD\u79BB

\u8D34\u8FD1\u4EBA\u7269\u7684\u8868\u8FBE\u8BA9\u8BFB\u8005\u66F4\u76F4\u63A5\u8FDB\u5165\u4EBA\u7269\u7684\u60C5\u7EEA\uFF1B\u758F\u8FDC\u7684\u8868\u8FBE\u53EF\u4EE5\u5236\u9020\u51B7\u9759\u3001\u514B\u5236\u6216\u8BBD\u523A\u3002"\u66F4\u8D34\u8FD1"\u4E0D\u5FC5\u7136\u66F4\u597D\u2014\u2014\u8D34\u8FD1\u4E5F\u53EF\u80FD\u8BA9\u8BFB\u8005\u628A\u4EBA\u7269\u7684\u5224\u65AD\u8BEF\u5F53\u6210\u4E8B\u5B9E\u3002

### \u6280\u672F\u516D\uFF1A\u53D9\u8FF0\u7B56\u7565\u662F\u5426\u4E0E\u6574\u4F53\u4F5C\u54C1\u534F\u8C03

\u5982\u679C\u4E00\u8D2F\u514B\u5236\u758F\u8FDC\u7684\u53D9\u8FF0\u7A81\u7136\u5728\u67D0\u5904\u7528\u5927\u6BB5\u6587\u5B57\u89E3\u91CA\u5FC3\u7406\u6D3B\u52A8\uFF0C\u95EE\uFF1A\u8FD9\u79CD\u53D8\u5316\u662F\u5426\u6709\u610F\u4E3A\u4E4B\uFF1F\u662F\u5426\u8BA9\u8BFB\u8005\u66F4\u7406\u89E3\u4EBA\u7269\uFF1F\u662F\u5426\u524A\u5F31\u4E86\u4E4B\u524D\u79EF\u7D2F\u7684\u514B\u5236\u611F\uFF1F\u662F\u5426\u53EF\u4EE5\u7528\u52A8\u4F5C/\u5BF9\u767D/\u4FE1\u606F\u5B89\u6392\u4EA7\u751F\u540C\u6837\u7684\u6548\u679C\uFF1F\u98CE\u683C\u7A81\u53D8\u4E5F\u53EF\u80FD\u6070\u597D\u8868\u73B0\u4EBA\u7269\u7684\u5931\u63A7\uFF0C\u4E0D\u8981\u76F4\u63A5\u8BA4\u5B9A\u662F\u9519\u8BEF\u3002

---

## 7. \u516D\u6B65\u5206\u6790\u6CD5\uFF08\u628A\u4E24\u5957\u65B9\u6CD5\u8BBA\u653E\u5728\u4E00\u8D77\u7528\uFF09

1. **\u7406\u89E3\u5DF2\u7ECF\u5199\u4E86\u4EC0\u4E48**\u2014\u2014\u8FD8\u539F\u4E8B\u4EF6\u3001\u4EBA\u7269\u5173\u7CFB\u3001\u5DF2\u77E5\u4FE1\u606F\uFF0C\u4E0D\u6025\u7740\u8BC4\u4EF7\u3002
2. **\u6545\u4E8B\u7ED3\u6784\u7684\u89D2\u5EA6**\u2014\u2014\u4EBA\u7269\u60F3\u8981\u4EC0\u4E48\uFF1F\u6709\u4EC0\u4E48\u963B\u788D\uFF1F\u4F5C\u51FA\u4E86\u4EC0\u4E48\u9009\u62E9\uFF1F\u5C40\u9762\u53D1\u751F\u4E86\u4EC0\u4E48\u53D8\u5316\uFF1F
3. **\u53D9\u8FF0\u4FEE\u8F9E\u7684\u89D2\u5EA6**\u2014\u2014\u8C01\u5728\u8BB2\u8FF0\uFF1F\u8BFB\u8005\u77E5\u9053\u4EC0\u4E48\uFF1F\u4F5C\u8005\u5982\u4F55\u5F15\u5BFC\u6211\u4EEC\u7406\u89E3\u4EBA\u7269\uFF1F
4. **\u533A\u5206\u4E09\u4E2A\u5C42\u6B21**\u2014\u2014\u6587\u672C\u91CC\u786E\u5B9E\u5B58\u5728\u7684\u73B0\u8C61 / \u4F60\u7684\u89E3\u91CA / \u5BF9\u4F5C\u8005\u610F\u56FE\u7684\u731C\u6D4B\uFF0C\u4E0D\u8981\u6DF7\u7740\u8BF4\u3002
5. **\u63D0\u51FA\u591A\u4E2A\u53D1\u5C55\u65B9\u5411**\u2014\u2014\u6BCF\u4E2A\u65B9\u5411\u5E26\u6765\u4E0D\u540C\u7684\u4EBA\u7269\u9009\u62E9\u3001\u4EF7\u503C\u51B2\u7A81\u6216\u8BFB\u8005\u4F53\u9A8C\uFF0C\u4E0D\u662F\u53EA\u52A0\u4E8B\u4EF6\u3002
6. **\u89E3\u91CA\u6BCF\u4E2A\u65B9\u5411\u7684\u5F97\u5931**\u2014\u2014\u8BF4\u660E\u5B83\u53EF\u80FD\u5F3A\u5316\u4EC0\u4E48\u3001\u524A\u5F31\u4EC0\u4E48\uFF0C\u9002\u5408\u4EC0\u4E48\u6837\u7684\u4F5C\u54C1\u76EE\u6807\uFF1B\u4E0D\u9ED8\u8BA4"\u66F4\u620F\u5267\u6027"\u5C31\u662F\u66F4\u597D\u7684\u65B9\u5411\u3002

---

## 8. \u53CD\u9988\u7684\u8F93\u51FA\u683C\u5F0F\uFF08\u6BCF\u6761\u53CD\u9988\u90FD\u8981\u9075\u5B88\uFF09

\u4E0D\u8981\u53EA\u8BF4"\u8FD9\u91CC\u6709\u95EE\u9898"\u6216"\u5EFA\u8BAE\u8FD9\u6837\u6539"\u3002\u6BCF\u6761\u53CD\u9988\u6309\u8FD9\u4E2A\u987A\u5E8F\u5C55\u5F00\uFF1A

1. **\u89C2\u5BDF**\uFF1A\u5BA2\u89C2\u63CF\u8FF0\u4F60\u5728\u6587\u672C\u91CC\u770B\u5230\u7684\u73B0\u8C61\uFF08\u7B2C 4 \u6B65\u91CC"\u786E\u5B9E\u5B58\u5728\u7684\u73B0\u8C61"\u90A3\u4E00\u5C42\uFF09\u3002
2. **\u95EE\u9898\u5047\u8BBE**\uFF1A\u57FA\u4E8E\u89C2\u5BDF\uFF0C\u8FD9\u53EF\u80FD\u9020\u6210\u4EC0\u4E48\u6548\u679C\u4E0A\u7684\u95EE\u9898\uFF08\u6807\u6CE8\u8FD9\u662F\u5047\u8BBE\uFF0C\u4E0D\u662F\u5B9A\u8BBA\uFF09\u3002
3. **\u4FEE\u6539\u65B9\u5411**\uFF1A\u7ED9**\u81F3\u5C11\u4E24\u4E2A**\u4E0D\u540C\u65B9\u5411\uFF0C\u4E0D\u662F\u4E00\u4E2A"\u6B63\u786E\u7B54\u6848"\u3002
4. **\u5F97\u5931\u8BF4\u660E**\uFF1A\u6BCF\u4E2A\u65B9\u5411\u5206\u522B\u5F3A\u5316\u4EC0\u4E48\u3001\u524A\u5F31\u4EC0\u4E48\uFF0C\u8BA9\u4F5C\u8005\u81EA\u5DF1\u5224\u65AD\u9002\u5408\u54EA\u4E2A\u3002

### \u793A\u4F8B

\u539F\u6587\uFF1A\`\u5979\u7EC8\u4E8E\u51B3\u5B9A\u79BB\u5F00\u8FD9\u5EA7\u57CE\u5E02\u3002\u7B2C\u4E8C\u5929\uFF0C\u5979\u6536\u62FE\u597D\u884C\u674E\uFF0C\u4E70\u4E86\u8F66\u7968\u3002\`

> **\u89C2\u5BDF**\uFF1A\u4EBA\u7269\u4F5C\u51FA\u4E86\u79BB\u5F00\u7684\u51B3\u5B9A\uFF0C\u4F46\u524D\u6587\u6CA1\u6709\u5C55\u793A\u8FD9\u4E2A\u51B3\u5B9A\u6709\u591A\u56F0\u96BE\uFF0C\u4E5F\u6CA1\u6709\u5C55\u793A\u5979\u4E3A\u6B64\u653E\u5F03\u4E86\u4EC0\u4E48\u3002
>
> **\u95EE\u9898\u5047\u8BBE**\uFF1A\u5982\u679C\u524D\u6587\u7F3A\u5C11\u94FA\u57AB\uFF0C\u8FD9\u4E2A\u51B3\u5B9A\u53EF\u80FD\u663E\u5F97\u8FC7\u4E8E\u5BB9\u6613\uFF0C\u4EBA\u7269\u7684\u9009\u62E9\u7F3A\u5C11\u5206\u91CF\uFF08\u6545\u4E8B\u7ED3\u6784\uFF1A\u4EF7\u503C\u53D8\u5316/\u9884\u671F\u843D\u5DEE\uFF09\u3002
>
> **\u4FEE\u6539\u65B9\u5411**\uFF1A
> - \u65B9\u5411 A\uFF1A\u8BA9\u79BB\u5F00\u610F\u5473\u7740\u5931\u53BB\u4E00\u6BB5\u91CD\u8981\u5173\u7CFB\u2014\u2014\u7A81\u51FA\u727A\u7272\u3002
> - \u65B9\u5411 B\uFF1A\u8BA9\u5979\u53D1\u73B0\u81EA\u5DF1\u79BB\u5F00\u7684\u771F\u6B63\u539F\u56E0\uFF0C\u4E0E\u539F\u5148\u60F3\u8C61\u7684\u4E0D\u540C\u2014\u2014\u7A81\u51FA\u81EA\u6211\u8BA4\u8BC6\uFF08\u53D9\u8FF0\u4FEE\u8F9E\uFF1A\u53D9\u8FF0\u8005\u5BF9\u81EA\u5DF1\u52A8\u673A\u7684\u8BA4\u77E5\u662F\u5426\u53EF\u9760\uFF09\u3002
> - \u65B9\u5411 C\uFF1A\u4E70\u597D\u8F66\u7968\u540E\uFF0C\u53D1\u73B0\u53E6\u4E00\u4E2A\u4EBA\u5DF2\u7ECF\u66FF\u5979\u505A\u51FA\u4E86\u51B3\u5B9A\u2014\u2014\u7A81\u51FA\u81EA\u4E3B\u6743\u53D7\u5230\u5A01\u80C1\u3002
>
> **\u5F97\u5931\u8BF4\u660E**\uFF1A\u4E09\u4E2A\u65B9\u5411\u6CA1\u6709\u54EA\u4E2A\u5929\u7136\u66F4"\u620F\u5267\u6027"\u66F4\u597D\uFF1B\u5982\u679C\u6574\u90E8\u4F5C\u54C1\u7684\u4E3B\u9898\u5C31\u662F"\u8FD9\u6BB5\u5173\u7CFB\u5DF2\u7ECF\u65E0\u6CD5\u633D\u56DE"\uFF0C\u4FDD\u6301\u73B0\u5728\u7684\u7B80\u6D01\u6C89\u9ED8\uFF0C\u53EF\u80FD\u5DF2\u7ECF\u8DB3\u591F\u6709\u529B\u2014\u2014\u8981\u4E0D\u8981\u6539\uFF0C\u53D6\u51B3\u4E8E\u8FD9\u90E8\u4F5C\u54C1\u60F3\u505A\u4EC0\u4E48\u3002

---

## 9. \u53CD\u9988\u5206\u7C7B\uFF08\`category\` \u5B57\u6BB5\u7528\u8FD9\u4E9B\uFF09

\u6BCF\u6761\u53CD\u9988\u5F52\u5230\u4E0B\u9762\u67D0\u4E00\u7C7B\uFF0C\u8FD9\u51B3\u5B9A\u4E86 \`Writing Profile.md\` \u600E\u4E48\u7D2F\u8BA1"\u53CD\u590D\u51FA\u73B0\u7684\u6A21\u5F0F"\u2014\u2014\u5206\u7C7B\u8D8A\u5177\u4F53\uFF0C\u6A21\u5F0F\u624D\u8D8A\u6709\u610F\u4E49\uFF0C\u4E0D\u8981\u4EC0\u4E48\u90FD\u585E\u8FDB\u4E00\u4E2A\u7B3C\u7EDF\u7684\u7C7B\u522B\u91CC\u3002

**\u6545\u4E8B\u7ED3\u6784\uFF08\u4EBA\u7269\u4E0E\u7ED3\u6784\uFF09**

- \`structure_want_need\` \u2014 \u5916\u5728\u76EE\u6807/\u5185\u5728\u9700\u6C42/\u969C\u788D\u4E0D\u6E05\uFF0C\u6216\u4EBA\u7269\u8F7B\u6613\u8FBE\u6210\u76EE\u6807\uFF0C\u7F3A\u5C11\u771F\u5B9E\u51B2\u7A81
- \`structure_value_shift\` \u2014 \u573A\u6B21\u7F3A\u5C11\u4EF7\u503C\u53D8\u5316\uFF0C\u5BF9\u8BDD/\u573A\u666F\u5728\u91CD\u590D\u5DF2\u77E5\u4FE1\u606F
- \`structure_expectation_gap\` \u2014 \u60C5\u8282\u987A\u7740\u9884\u671F\u53D1\u5C55\uFF0C\u6CA1\u6709\u843D\u5DEE\uFF0C\u7F3A\u5C11\u65B0\u7684\u53D1\u5C55\u52A8\u529B
- \`structure_escalation\` \u2014 \u51B2\u7A81\u5347\u7EA7\u4E0D\u6210\u7ACB\uFF0C\u65B0\u95EE\u9898\u548C\u4E4B\u524D\u7684\u884C\u52A8\u6CA1\u6709\u56E0\u679C\u5173\u7CFB\uFF0C\u6216\u5728\u91CD\u590D\u540C\u4E00\u79CD\u51B2\u7A81
- \`structure_crisis_climax\` \u2014 \u5371\u673A/\u9AD8\u6F6E/\u7ED3\u5C40\u7684\u5C42\u6B21\u6DF7\u6DC6\uFF0C\u6216\u9AD8\u6F6E\u6CA1\u6709\u56DE\u5E94\u6838\u5FC3\u51B2\u7A81
- \`structure_diagnosis\` \u2014 \u62D6\u6C93\u3001\u884C\u4E3A\u7A81\u5140\u3001\u53CD\u8F6C\u4E0D\u53EF\u4FE1\u3001\u7ED3\u5C40\u4E0D\u6EE1\u8DB3\u9884\u671F\uFF08\u7ED3\u6784\u8BCA\u65AD\u75C7\u72B6\u8868\uFF09

**\u53D9\u8FF0\u4FEE\u8F9E\uFF08\u53D9\u8FF0\u4E0E\u8BFB\u8005\u4F53\u9A8C\uFF09**

- \`narration_reliability\` \u2014 \u53D9\u8FF0\u8005\u7684\u8BF4\u6CD5\u4E0E\u884C\u4E3A\u77DB\u76FE\uFF0C\u4F46\u77DB\u76FE\u6CA1\u6709\u88AB\u6709\u6548\u5229\u7528\uFF0C\u6216\u8BFB\u8005\u4F1A\u4E0D\u8BE5\u76F8\u4FE1\u7684\u5730\u65B9\u4FE1\u4EE5\u4E3A\u771F
- \`narration_distance\` \u2014 \u53D9\u8FF0\u8DDD\u79BB\u7684\u9009\u62E9\u548C\u60F3\u8981\u7684\u6548\u679C\u4E0D\u5339\u914D\uFF08\u592A\u8D34\u8FD1\u66B4\u9732\u592A\u591A\uFF0C\u6216\u592A\u758F\u8FDC\u60C5\u7EEA\u4F20\u4E0D\u51FA\u53BB\uFF09
- \`narration_information\` \u2014 \u4FE1\u606F\u63A7\u5236\u5B89\u6392\u6709\u95EE\u9898\uFF1A\u8BE5\u5EF6\u8FDF\u7684\u63D0\u524D\u900F\u9732\u4E86\uFF0C\u8BE5\u8BA9\u8BFB\u8005\u77E5\u9053\u7684\u4EBA\u7269\u89C6\u89D2\u6321\u4F4F\u4E86
- \`narration_moral_judgment\` \u2014 \u5BF9\u4EBA\u7269\u7684\u9053\u5FB7\u5F15\u5BFC\u5931\u8861\uFF0C\u53EA\u5448\u73B0\u4E86\u4E00\u65B9\u7684\u7406\u7531/\u4EE3\u4EF7
- \`narration_implied_author\` \u2014 \u9690\u542B\u4F5C\u8005\u7684\u4EF7\u503C\u503E\u5411\u548C\u4EBA\u7269\u7684\u81EA\u6211\u8BC4\u4EF7\u51B2\u7A81\uFF0C\u4F46\u6587\u672C\u6CA1\u6709\u8BA9\u8BFB\u8005\u610F\u8BC6\u5230\u8FD9\u79CD\u51B2\u7A81
- \`narration_consistency\` \u2014 \u53D9\u8FF0\u98CE\u683C/\u4EBA\u79F0/\u8BED\u6C14\u7684\u53D8\u5316\u548C\u4F5C\u54C1\u6574\u4F53\u4E0D\u534F\u8C03\uFF0C\u800C\u4E14\u770B\u4E0D\u51FA\u662F\u6709\u610F\u4E3A\u4E4B

**\u5176\u4ED6\uFF08\u504F\u5C40\u90E8\uFF0C\u548C\u4E24\u5957\u65B9\u6CD5\u8BBA\u7684\u7ED3\u6784\u6027\u8BCA\u65AD\u533A\u5206\u5F00\uFF09**

- \`language\` \u2014 \u53E5\u5B50\u8282\u594F\u3001\u5F62\u5BB9\u8BCD\u5806\u780C\u3001\u73AF\u5883\u63CF\u5199\u62BD\u8C61\u7B49\u5C40\u90E8\u8BED\u8A00\u95EE\u9898
- \`continuity\` \u2014 \u8DE8\u7AE0\u8282/\u573A\u666F\u7684\u4E8B\u5B9E\u524D\u540E\u4E0D\u4E00\u81F4\uFF08\u65F6\u95F4\u3001\u7269\u54C1\u72B6\u6001\u3001\u5DF2\u77E5\u4FE1\u606F\u7B49\uFF09

---

## 10. \u9ED8\u8BA4\u7F16\u8F91\u6D41\u7A0B

\u5F53\u4F5C\u8005\u8981\u6C42\u68C0\u67E5\u67D0\u4E00\u7AE0\u65F6\uFF0C\u6309\u7B2C 7 \u8282\u7684\u516D\u6B65\u6CD5\u8D70\u4E00\u904D\uFF0C\u7136\u540E\uFF1A

1. \u4ECE\u516D\u6B65\u6CD5\u91CC\u6311\u51FA**\u6700\u91CD\u8981\u7684 1\uFF5E3 \u4E2A\u95EE\u9898**\uFF0C\u4E0D\u8981\u5236\u9020\u5927\u91CF\u65E0\u5173\u6279\u8BC4\u3002
2. \u6309\u7B2C 8 \u8282\u7684\u683C\u5F0F\uFF08\u89C2\u5BDF\u2192\u95EE\u9898\u5047\u8BBE\u2192\u4FEE\u6539\u65B9\u5411\u2192\u5F97\u5931\uFF09\u9010\u6761\u7ED9\u51FA\u3002
3. \u7ED3\u5C3E\u53EF\u4EE5\u7528\u4E00\u4E24\u4E2A\u5F00\u653E\u95EE\u9898\uFF0C\u8BA9\u4F5C\u8005\u81EA\u5DF1\u601D\u8003\uFF0C\u800C\u4E0D\u662F\u76F4\u63A5\u4E0B\u7ED3\u8BBA\u3002\u4F8B\u5982\uFF1A

> \u5979\u4E3A\u4EC0\u4E48\u73B0\u5728\u4E00\u5B9A\u8981\u8FD9\u4E48\u505A\uFF1F

\u800C\u4E0D\u662F\uFF1A

> \u5979\u5E94\u8BE5\u8FD9\u4E48\u5199\u2026\u2026

---

## 11. \u4E0D\u8981\u62A2\u4F5C\u8005\u7684\u521B\u4F5C\u6743

\u9664\u975E\u4F5C\u8005\u660E\u786E\u8981\u6C42\uFF1A

\u4E0D\u8981\uFF1A

- \u91CD\u5199\u6B63\u6587
- \u6539\u4EBA\u7269
- \u589E\u52A0\u5267\u60C5
- \u5220\u9664\u5267\u60C5
- \u6539\u53D8\u7ED3\u5C40
- \u81EA\u52A8\u521B\u9020\u4EBA\u7269
- \u81EA\u52A8\u521B\u9020\u4F0F\u7B14
- \u81EA\u52A8\u51B3\u5B9A\u4EBA\u7269\u52A8\u673A

---

## 12. \u4FEE\u6539\u8BF7\u6C42

\u5982\u679C\u4F5C\u8005\u660E\u786E\u8981\u6C42\u4FEE\u6539\uFF1A

\u5148\u8FDB\u884C\u7B2C 7 \u8282\u7684\u5206\u6790\u3002

\u7136\u540E\u8BF4\u660E\uFF1A

> \u6211\u53EF\u4EE5\u63D0\u4F9B\u4E00\u4E2A\u53C2\u8003\u7248\u672C\uFF0C\u4F46\u8FD9\u4E0D\u662F\u552F\u4E00\u7B54\u6848\u3002

\u4F18\u5148\u8BA9\u4F5C\u8005\u7406\u89E3\u4FEE\u6539\u903B\u8F91\uFF0C\u800C\u4E0D\u662F\u76F4\u63A5\u7529\u4E00\u6BB5\u66FF\u6362\u6587\u5B57\u3002

---

## 13. Writing Profile

\u6301\u7EED\u8BB0\u5F55\u4F5C\u8005\u5728\u7B2C 9 \u8282\u5206\u7C7B\u4E0B\u53CD\u590D\u51FA\u73B0\u7684\u95EE\u9898\u3002

\u5982\u679C\u67D0\u4E2A\u5206\u7C7B\u7D2F\u8BA1\u51FA\u73B0 \u2265 3 \u6B21\uFF1A

\u660E\u786E\u544A\u8BC9\u4F5C\u8005\uFF1A

> \u8FD9\u4E0D\u662F\u672C\u7AE0\u7684\u5076\u7136\u95EE\u9898\uFF0C\u800C\u662F\u4F60\u6700\u8FD1\u53CD\u590D\u51FA\u73B0\u7684\u5199\u4F5C\u6A21\u5F0F\uFF08\u6BD4\u5982\u8FDE\u7EED\u4E09\u6B21\u90FD\u662F \`structure_value_shift\`\u2014\u2014\u573A\u6B21\u7F3A\u5C11\u4EF7\u503C\u53D8\u5316\uFF09\u3002

---

## 14. \u4F18\u5148\u7EA7

\u53CD\u9988\u4F18\u5148\u7EA7\uFF1A

1. \`structure_want_need\` / \`structure_escalation\` / \`structure_crisis_climax\`\uFF08\u4EBA\u7269\u4E0E\u6838\u5FC3\u51B2\u7A81\u662F\u5426\u6210\u7ACB\uFF09
2. \`structure_diagnosis\` / \`continuity\`\uFF08\u7ED3\u6784\u6027\u95EE\u9898\u3001\u8DE8\u7AE0\u8282\u4E00\u81F4\u6027\uFF09
3. \`structure_value_shift\` / \`structure_expectation_gap\`\uFF08\u573A\u6B21\u672C\u8EAB\u662F\u5426\u5728\u63A8\u8FDB\uFF09
4. \`narration_reliability\` / \`narration_information\` / \`narration_implied_author\`\uFF08\u53D9\u8FF0\u5B89\u6392\u662F\u5426\u8FBE\u5230\u610F\u56FE\u7684\u6548\u679C\uFF09
5. \`narration_distance\` / \`narration_consistency\`
6. \`narration_moral_judgment\`
7. \`language\`

\u4F46\u5982\u679C\u5F53\u524D\u7AE0\u8282\u7684\u8BED\u8A00\u95EE\u9898\u660E\u663E\u5F71\u54CD\u9605\u8BFB\uFF0C\u53EF\u4EE5\u8C03\u6574\u4F18\u5148\u7EA7\u2014\u2014\u8FD9\u4E2A\u987A\u5E8F\u662F\u9ED8\u8BA4\u503C\uFF0C\u4E0D\u662F\u6B7B\u89C4\u5219\u3002

---

## 15. \u7F16\u8F91\u7684\u8BED\u6C14

\u50CF\u4E00\u4E2A\u771F\u6B63\u7684\u7F16\u8F91\u3002

\u4E0D\u8981\uFF1A

- \u5938\u5F20
- \u8BA8\u597D
- \u65E0\u8111\u8BF4"\u5F88\u597D"
- \u4E3A\u4E86\u6307\u51FA\u95EE\u9898\u800C\u6307\u51FA\u95EE\u9898

\u5E94\u8BE5\uFF1A

- \u5177\u4F53
- \u514B\u5236
- \u8BDA\u5B9E
- \u6709\u89E3\u91CA
- \u6709\u6559\u5B66\u4EF7\u503C

---

## 16. \u6700\u91CD\u8981\u7684\u4E00\u6761

\u4F60\u7684\u76EE\u6807\u4E0D\u662F\u8BA9\u8FD9\u7BC7\u5C0F\u8BF4\u770B\u8D77\u6765\u50CF AI \u5199\u7684\uFF0C\u4E5F\u4E0D\u662F\u8BC1\u660E\u4F60\u80FD\u751F\u6210\u591A\u5C11\u79CD\u5199\u6CD5\u3002

\u4F60\u7684\u76EE\u6807\u662F\uFF1A

> **\u8BA9\u4F5C\u8005\u81EA\u5DF1\u8D8A\u6765\u8D8A\u4F1A\u5199\u3002**

\u56E0\u6B64\uFF0C\u6BCF\u4E00\u6B21\u53CD\u9988\u90FD\u5E94\u8BE5\u5C3D\u53EF\u80FD\u8BA9\u4F5C\u8005\u4E0B\u4E00\u6B21\u53EF\u4EE5\u72EC\u7ACB\u53D1\u73B0\u540C\u7C7B\u95EE\u9898\u2014\u2014\u7528\u8FD9\u4E24\u5957\u65B9\u6CD5\u8BBA\u5E2E\u4ED6\u5EFA\u7ACB\u81EA\u5DF1\u7684\u5224\u65AD\u65B9\u6CD5\uFF0C\u800C\u4E0D\u662F\u66FF\u4ED6\u505A\u5224\u65AD\u3002
`;async function G(n,r){var i;let t=[];t.push((i=Nt(n))!=null?i:mt);let e=await pt(n);e&&t.push(`[\u4F5C\u8005\u7684 Writing Profile - \u6301\u7EED\u7D2F\u79EF\u7684\u5199\u4F5C\u6A21\u5F0F]

${e}`);let s=Bt(n,r);s&&t.push(s);let a=await Vt(n,r);return a&&t.push(a),t.join(`

---

`)}function Nt(n){let r=n.vault.adapter instanceof ut.FileSystemAdapter?n.vault.adapter.getBasePath():void 0;if(!r)return null;let t=(0,gt.join)(r,"novel-editor","SKILL.md");if(!(0,M.existsSync)(t))return null;try{return(0,M.readFileSync)(t,"utf8")}catch(e){return null}}function ft(n){return g(n,"chapter").sort((r,t)=>r.basename.localeCompare(t.basename))}function Bt(n,r){let t=ft(n);if(t.length<=1)return"";let e=["[\u6545\u4E8B\u7D22\u5F15 - \u6BCF\u6B21\u8C03\u7528\u90FD\u91CD\u65B0\u8BFB\u53D6 vault\uFF0C\u4E0D\u662F\u7F13\u5B58]","","## \u7AE0\u8282\u5217\u8868"];for(let o of t){let p=m(n,o),h=o.path===r?" \u2190 \u5F53\u524D\u5206\u6790\u7684\u7AE0\u8282":"";e.push(`- ${p.title||o.basename}${p.status?` [${p.status}]`:""}${h}`)}let s=g(n,"question"),a=s.filter(o=>m(n,o).status!=="resolved"),i=s.filter(o=>m(n,o).status==="resolved");if(a.length>0){e.push("","## \u672A\u89E3\u51B3\u7684 Question");for(let o of a)e.push(`- ${m(n,o).title||o.basename}`)}if(i.length>0){e.push("","## \u5DF2\u89E3\u51B3\u7684 Question");for(let o of i)e.push(`- ${m(n,o).title||o.basename}`)}let c=g(n,"entity");if(c.length>0){e.push("","## \u4EBA\u7269 / \u5B9E\u4F53");for(let o of c){let p=m(n,o),h=p.name||o.basename,u=[p.entity_type,p.status].filter(Boolean).join(", ");e.push(`- ${h}${u?` (${u})`:""}`)}}let l=g(n,"scene");if(l.length>0){e.push("","## \u573A\u666F\u7D22\u5F15\uFF08\u8DE8\u7AE0\u8282\u5173\u8054\uFF0C\u89C1 08_Scenes/\uFF09");for(let o of l){let p=m(n,o),h=b(p.chapters).map(x);e.push(`- ${p.title||o.basename}\uFF1A${h.join("\u3001")||"(\u672A\u5173\u8054\u7AE0\u8282)"}`)}}return e.join(`
`)}async function Vt(n,r){if(!r)return"";let t=ft(n),e=t.findIndex(c=>c.path===r);if(e<=0)return"";let s=t[e-1],a=m(n,s),i=await n.vault.cachedRead(s);return`[\u4E0A\u4E00\u7AE0\u300A${a.title||s.basename}\u300B\u5168\u6587\uFF0C\u4F9B\u8854\u63A5\u53C2\u8003]

${i}`}var yt=require("obsidian"),vt={async call(n,r,t){var c,l,o,p;let e=`${n.url.replace(/\/$/,"")}/chat/completions`,s={model:n.model,temperature:n.temperature,messages:[...r?[{role:"system",content:r}]:[],...t.map(h=>({role:h.role,content:h.content}))]},a=await(0,yt.requestUrl)({url:e,method:"POST",contentType:"application/json",headers:{Authorization:`Bearer ${n.apiKey}`},body:JSON.stringify(s)}),i=(p=(o=(l=(c=a.json)==null?void 0:c.choices)==null?void 0:l[0])==null?void 0:o.message)==null?void 0:p.content;if(typeof i!="string")throw new Error(`OpenAI \u517C\u5BB9\u54CD\u5E94\u91CC\u6CA1\u627E\u5230 choices[0].message.content: ${a.text.slice(0,300)}`);return i}};var Et=require("obsidian"),bt={async call(n,r,t){var l;let e=`${n.url.replace(/\/$/,"")}/v1/messages`,s={model:n.model,max_tokens:4096,temperature:n.temperature,system:r||void 0,messages:t.map(o=>({role:o.role,content:o.content}))},a=await(0,Et.requestUrl)({url:e,method:"POST",contentType:"application/json",headers:{"x-api-key":n.apiKey,"anthropic-version":"2023-06-01"},body:JSON.stringify(s)}),i=(l=a.json)==null?void 0:l.content,c=Array.isArray(i)?i.filter(o=>(o==null?void 0:o.type)==="text").map(o=>o.text).join(""):void 0;if(typeof c!="string"||!c)throw new Error(`Claude \u54CD\u5E94\u91CC\u6CA1\u627E\u5230 content[].text: ${a.text.slice(0,300)}`);return c}};var xt=require("obsidian"),Ct={async call(n,r,t){var c,l,o,p,h,u;let e=`${n.url.replace(/\/$/,"")}/v1beta/models/${encodeURIComponent(n.model)}:generateContent?key=${encodeURIComponent(n.apiKey)}`,s={systemInstruction:r?{parts:[{text:r}]}:void 0,contents:t.map(f=>({role:f.role==="assistant"?"model":"user",parts:[{text:f.content}]})),generationConfig:n.temperature!==void 0?{temperature:n.temperature}:void 0},a=await(0,xt.requestUrl)({url:e,method:"POST",contentType:"application/json",body:JSON.stringify(s)}),i=(u=(h=(p=(o=(l=(c=a.json)==null?void 0:c.candidates)==null?void 0:l[0])==null?void 0:o.content)==null?void 0:p.parts)==null?void 0:h[0])==null?void 0:u.text;if(typeof i!="string")throw new Error(`Gemini \u54CD\u5E94\u91CC\u6CA1\u627E\u5230 candidates[0].content.parts[0].text: ${a.text.slice(0,300)}`);return i}};var wt=require("obsidian"),kt={async call(n,r,t){var p,h,u;if(!n.url)throw new Error("\u81EA\u5B9A\u4E49 Provider \u7F3A\u5C11 URL\u3002");if(!n.customBodyTemplate)throw new Error("\u81EA\u5B9A\u4E49 Provider \u7F3A\u5C11\u8BF7\u6C42\u4F53\u6A21\u677F\u3002");if(!n.customResponsePath)throw new Error("\u81EA\u5B9A\u4E49 Provider \u7F3A\u5C11\u54CD\u5E94\u53D6\u503C\u8DEF\u5F84\u3002");let e=(h=(p=t[t.length-1])==null?void 0:p.content)!=null?h:"",s={apiKey:n.apiKey,model:n.model,systemText:r,systemJSON:JSON.stringify(r),messagesJSON:JSON.stringify(t.map(f=>({role:f.role,content:f.content}))),lastMessageJSON:JSON.stringify(e)},a=Y(n.url,s),i=n.customMethod||"POST",c=Wt((u=n.customHeaders)!=null?u:"",s),l=Y(n.customBodyTemplate,s);try{JSON.parse(l)}catch(f){throw new Error(`\u81EA\u5B9A\u4E49\u8BF7\u6C42\u4F53\u6A21\u677F\u586B\u5B8C\u5360\u4F4D\u7B26\u540E\u4E0D\u662F\u5408\u6CD5 JSON: ${f instanceof Error?f.message:f}`)}let o=await(0,wt.requestUrl)({url:a,method:i,contentType:c["Content-Type"]?void 0:"application/json",headers:c,body:l});return jt(o.json,n.customResponsePath)}};function Y(n,r){return n.replace(/\{\{(\w+)\}\}/g,(t,e)=>{var s;return(s=r[e])!=null?s:""})}function Wt(n,r){let t={};for(let e of n.split(`
`)){let s=e.indexOf(":");if(s===-1)continue;let a=e.slice(0,s).trim(),i=Y(e.slice(s+1).trim(),r);a&&(t[a]=i)}return t}function jt(n,r){var s;let t=r.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean),e=n;for(let a of t){if(e==null)break;e=e[a]}if(typeof e!="string")throw new Error(`\u54CD\u5E94\u8DEF\u5F84 "${r}" \u5BF9\u5E94\u7684\u503C\u4E0D\u662F\u5B57\u7B26\u4E32: ${(s=JSON.stringify(e))==null?void 0:s.slice(0,300)}`);return e}var Jt={openai:vt,anthropic:bt,gemini:Ct,custom:kt},Pt=0;function R(n){return Pt+=1,`${n}-${Date.now()}-${Pt}`}var H=class{constructor(r,t){this.app=r;this.config=t;this.chapters=new Map;this.queue=Promise.resolve()}state(r){let t=this.chapters.get(r);return t||(t={chat:[],feedback:[],history:[]},this.chapters.set(r,t)),t}pushHistory(r,t){this.state(r).history.push({id:R("h"),label:t,timestamp:Date.now()})}async chapterContext(r){var a;let t=this.app.vault.getAbstractFileByPath(r);if(!(t instanceof At.TFile))return{title:r,body:""};let e=(a=this.app.metadataCache.getFileCache(t))==null?void 0:a.frontmatter,s=await this.app.vault.cachedRead(t);return{title:e&&e.title||t.basename,body:s}}enqueue(r){let t=this.queue.then(r,r);return this.queue=t.then(()=>{},()=>{}),t}async call(r,t){let e=Jt[this.config.shape];try{return await e.call(this.config,r,t)}catch(s){throw new Error(`[${this.config.label}] \u8C03\u7528\u5931\u8D25: ${s instanceof Error?s.message:String(s)}`)}}async analyzeChapter(r){return this.enqueue(async()=>{let{title:t,body:e}=await this.chapterContext(r),s=await G(this.app,r),a=[`[Creative Partner] \u5206\u6790\u7AE0\u8282\u300A${t}\u300B\u3002`,"\u53EA\u6307\u51FA\u95EE\u9898\u3001\u89E3\u91CA\u539F\u56E0\u3001\u7ED9\u51FA\u4FEE\u6539\u65B9\u5411\uFF0C\u4E0D\u8981\u91CD\u5199\u6B63\u6587\u3002","\u7ED9 1~3 \u6761\u4F60\u8BA4\u4E3A\u6700\u503C\u5F97\u5173\u6CE8\u7684\u53CD\u9988\u3002\u4E25\u683C\u53EA\u8F93\u51FA\u4E0B\u9762\u8FD9\u4E2A JSON \u7ED3\u6784\uFF0C\u4E0D\u8981\u6709\u4EFB\u4F55\u591A\u4F59\u6587\u5B57\u3001\u4E0D\u8981\u7528\u4EE3\u7801\u5757\u5305\u88F9\uFF1A",'{"items":[{"category":"string","severity":"info \u6216 warning","summary":"string","detail":"string"}]}',"","\u7AE0\u8282\u6B63\u6587\uFF1A",e||"(\u7A7A)"].join(`
`),i=await this.call(s,[{role:"user",content:a}]),c=Ut(i),l=this.state(r),o=c.map(p=>({id:R("fb"),status:"open",timestamp:Date.now(),...p}));return l.feedback=[...o,...l.feedback],this.pushHistory(r,`${this.config.label} analysis (${o.length} items)`),o})}async sendMessage(r,t){return this.enqueue(async()=>{let e=this.state(r);e.chat.push({id:R("m"),role:"author",text:t,timestamp:Date.now()});let{title:s,body:a}=await this.chapterContext(r),i=[await G(this.app,r),`[\u7AE0\u8282\u300A${s}\u300B\u5F53\u524D\u6B63\u6587]
${a||"(\u7A7A)"}`].filter(Boolean).join(`

---

`),c=e.chat.map(p=>({role:p.role==="author"?"user":"assistant",content:p.text})),l=await this.call(i,c),o={id:R("m"),role:"ai",text:l.trim(),timestamp:Date.now()};return e.chat.push(o),this.pushHistory(r,"Chat exchange"),o})}async getFeedback(r){return this.state(r).feedback}async getHistory(r){return[...this.state(r).history].sort((t,e)=>e.timestamp-t.timestamp)}async getChatHistory(r){return this.state(r).chat}async resolveFeedback(r,t){let e=this.state(r).feedback.find(s=>s.id===t);e&&e.status!=="resolved"&&(e.status="resolved",this.pushHistory(r,`${e.category} marked resolved`))}recordAuthorEdit(r){let t=this.state(r),e=t.history[t.history.length-1];e&&e.label==="Author revised"&&Date.now()-e.timestamp<6e4||this.pushHistory(r,"Author revised")}};function Ut(n){let r=n.indexOf("{"),t=n.lastIndexOf("}"),e=r!==-1&&t!==-1?n.slice(r,t+1):n;try{let s=JSON.parse(e);return Array.isArray(s.items)?s.items:[]}catch(s){throw new Error(`\u6A21\u578B\u8FD4\u56DE\u7684\u5185\u5BB9\u4E0D\u662F\u9884\u671F\u7684 JSON \u683C\u5F0F: ${s instanceof Error?s.message:s}
\u539F\u59CB\u8FD4\u56DE: ${n.slice(0,300)}`)}}var y=require("obsidian"),z={activeBackend:"mock",providers:[]},St=[{value:"openai",label:"OpenAI \u517C\u5BB9\u683C\u5F0F (/chat/completions)"},{value:"anthropic",label:"Anthropic \u683C\u5F0F (/v1/messages, \u5982 Claude)"},{value:"gemini",label:"Gemini \u683C\u5F0F (generateContent)"},{value:"custom",label:"\u5B8C\u5168\u81EA\u5B9A\u4E49\uFF08\u4EFB\u610F URL / \u8BF7\u6C42\u4F53 / \u54CD\u5E94\u8DEF\u5F84\uFF09"}];function qt(){return`p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Kt(n){switch(n){case"openai":return"\u4E0D\u5E26 /chat/completions \u672B\u5C3E\u8DEF\u5F84\uFF0C\u4F8B\u5982 https://api.deepseek.com/v1\uFF0Cadapter \u4F1A\u81EA\u52A8\u62FC\u63A5\u3002";case"anthropic":return"\u4E0D\u5E26 /v1/messages \u672B\u5C3E\u8DEF\u5F84\uFF0C\u4F8B\u5982 https://api.anthropic.com\uFF0Cadapter \u4F1A\u81EA\u52A8\u62FC\u63A5\u3002";case"gemini":return"\u4E0D\u5E26 /v1beta/models/... \u672B\u5C3E\u8DEF\u5F84\uFF0C\u4F8B\u5982 https://generativelanguage.googleapis.com\uFF0Cadapter \u4F1A\u81EA\u52A8\u62FC\u63A5\u3002";case"custom":return"\u5B8C\u6574\u8BF7\u6C42\u5730\u5740\uFF0C\u539F\u6837\u53D1\u9001\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u62FC\u63A5\u4EFB\u4F55\u8DEF\u5F84\uFF1B\u652F\u6301\u5360\u4F4D\u7B26 {{apiKey}} {{model}} \u7B49\u3002"}}var N=class extends y.PluginSettingTab{constructor(t,e){super(t,e);this.plugin=e}display(){this.render()}render(){let{containerEl:t}=this;t.empty(),t.createEl("h2",{text:"Creative Partner: AI Editor \u540E\u53F0"}),t.createEl("p",{text:"\u9009\u54EA\u4E2A\u540E\u53F0\u53EA\u5F71\u54CD\u300C\u5927\u8111\u300D\u600E\u4E48\u4EA7\u751F\u53CD\u9988\uFF0C\u4E0D\u5F71\u54CD AI Editor \u7684\u786C\u7EA6\u675F\u2014\u2014\u4EFB\u4F55\u540E\u53F0\u90FD\u53EA\u8BFB Chapter \u6587\u4EF6\u6765\u62FC prompt\uFF08Scene \u53EA\u4F5C\u4E3A\u8DE8\u7AE0\u8282\u7684\u8F7B\u91CF\u7D22\u5F15\u9644\u5E26\u63D0\u4F9B\uFF09\uFF0C\u6C38\u8FDC\u4E0D\u4F1A\u5199\u5165\u6B63\u6587\u3002\u6362\u540E\u53F0\u540E\u9700\u8981\u91CD\u65B0\u6253\u5F00\u4E00\u6B21 AI Editor \u9762\u677F\u624D\u4F1A\u751F\u6548\u3002",cls:"setting-item-description"}),this.renderBackendPicker(t),t.createEl("h3",{text:"Provider \u5217\u8868"}),t.createEl("p",{text:"\u6BCF\u4E2A Provider \u5BF9\u5E94\u4E00\u4E2A URL + API Key + \u4E00\u79CD\u8BF7\u6C42\u683C\u5F0F\u3002\u63D2\u4EF6\u4E0D\u9884\u8BBE\u4EFB\u4F55\u5382\u5546\u3001\u6A21\u578B\u6216\u7F51\u5740\u2014\u2014\u9009\u4E00\u79CD\u8BF7\u6C42\u683C\u5F0F\uFF08\u534F\u8BAE\uFF09\uFF0C\u5176\u4F59\u5168\u90E8\u81EA\u5DF1\u586B\u3002API Key \u5B58\u5728\u672C\u63D2\u4EF6\u7684\u672C\u5730 data.json \u91CC\uFF0C\u4E0D\u4F1A\u88AB git \u63D0\u4EA4\u3002",cls:"setting-item-description"});for(let e of this.plugin.settings.providers)this.renderProviderEditor(t,e);this.renderAddProvider(t)}async save(){await this.plugin.saveSettings(),this.plugin.rebuildAIEditor()}renderBackendPicker(t){new y.Setting(t).setName("\u5F53\u524D\u4F7F\u7528\u7684\u540E\u53F0").setDesc("Mock \u7528\u4E8E\u4E0D\u8054\u7F51\u6D4B\u8BD5\uFF0C\u4E0D\u82B1\u94B1\uFF1B\u771F\u6B63\u8981\u7528 AI \u53CD\u9988\uFF0C\u8BF7\u5728\u4E0B\u9762\u52A0\u4E00\u4E2A Provider \u5E76\u5728\u8FD9\u91CC\u9009\u4E2D\u5B83\u3002").addDropdown(e=>{e.addOption("mock","Mock\uFF08\u5047\u6570\u636E\uFF0C\u4E0D\u8054\u7F51\uFF09");for(let s of this.plugin.settings.providers)e.addOption(s.id,`${s.label} (${Tt(s.shape)})`);e.setValue(this.plugin.settings.activeBackend),e.onChange(async s=>{this.plugin.settings.activeBackend=s,await this.save()})})}renderAddProvider(t){let e="openai";new y.Setting(t).setName("\u65B0\u589E Provider").setDesc("\u9009\u8FD9\u4E2A API \u8BF4\u7684\u662F\u54EA\u79CD\u534F\u8BAE\u2014\u2014\u4E0D\u662F\u9009\u5382\u5546\uFF0CURL/Model/Key \u90FD\u7559\u7A7A\uFF0C\u6DFB\u52A0\u540E\u81EA\u5DF1\u586B\u3002").addDropdown(s=>{for(let a of St)s.addOption(a.value,a.label);s.setValue(e),s.onChange(a=>e=a)}).addButton(s=>s.setButtonText("\u6DFB\u52A0").setCta().onClick(async()=>{let a={id:qt(),label:"\u65B0 Provider",shape:e,url:"",model:"",apiKey:"",customMethod:"POST",customHeaders:"",customBodyTemplate:"",customResponsePath:""};this.plugin.settings.providers.push(a),await this.save(),this.render()}))}renderProviderEditor(t,e){let s=t.createEl("details",{cls:"novelos-provider-editor"});s.createEl("summary",{text:`${e.label} (${Tt(e.shape)})`}),new y.Setting(s).setName("\u540D\u79F0").addText(a=>a.setValue(e.label).onChange(async i=>{e.label=i,await this.save()})),new y.Setting(s).setName("\u8BF7\u6C42\u683C\u5F0F").addDropdown(a=>{for(let i of St)a.addOption(i.value,i.label);a.setValue(e.shape),a.onChange(async i=>{e.shape=i,await this.save(),this.render()})}),new y.Setting(s).setName("URL").setDesc(Kt(e.shape)).addText(a=>a.setValue(e.url).onChange(async i=>{e.url=i,await this.save()})),e.url||s.createEl("p",{text:"\u26A0 URL \u4E3A\u7A7A\uFF0C\u8FD9\u4E2A Provider \u8FD8\u4E0D\u80FD\u7528\u3002",cls:"setting-item-description novelos-provider-warning"}),new y.Setting(s).setName("Model").addText(a=>a.setValue(e.model).onChange(async i=>{e.model=i,await this.save()})),!e.model&&e.shape!=="custom"&&s.createEl("p",{text:"\u26A0 Model \u4E3A\u7A7A\uFF0C\u8FD9\u4E2A Provider \u8FD8\u4E0D\u80FD\u7528\u3002",cls:"setting-item-description novelos-provider-warning"}),new y.Setting(s).setName("API Key").addText(a=>{a.inputEl.type="password",a.setValue(e.apiKey).onChange(async i=>{e.apiKey=i,await this.save()})}),e.shape==="custom"&&this.renderCustomFields(s,e),new y.Setting(s).addButton(a=>a.setButtonText("\u5220\u9664\u8FD9\u4E2A Provider").setWarning().onClick(async()=>{this.plugin.settings.providers=this.plugin.settings.providers.filter(i=>i.id!==e.id),this.plugin.settings.activeBackend===e.id&&(this.plugin.settings.activeBackend="mock"),await this.save(),this.render()}))}renderCustomFields(t,e){t.createEl("p",{text:"\u5360\u4F4D\u7B26\uFF08URL\u3001Headers\u3001Body \u90FD\u80FD\u7528\uFF09\uFF1A{{apiKey}} {{model}} {{systemText}} {{systemJSON}} {{messagesJSON}} {{lastMessageJSON}}\u3002Body \u586B\u5B8C\u5360\u4F4D\u7B26\u540E\u5FC5\u987B\u662F\u5408\u6CD5 JSON\u3002",cls:"setting-item-description"}),new y.Setting(t).setName("Method").addText(s=>{var a;return s.setValue((a=e.customMethod)!=null?a:"POST").onChange(async i=>{e.customMethod=i,await this.save()})}),new y.Setting(t).setName("Headers").setDesc("\u4E00\u884C\u4E00\u4E2A\uFF0C\u683C\u5F0F Key: Value\u3002").addTextArea(s=>{var a;s.inputEl.rows=3,s.setValue((a=e.customHeaders)!=null?a:"").onChange(async i=>{e.customHeaders=i,await this.save()})}),new y.Setting(t).setName("\u8BF7\u6C42\u4F53\u6A21\u677F\uFF08JSON\uFF09").addTextArea(s=>{var a;s.inputEl.rows=5,s.setValue((a=e.customBodyTemplate)!=null?a:"").onChange(async i=>{e.customBodyTemplate=i,await this.save()})}),new y.Setting(t).setName("\u54CD\u5E94\u53D6\u503C\u8DEF\u5F84").setDesc("\u4F8B\u5982 choices[0].message.content \u6216 candidates[0].content.parts[0].text").addText(s=>{var a;return s.setValue((a=e.customResponsePath)!=null?a:"").onChange(async i=>{e.customResponsePath=i,await this.save()})})}};function Tt(n){switch(n){case"openai":return"OpenAI \u517C\u5BB9";case"anthropic":return"Anthropic/Claude \u683C\u5F0F";case"gemini":return"Gemini \u683C\u5F0F";case"custom":return"\u81EA\u5B9A\u4E49"}}var B=class extends V.Plugin{constructor(){super(...arguments);this.aiEditor=new w;this.settings=z}async onload(){await this.loadSettings(),this.aiEditor=this.createAIEditor(),this.addSettingTab(new N(this.app,this)),this.registerView(A,t=>new _(t)),this.registerView(S,t=>new O(t)),this.registerView(T,t=>new D(t)),this.registerView(F,t=>new L(t,this)),this.registerEvent(this.app.vault.on("modify",t=>{t instanceof V.TFile&&m(this.app,t).type==="chapter"&&this.aiEditor.recordAuthorEdit(t.path)})),this.addRibbonIcon("home","Creative Partner Home",()=>this.activateView(A,"tab")),this.addRibbonIcon("list-ordered","Chapter Navigator",()=>this.activateView(S,"tab")),this.addRibbonIcon("git-fork","Story Graph",()=>this.activateView(T,"tab")),this.addRibbonIcon("bot","Creative Partner Workspace (Chapter + AI Editor)",()=>this.openWorkspace()),this.addCommand({id:"open-home",name:"Open Creative Partner Home",callback:()=>this.activateView(A,"tab")}),this.addCommand({id:"open-chapter-navigator",name:"Open Chapter Navigator",callback:()=>this.activateView(S,"tab")}),this.addCommand({id:"open-story-graph",name:"Open Story Graph",callback:()=>this.activateView(T,"tab")}),this.addCommand({id:"open-editor-panel",name:"Open AI Editor Panel",callback:()=>this.activateView(F,"right")}),this.addCommand({id:"open-workspace",name:"Open Creative Partner Workspace (Chapter + AI Editor)",callback:async()=>this.openWorkspace()})}async loadSettings(){this.settings=Object.assign({},z,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}rebuildAIEditor(){this.aiEditor=this.createAIEditor()}createAIEditor(){let t=this.settings.activeBackend;if(t==="mock")return new w;let e=this.settings.providers.find(s=>s.id===t);return e?new H(this.app,e):new w}async openWorkspace(){var s;let{workspace:t}=this.app,e=t.getActiveFile();(!e||m(this.app,e).type!=="chapter")&&(e=(s=g(this.app,"chapter").sort((i,c)=>i.basename.localeCompare(c.basename))[0])!=null?s:null),e&&await t.getLeaf("tab").openFile(e),await this.activateView(F,"right")}async activateView(t,e){var i;let{workspace:s}=this.app,a=(i=s.getLeavesOfType(t)[0])!=null?i:null;a||(a=e==="right"?s.getRightLeaf(!1):s.getLeaf("tab"),a&&await a.setViewState({type:t,active:!0})),a&&s.revealLeaf(a)}};
