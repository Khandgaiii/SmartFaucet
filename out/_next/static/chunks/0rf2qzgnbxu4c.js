(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,70065,e=>{"use strict";var t=e.i(43476),a=e.i(71645),s=e.i(47163);let r=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...a}));r.displayName="Card";let n=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",e),...a}));n.displayName="CardHeader";let i=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",e),...a}));i.displayName="CardTitle";let l=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("text-sm text-muted-foreground",e),...a}));l.displayName="CardDescription";let d=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("p-6 pt-0",e),...a}));d.displayName="CardContent";let o=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("flex items-center p-6 pt-0",e),...a}));o.displayName="CardFooter",e.s(["Card",0,r,"CardContent",0,d,"CardDescription",0,l,"CardFooter",0,o,"CardHeader",0,n,"CardTitle",0,i])},23750,10708,e=>{"use strict";var t=e.i(43476),a=e.i(71645),s=e.i(47163);let r=a.forwardRef(({className:e,type:a,...r},n)=>(0,t.jsx)("input",{type:a,className:(0,s.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),ref:n,...r}));r.displayName="Input",e.s(["Input",0,r],23750);var n=e.i(48425),i=a.forwardRef((e,a)=>(0,t.jsx)(n.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));i.displayName="Label";let l=(0,e.i(25913).cva)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),d=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(i,{ref:r,className:(0,s.cn)(l(),e),...a}));d.displayName=i.displayName,e.s(["Label",0,d],10708)},87316,e=>{"use strict";let t=(0,e.i(75254).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["Calendar",0,t],87316)},2153,e=>{"use strict";var t=e.i(43476),a=e.i(71645),s=e.i(18566),r=e.i(91432),n=e.i(17995),i=e.i(17277),l=e.i(25651);function d(e,t){let a="";0===e.length||("cold"in e[0]?(a="Date,Cold Water (L),Cost\n",e.forEach(e=>{a+=`${e.date},${e.cold},${e.cost}
`})):(a="Month,Usage (L),Cost\n",e.forEach(e=>{a+=`${e.month},${e.usage},${e.cost}
`})),c(new Blob([a],{type:"text/csv;charset=utf-8;"}),`${t}.csv`))}function o(e,t,a,s){let r=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${a}</title>
  <style>
    body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #1a365d; }
    h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background-color: #f1f5f9; font-weight: 600; }
    tr:hover { background-color: #f8fafc; }
    .total { font-weight: bold; background-color: #e0f2fe; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
    .date { color: #64748b; }
    @media print {
      body { padding: 20px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SmartFaucet</div>
    <div class="date">${new Date().toLocaleDateString()}</div>
  </div>
  <h1>${a}</h1>
`;if("cold"in e[0]){let t=e.reduce((e,t)=>e+t.cold,0),a=e.reduce((e,t)=>e+t.cost,0);r+=`
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Cold Water (L)</th>
        <th>Cost</th>
      </tr>
    </thead>
    <tbody>
`,e.forEach(e=>{r+=`
      <tr>
        <td>${e.date}</td>
        <td>${e.cold}</td>
        <td>${s(e.cost)}</td>
      </tr>
`}),r+=`
      <tr class="total">
        <td>Total</td>
        <td>${t}</td>
        <td>${s(a)}</td>
      </tr>
    </tbody>
  </table>
`}else{let t=e.reduce((e,t)=>e+t.usage,0),a=e.reduce((e,t)=>e+t.cost,0);r+=`
  <table>
    <thead>
      <tr>
        <th>Month</th>
        <th>Usage (L)</th>
        <th>Cost</th>
      </tr>
    </thead>
    <tbody>
`,e.forEach(e=>{r+=`
      <tr>
        <td>${e.month}</td>
        <td>${e.usage.toLocaleString()}</td>
        <td>${s(e.cost)}</td>
      </tr>
`}),r+=`
      <tr class="total">
        <td>Total</td>
        <td>${t.toLocaleString()}</td>
        <td>${s(a)}</td>
      </tr>
    </tbody>
  </table>
`}let n=new Blob([r+=`
  <p style="margin-top: 30px; color: #64748b; font-size: 12px;">
    Generated by SmartFaucet Dashboard on ${new Date().toLocaleString()}
  </p>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
`],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(n),l=window.open(i,"_blank");l&&(l.onafterprint=()=>{URL.revokeObjectURL(i)})}function c(e,t){let a=URL.createObjectURL(e),s=document.createElement("a");s.href=a,s.download=t,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(a)}function h(e,t){c(new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),`${t}.json`)}var p=e.i(67881),m=e.i(23750),u=e.i(10708),x=e.i(70065),f=e.i(63270),b=e.i(81140),j=e.i(20783),v=e.i(30030),y=e.i(69340),g=e.i(35804),w=e.i(48425),k="Switch",[N,C]=(0,v.createContextScope)(k),[M,D]=N(k),R=a.forwardRef((e,s)=>{let{__scopeSwitch:r,name:n,checked:i,defaultChecked:l,required:d,disabled:o,value:c="on",onCheckedChange:h,form:p,...m}=e,[u,x]=a.useState(null),f=(0,j.useComposedRefs)(s,e=>x(e)),v=a.useRef(!1),g=!u||p||!!u.closest("form"),[k=!1,N]=(0,y.useControllableState)({prop:i,defaultProp:l,onChange:h});return(0,t.jsxs)(M,{scope:r,checked:k,disabled:o,children:[(0,t.jsx)(w.Primitive.button,{type:"button",role:"switch","aria-checked":k,"aria-required":d,"data-state":T(k),"data-disabled":o?"":void 0,disabled:o,value:c,...m,ref:f,onClick:(0,b.composeEventHandlers)(e.onClick,e=>{N(e=>!e),g&&(v.current=e.isPropagationStopped(),v.current||e.stopPropagation())})}),g&&(0,t.jsx)($,{control:u,bubbles:!v.current,name:n,value:c,checked:k,required:d,disabled:o,form:p,style:{transform:"translateX(-100%)"}})]})});R.displayName=k;var S="SwitchThumb",L=a.forwardRef((e,a)=>{let{__scopeSwitch:s,...r}=e,n=D(S,s);return(0,t.jsx)(w.Primitive.span,{"data-state":T(n.checked),"data-disabled":n.disabled?"":void 0,...r,ref:a})});L.displayName=S;var $=e=>{let s,{control:r,checked:n,bubbles:i=!0,...l}=e,d=a.useRef(null),o=(s=a.useRef({value:n,previous:n}),a.useMemo(()=>(s.current.value!==n&&(s.current.previous=s.current.value,s.current.value=n),s.current.previous),[n])),c=(0,g.useSize)(r);return a.useEffect(()=>{let e=d.current,t=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(o!==n&&t){let a=new Event("click",{bubbles:i});t.call(e,n),e.dispatchEvent(a)}},[o,n,i]),(0,t.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:n,...l,tabIndex:-1,ref:d,style:{...e.style,...c,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function T(e){return e?"checked":"unchecked"}var H=e.i(47163);let z=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(R,{className:(0,H.cn)("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",e),...a,ref:s,children:(0,t.jsx)(L,{className:(0,H.cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})}));z.displayName=R.displayName;var P="horizontal",O=["horizontal","vertical"],U=a.forwardRef((e,a)=>{var s;let{decorative:r,orientation:n=P,...i}=e,l=(s=n,O.includes(s))?n:P;return(0,t.jsx)(w.Primitive.div,{"data-orientation":l,...r?{role:"none"}:{"aria-orientation":"vertical"===l?l:void 0,role:"separator"},...i,ref:a})});U.displayName="Separator";let B=a.forwardRef(({className:e,orientation:a="horizontal",decorative:s=!0,...r},n)=>(0,t.jsx)(U,{ref:n,decorative:s,orientation:a,className:(0,H.cn)("shrink-0 bg-border","horizontal"===a?"h-[1px] w-full":"h-full w-[1px]",e),...r}));B.displayName=U.displayName;var E=e.i(63415),I=e.i(84614),q=e.i(75254);let F=(0,q.default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);var A=e.i(87316);let V=(0,q.default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]),J=(0,q.default)("file-text",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]),W=(0,q.default)("file-spreadsheet",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]),Z=(0,q.default)("file-json",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"1oajmo"}],["path",{d:"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"mpwhp6"}]]);var K=e.i(45423),G=e.i(92270);let X=(0,q.default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);var Y=e.i(31278);e.s(["default",0,function(){let e=(0,s.useRouter)(),{user:c,logout:b,updateProfile:j}=(0,r.useAuth)(),{t:v,formatCurrency:y}=(0,n.useSettings)(),{historyData:g,monthlyData:w}=(0,i.useWater)(),{permissionStatus:k,requestPermission:N}=(0,l.useNotifications)(),[C,M]=(0,a.useState)(!1),[D,R]=(0,a.useState)(c?.name||""),[S,L]=(0,a.useState)(!1),$=async()=>{L(!0),await new Promise(e=>setTimeout(e,500)),j(D),M(!1),L(!1)},T=e=>{let t=`smartfaucet-daily-report-${new Date().toISOString().split("T")[0]}`;switch(e){case"csv":d(g,t);break;case"pdf":o(g,t,v("dailyReport"),y);break;case"json":h(g,t)}},H=e=>{let t=`smartfaucet-monthly-report-${new Date().toISOString().split("T")[0]}`;switch(e){case"csv":d(w,t);break;case"pdf":o(w,t,v("monthlyReport"),y);break;case"json":h(w,t)}};return(0,t.jsxs)("div",{className:"container mx-auto max-w-4xl px-4 py-6 lg:py-8",children:[(0,t.jsx)("h1",{className:"mb-6 text-2xl font-bold text-foreground lg:text-3xl",children:v("profile")}),(0,t.jsxs)("div",{className:"grid gap-6 lg:grid-cols-2",children:[(0,t.jsxs)(x.Card,{children:[(0,t.jsxs)(x.CardHeader,{children:[(0,t.jsx)(x.CardTitle,{children:v("account")}),(0,t.jsx)(x.CardDescription,{children:v("profileAccountDesc")})]}),(0,t.jsxs)(x.CardContent,{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsx)(f.Avatar,{className:"h-20 w-20",children:(0,t.jsx)(f.AvatarFallback,{className:"bg-primary text-xl text-primary-foreground",children:c?c.name.split(" ").map(e=>e[0]).join("").toUpperCase().slice(0,2):"?"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-lg font-semibold",children:c?.name}),(0,t.jsxs)("p",{className:"flex items-center gap-1 text-sm text-muted-foreground",children:[(0,t.jsx)(F,{className:"h-3 w-3"}),c?.email]}),(0,t.jsxs)("p",{className:"flex items-center gap-1 text-xs text-muted-foreground",children:[(0,t.jsx)(A.Calendar,{className:"h-3 w-3"}),v("memberSince"),": ",c?.createdAt.toLocaleDateString()]})]})]}),(0,t.jsx)(B,{}),C?(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(u.Label,{htmlFor:"name",children:v("name")}),(0,t.jsx)(m.Input,{id:"name",value:D,onChange:e=>R(e.target.value)})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(p.Button,{onClick:$,disabled:S,children:[S&&(0,t.jsx)(Y.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}),(0,t.jsx)(X,{className:"mr-2 h-4 w-4"}),v("save")]}),(0,t.jsx)(p.Button,{variant:"outline",onClick:()=>M(!1),children:v("cancel")})]})]}):(0,t.jsxs)(p.Button,{variant:"outline",onClick:()=>M(!0),children:[(0,t.jsx)(I.User,{className:"mr-2 h-4 w-4"}),v("edit")," ",v("profile")]}),(0,t.jsx)(B,{}),(0,t.jsxs)(p.Button,{variant:"destructive",onClick:()=>{b(),e.replace("/login")},className:"w-full",children:[(0,t.jsx)(G.LogOut,{className:"mr-2 h-4 w-4"}),v("logout")]})]})]}),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)(x.Card,{children:[(0,t.jsxs)(x.CardHeader,{children:[(0,t.jsxs)(x.CardTitle,{className:"flex items-center gap-2",children:[(0,t.jsx)(K.Bell,{className:"h-5 w-5"}),v("notifications")]}),(0,t.jsx)(x.CardDescription,{children:v("notificationsSettingsDesc")})]}),(0,t.jsxs)(x.CardContent,{children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsx)("p",{className:"font-medium",children:v("enableNotifications")}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"granted"===k?v("notifEnabledStatus"):"denied"===k?v("notifBlockedStatus"):v("notifPromptStatus")})]}),(0,t.jsx)(z,{checked:"granted"===k,onCheckedChange:async e=>{e&&await N()},disabled:"denied"===k||"unsupported"===k})]}),"denied"===k&&(0,t.jsx)("p",{className:"mt-2 text-xs text-destructive",children:v("notifEnableInBrowserSettings")})]})]}),(0,t.jsxs)(x.Card,{children:[(0,t.jsxs)(x.CardHeader,{children:[(0,t.jsxs)(x.CardTitle,{className:"flex items-center gap-2",children:[(0,t.jsx)(V,{className:"h-5 w-5"}),v("export")]}),(0,t.jsx)(x.CardDescription,{children:v("exportDataDesc")})]}),(0,t.jsxs)(x.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium",children:v("dailyReport")}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:v("dailyReportDesc")})]}),(0,t.jsxs)(E.DropdownMenu,{children:[(0,t.jsx)(E.DropdownMenuTrigger,{asChild:!0,children:(0,t.jsxs)(p.Button,{variant:"outline",size:"sm",children:[(0,t.jsx)(V,{className:"mr-2 h-4 w-4"}),v("export")]})}),(0,t.jsxs)(E.DropdownMenuContent,{align:"end",children:[(0,t.jsxs)(E.DropdownMenuItem,{onClick:()=>T("csv"),children:[(0,t.jsx)(W,{className:"mr-2 h-4 w-4"}),v("exportCSV")]}),(0,t.jsxs)(E.DropdownMenuItem,{onClick:()=>T("pdf"),children:[(0,t.jsx)(J,{className:"mr-2 h-4 w-4"}),v("exportPDF")]}),(0,t.jsxs)(E.DropdownMenuItem,{onClick:()=>T("json"),children:[(0,t.jsx)(Z,{className:"mr-2 h-4 w-4"}),v("exportJSONLabel")]})]})]})]}),(0,t.jsx)(B,{}),(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium",children:v("monthlyReport")}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:v("monthlyReportDesc")})]}),(0,t.jsxs)(E.DropdownMenu,{children:[(0,t.jsx)(E.DropdownMenuTrigger,{asChild:!0,children:(0,t.jsxs)(p.Button,{variant:"outline",size:"sm",children:[(0,t.jsx)(V,{className:"mr-2 h-4 w-4"}),v("export")]})}),(0,t.jsxs)(E.DropdownMenuContent,{align:"end",children:[(0,t.jsxs)(E.DropdownMenuItem,{onClick:()=>H("csv"),children:[(0,t.jsx)(W,{className:"mr-2 h-4 w-4"}),v("exportCSV")]}),(0,t.jsxs)(E.DropdownMenuItem,{onClick:()=>H("pdf"),children:[(0,t.jsx)(J,{className:"mr-2 h-4 w-4"}),v("exportPDF")]}),(0,t.jsxs)(E.DropdownMenuItem,{onClick:()=>H("json"),children:[(0,t.jsx)(Z,{className:"mr-2 h-4 w-4"}),v("exportJSONLabel")]})]})]})]})]})]})]})]})]})}],2153)}]);