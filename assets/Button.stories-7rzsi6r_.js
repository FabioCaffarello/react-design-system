var Ba=Object.defineProperty,ba=Object.defineProperties;var Na=Object.getOwnPropertyDescriptors;var w=Object.getOwnPropertySymbols;var ja=Object.prototype.hasOwnProperty,fa=Object.prototype.propertyIsEnumerable;var I=(o,r,n)=>r in o?Ba(o,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):o[r]=n,e=(o,r)=>{for(var n in r||(r={}))ja.call(r,n)&&I(o,n,r[n]);if(w)for(var n of w(r))fa.call(r,n)&&I(o,n,r[n]);return o},t=(o,r)=>ba(o,Na(r));import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{B as s}from"./Button-CioV4BCG.js";import{X as i}from"./x-g6OncSvk.js";import{c as S}from"./createLucideIcon-DQdFte_Y.js";import{D as Sa}from"./download-D_ldSyuc.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";import"./Spinner-zwBmS9q3.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wa=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],L=S("play",wa);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ia=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],f=S("save",Ia);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const La=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],Da=S("trash-2",La),Fa={title:"Atoms/Button",component:s,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","error","outline","ghost","iconOnly"]},size:{control:"select",options:["sm","md","lg"]},isLoading:{control:"boolean"},disabled:{control:"boolean"},fullWidth:{control:"boolean"}}},c={args:{variant:"primary",children:"Primary Button"}},l={args:{variant:"secondary",children:"Secondary Button"}},d={args:{variant:"error",children:"Error Button"}},m={args:{variant:"outline",children:"Outline Button"}},u={args:{variant:"ghost",children:"Ghost Button"}},p={args:{variant:"iconOnly",leftIcon:a.jsx(i,{className:"h-5 w-5"}),"aria-label":"Close"}},h={render:()=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(s,{size:"sm",children:"Small"}),a.jsx(s,{size:"md",children:"Medium"}),a.jsx(s,{size:"lg",children:"Large"})]})},g={render:()=>a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(s,{leftIcon:a.jsx(L,{className:"h-4 w-4"}),children:"Play"}),a.jsx(s,{rightIcon:a.jsx(Sa,{className:"h-4 w-4"}),children:"Download"}),a.jsx(s,{leftIcon:a.jsx(f,{className:"h-4 w-4"}),rightIcon:a.jsx(i,{className:"h-4 w-4"}),children:"Save and Close"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(s,{variant:"outline",leftIcon:a.jsx(L,{className:"h-4 w-4"}),children:"Play"}),a.jsx(s,{variant:"ghost",leftIcon:a.jsx(Da,{className:"h-4 w-4"}),children:"Delete"})]})]})},v={args:{isLoading:!0,children:"Loading Button"}},x={args:{isLoading:!0,loadingText:"Saving...",children:"Save"}},y={args:{disabled:!0,children:"Disabled Button"}},B={args:{fullWidth:!0,children:"Full Width Button"}},b={render:()=>a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(s,{variant:"primary",children:"Primary"}),a.jsx(s,{variant:"secondary",children:"Secondary"}),a.jsx(s,{variant:"error",children:"Error"}),a.jsx(s,{variant:"outline",children:"Outline"}),a.jsx(s,{variant:"ghost",children:"Ghost"}),a.jsx(s,{variant:"iconOnly",leftIcon:a.jsx(i,{className:"h-5 w-5"}),"aria-label":"Close"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(s,{variant:"primary",isLoading:!0,children:"Loading"}),a.jsx(s,{variant:"primary",disabled:!0,children:"Disabled"}),a.jsx(s,{variant:"primary",leftIcon:a.jsx(f,{className:"h-4 w-4"}),children:"With Icon"})]})]})},N={render:()=>a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-sm text-gray-600",children:"Buttons with proper ARIA labels:"}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx(s,{"aria-label":"Save document",children:"Save"}),a.jsx(s,{variant:"iconOnly",leftIcon:a.jsx(i,{className:"h-5 w-5"}),"aria-label":"Close dialog",children:a.jsx(i,{className:"h-5 w-5"})}),a.jsx(s,{variant:"iconOnly",leftIcon:a.jsx(f,{className:"h-5 w-5"}),"aria-label":"Save changes",children:a.jsx(f,{className:"h-5 w-5"})})]})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-sm text-gray-600",children:"Loading state with aria-busy:"}),a.jsx(s,{isLoading:!0,"aria-busy":"true",children:"Processing..."})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-sm text-gray-600",children:"Disabled state with aria-disabled:"}),a.jsx(s,{disabled:!0,"aria-disabled":"true",children:"Disabled Action"})]})]}),parameters:{docs:{description:{story:"Examples demonstrating accessibility features: ARIA labels, aria-busy for loading, and aria-disabled for disabled states."}}}},j={render:()=>a.jsxs("div",{className:"space-y-4",children:[a.jsx("p",{className:"text-sm text-gray-600",children:"Try navigating with Tab key and activating buttons with Enter or Space:"}),a.jsxs("div",{className:"flex flex-col gap-2",children:[a.jsx(s,{children:"First Button (Tab here)"}),a.jsx(s,{variant:"secondary",children:"Second Button"}),a.jsx(s,{variant:"outline",children:"Third Button"}),a.jsx(s,{variant:"ghost",children:"Fourth Button"})]}),a.jsx("p",{className:"text-xs text-gray-500 mt-4",children:"All buttons support keyboard navigation: Tab to focus, Enter or Space to activate."})]}),parameters:{docs:{description:{story:"Demonstrates keyboard navigation support. Use Tab to navigate between buttons and Enter/Space to activate."}}}};var D,T,A;c.parameters=t(e({},c.parameters),{docs:t(e({},(D=c.parameters)==null?void 0:D.docs),{source:e({originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`},(A=(T=c.parameters)==null?void 0:T.docs)==null?void 0:A.source)})});var O,k,E;l.parameters=t(e({},l.parameters),{docs:t(e({},(O=l.parameters)==null?void 0:O.docs),{source:e({originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`},(E=(k=l.parameters)==null?void 0:k.docs)==null?void 0:E.source)})});var P,W,z;d.parameters=t(e({},d.parameters),{docs:t(e({},(P=d.parameters)==null?void 0:P.docs),{source:e({originalSource:`{
  args: {
    variant: 'error',
    children: 'Error Button'
  }
}`},(z=(W=d.parameters)==null?void 0:W.docs)==null?void 0:z.source)})});var M,C,F;m.parameters=t(e({},m.parameters),{docs:t(e({},(M=m.parameters)==null?void 0:M.docs),{source:e({originalSource:`{
  args: {
    variant: 'outline',
    children: 'Outline Button'
  }
}`},(F=(C=m.parameters)==null?void 0:C.docs)==null?void 0:F.source)})});var _,G,V;u.parameters=t(e({},u.parameters),{docs:t(e({},(_=u.parameters)==null?void 0:_.docs),{source:e({originalSource:`{
  args: {
    variant: 'ghost',
    children: 'Ghost Button'
  }
}`},(V=(G=u.parameters)==null?void 0:G.docs)==null?void 0:V.source)})});var X,R,H;p.parameters=t(e({},p.parameters),{docs:t(e({},(X=p.parameters)==null?void 0:X.docs),{source:e({originalSource:`{
  args: {
    variant: 'iconOnly',
    leftIcon: <X className="h-5 w-5" />,
    'aria-label': 'Close'
  }
}`},(H=(R=p.parameters)==null?void 0:R.docs)==null?void 0:H.source)})});var K,U,$;h.parameters=t(e({},h.parameters),{docs:t(e({},(K=h.parameters)==null?void 0:K.docs),{source:e({originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
}`},($=(U=h.parameters)==null?void 0:U.docs)==null?void 0:$.source)})});var q,J,Q;g.parameters=t(e({},g.parameters),{docs:t(e({},(q=g.parameters)==null?void 0:q.docs),{source:e({originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button leftIcon={<Play className="h-4 w-4" />}>Play</Button>
        <Button rightIcon={<Download className="h-4 w-4" />}>Download</Button>
        <Button leftIcon={<Save className="h-4 w-4" />} rightIcon={<X className="h-4 w-4" />}>
          Save and Close
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" leftIcon={<Play className="h-4 w-4" />}>Play</Button>
        <Button variant="ghost" leftIcon={<Trash2 className="h-4 w-4" />}>Delete</Button>
      </div>
    </div>
}`},(Q=(J=g.parameters)==null?void 0:J.docs)==null?void 0:Q.source)})});var Y,Z,aa;v.parameters=t(e({},v.parameters),{docs:t(e({},(Y=v.parameters)==null?void 0:Y.docs),{source:e({originalSource:`{
  args: {
    isLoading: true,
    children: 'Loading Button'
  }
}`},(aa=(Z=v.parameters)==null?void 0:Z.docs)==null?void 0:aa.source)})});var ea,ta,sa;x.parameters=t(e({},x.parameters),{docs:t(e({},(ea=x.parameters)==null?void 0:ea.docs),{source:e({originalSource:`{
  args: {
    isLoading: true,
    loadingText: 'Saving...',
    children: 'Save'
  }
}`},(sa=(ta=x.parameters)==null?void 0:ta.docs)==null?void 0:sa.source)})});var ra,na,oa;y.parameters=t(e({},y.parameters),{docs:t(e({},(ra=y.parameters)==null?void 0:ra.docs),{source:e({originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled Button'
  }
}`},(oa=(na=y.parameters)==null?void 0:na.docs)==null?void 0:oa.source)})});var ia,ca,la;B.parameters=t(e({},B.parameters),{docs:t(e({},(ia=B.parameters)==null?void 0:ia.docs),{source:e({originalSource:`{
  args: {
    fullWidth: true,
    children: 'Full Width Button'
  }
}`},(la=(ca=B.parameters)==null?void 0:ca.docs)==null?void 0:la.source)})});var da,ma,ua;b.parameters=t(e({},b.parameters),{docs:t(e({},(da=b.parameters)==null?void 0:da.docs),{source:e({originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="error">Error</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="iconOnly" leftIcon={<X className="h-5 w-5" />} aria-label="Close" />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="primary" isLoading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="primary" leftIcon={<Save className="h-4 w-4" />}>With Icon</Button>
      </div>
    </div>
}`},(ua=(ma=b.parameters)==null?void 0:ma.docs)==null?void 0:ua.source)})});var pa,ha,ga;N.parameters=t(e({},N.parameters),{docs:t(e({},(pa=N.parameters)==null?void 0:pa.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Buttons with proper ARIA labels:</p>
        <div className="flex gap-2">
          <Button aria-label="Save document">Save</Button>
          <Button variant="iconOnly" leftIcon={<X className="h-5 w-5" />} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
          <Button variant="iconOnly" leftIcon={<Save className="h-5 w-5" />} aria-label="Save changes">
            <Save className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Loading state with aria-busy:</p>
        <Button isLoading aria-busy="true">
          Processing...
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Disabled state with aria-disabled:</p>
        <Button disabled aria-disabled="true">
          Disabled Action
        </Button>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Examples demonstrating accessibility features: ARIA labels, aria-busy for loading, and aria-disabled for disabled states.'
      }
    }
  }
}`},(ga=(ha=N.parameters)==null?void 0:ha.docs)==null?void 0:ga.source)})});var va,xa,ya;j.parameters=t(e({},j.parameters),{docs:t(e({},(va=j.parameters)==null?void 0:va.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Try navigating with Tab key and activating buttons with Enter or Space:
      </p>
      <div className="flex flex-col gap-2">
        <Button>First Button (Tab here)</Button>
        <Button variant="secondary">Second Button</Button>
        <Button variant="outline">Third Button</Button>
        <Button variant="ghost">Fourth Button</Button>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        All buttons support keyboard navigation: Tab to focus, Enter or Space to activate.
      </p>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation support. Use Tab to navigate between buttons and Enter/Space to activate.'
      }
    }
  }
}`},(ya=(xa=j.parameters)==null?void 0:xa.docs)==null?void 0:ya.source)})});const _a=["Primary","Secondary","Error","Outline","Ghost","IconOnly","Sizes","WithIcons","Loading","LoadingWithText","Disabled","FullWidth","AllVariants","Accessibility","KeyboardNavigation"];export{N as Accessibility,b as AllVariants,y as Disabled,d as Error,B as FullWidth,u as Ghost,p as IconOnly,j as KeyboardNavigation,v as Loading,x as LoadingWithText,m as Outline,c as Primary,l as Secondary,h as Sizes,g as WithIcons,_a as __namedExportsOrder,Fa as default};
