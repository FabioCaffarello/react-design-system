var x=Object.defineProperty,B=Object.defineProperties;var I=Object.getOwnPropertyDescriptors;var p=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var m=(o,r,s)=>r in o?x(o,r,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[r]=s,e=(o,r)=>{for(var s in r||(r={}))y.call(r,s)&&m(o,s,r[s]);if(p)for(var s of p(r))C.call(r,s)&&m(o,s,r[s]);return o},a=(o,r)=>B(o,I(r));import{B as U}from"./Breadcrumb-Ca77HakG.js";import"./jsx-runtime-D_zvdyIk.js";import"./NavLink-Cym3z70p.js";const R={title:"Molecules/Breadcrumb",component:U,parameters:{docs:{description:{component:"A breadcrumb navigation component for hierarchical navigation. Accessible with proper ARIA labels."}}},argTypes:{items:{control:"object",description:"Array of breadcrumb items"},separator:{control:"text",description:"Separator between items"}}},n={args:{items:[{label:"Home",href:"/"},{label:"Epics",href:"/epics"},{label:"Epic Details"}]}},t={args:{items:[{label:"Dashboard",href:"/"},{label:"Epics"}]}},l={args:{items:[{label:"Home",href:"/"},{label:"Epics",href:"/epics"},{label:"User Authentication",href:"/epics/1"},{label:"Edit"}]}},c={args:{items:[{label:"Home",href:"/"},{label:"Epics",href:"/epics"},{label:"Details"}],separator:"›"}},i={args:{items:[{label:"Dashboard"}]}};var b,d,h;n.parameters=a(e({},n.parameters),{docs:a(e({},(b=n.parameters)==null?void 0:b.docs),{source:e({originalSource:`{
  args: {
    items: [{
      label: "Home",
      href: "/"
    }, {
      label: "Epics",
      href: "/epics"
    }, {
      label: "Epic Details"
    }]
  }
}`},(h=(d=n.parameters)==null?void 0:d.docs)==null?void 0:h.source)})});var u,f,g;t.parameters=a(e({},t.parameters),{docs:a(e({},(u=t.parameters)==null?void 0:u.docs),{source:e({originalSource:`{
  args: {
    items: [{
      label: "Dashboard",
      href: "/"
    }, {
      label: "Epics"
    }]
  }
}`},(g=(f=t.parameters)==null?void 0:f.docs)==null?void 0:g.source)})});var E,D,S;l.parameters=a(e({},l.parameters),{docs:a(e({},(E=l.parameters)==null?void 0:E.docs),{source:e({originalSource:`{
  args: {
    items: [{
      label: "Home",
      href: "/"
    }, {
      label: "Epics",
      href: "/epics"
    }, {
      label: "User Authentication",
      href: "/epics/1"
    }, {
      label: "Edit"
    }]
  }
}`},(S=(D=l.parameters)==null?void 0:D.docs)==null?void 0:S.source)})});var A,v,H;c.parameters=a(e({},c.parameters),{docs:a(e({},(A=c.parameters)==null?void 0:A.docs),{source:e({originalSource:`{
  args: {
    items: [{
      label: "Home",
      href: "/"
    }, {
      label: "Epics",
      href: "/epics"
    }, {
      label: "Details"
    }],
    separator: "›"
  }
}`},(H=(v=c.parameters)==null?void 0:v.docs)==null?void 0:H.source)})});var T,w,L;i.parameters=a(e({},i.parameters),{docs:a(e({},(T=i.parameters)==null?void 0:T.docs),{source:e({originalSource:`{
  args: {
    items: [{
      label: "Dashboard"
    }]
  }
}`},(L=(w=i.parameters)==null?void 0:w.docs)==null?void 0:L.source)})});const k=["Default","TwoLevels","ThreeLevels","CustomSeparator","SingleItem"];export{c as CustomSeparator,n as Default,i as SingleItem,l as ThreeLevels,t as TwoLevels,k as __namedExportsOrder,R as default};
