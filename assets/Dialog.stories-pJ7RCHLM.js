var je=Object.defineProperty,Oe=Object.defineProperties;var Ie=Object.getOwnPropertyDescriptors;var O=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable;var $=(n,t,o)=>t in n?je(n,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[t]=o,s=(n,t)=>{for(var o in t||(t={}))M.call(t,o)&&$(n,o,t[o]);if(O)for(var o of O(t))U.call(t,o)&&$(n,o,t[o]);return n},c=(n,t)=>Oe(n,Ie(t));var v=(n,t)=>{var o={};for(var a in n)M.call(n,a)&&t.indexOf(a)<0&&(o[a]=n[a]);if(n!=null&&O)for(var a of O(n))t.indexOf(a)<0&&U.call(n,a)&&(o[a]=n[a]);return o};import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r}from"./iframe-38FCFUQv.js";import{r as ke}from"./index-CpssgTzR.js";import"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import{g as fe}from"./typography-BGNr2Ph4.js";import{g as Ne}from"./shadows-B52VkgOA.js";import{g as we}from"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import{B as d}from"./Button-CioV4BCG.js";import{X as qe}from"./x-g6OncSvk.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import{I as W}from"./Input-DlIdFoDR.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import{L as Y}from"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import"./preload-helper-BDBacUwf.js";import"./index-ZYLuXEVB.js";import"./createLucideIcon-DQdFte_Y.js";const De=r.createContext(void 0);function j(){const n=r.useContext(De);if(!n)throw new Error("Dialog components must be used within a Dialog component");return n}function he({children:n,open:t,defaultOpen:o=!1,onOpenChange:a,titleId:l,descriptionId:m}){const[h,D]=r.useState(o),u=r.useRef(null),p=t!==void 0?t:h,C=g=>{t===void 0&&D(g),a==null||a(g)};r.useEffect(()=>{if(p)u.current=document.activeElement;else{const g=setTimeout(()=>{var T;(T=u.current)==null||T.focus()},0);return()=>clearTimeout(g)}},[p]),r.useEffect(()=>(p?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[p]);const y={isOpen:p,onOpenChange:C,onClose:()=>C(!1),titleId:l,descriptionId:m};return e.jsx(De.Provider,{value:y,children:n})}he.__docgenInfo={description:"",methods:[],displayName:"DialogProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},open:{required:!1,tsType:{name:"boolean"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},titleId:{required:!1,tsType:{name:"string"},description:""},descriptionId:{required:!1,tsType:{name:"string"},description:""}}};function xe({children:n,asChild:t=!1}){const{onOpenChange:o}=j();return t&&r.isValidElement(n)?r.cloneElement(n,{onClick:a=>{o(!0),n.props.onClick&&n.props.onClick(a)}}):e.jsx("button",{type:"button",onClick:()=>o(!0),"aria-haspopup":"dialog",children:n})}xe.__docgenInfo={description:"",methods:[],displayName:"DialogTrigger",props:{children:{required:!0,tsType:{name:"ReactElement"},description:""},asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};function H(h){var D=h,{children:n,size:t="md",closeOnOverlayClick:o=!0,closeOnEscape:a=!0,className:l=""}=D,m=v(D,["children","size","closeOnOverlayClick","closeOnEscape","className"]);const{isOpen:u,onClose:p,titleId:C,descriptionId:y}=j(),g=r.useRef(null),T=r.useRef(null);if(r.useEffect(()=>{if(!u)return;const S=setTimeout(()=>{var b;const f=(b=g.current)==null?void 0:b.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),x=f==null?void 0:f[0];x==null||x.focus()},0),L=f=>{a&&f.key==="Escape"&&p()},_=f=>{if(f.key!=="Tab"||!g.current)return;const x=Array.from(g.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(R=>!R.disabled&&R.offsetParent!==null);if(x.length===0){f.preventDefault();return}const b=x[0],V=x[x.length-1];f.shiftKey?document.activeElement===b&&(f.preventDefault(),V.focus()):document.activeElement===V&&(f.preventDefault(),b.focus())};return document.addEventListener("keydown",L),document.addEventListener("keydown",_),()=>{clearTimeout(S),document.removeEventListener("keydown",L),document.removeEventListener("keydown",_)}},[u,p,a]),!u)return null;const Te={sm:"max-w-sm",md:"max-w-md",lg:"max-w-lg",xl:"max-w-2xl",fullscreen:"max-w-full h-full m-0 rounded-none"},be=S=>{o&&S.target===T.current&&p()},P=e.jsxs("div",{className:"fixed inset-0 z-50 overflow-y-auto",onClick:be,children:[e.jsx("div",{ref:T,className:"fixed inset-0 bg-black bg-opacity-50 transition-opacity","aria-hidden":"true"}),e.jsx("div",{className:"flex min-h-full items-center justify-center p-4",children:e.jsx("div",c(s({ref:g,role:"dialog","aria-modal":"true","aria-labelledby":C,"aria-describedby":y,className:`
            relative z-50 w-full
            ${Te[t]}
            bg-white
            ${we("lg")}
            ${Ne("xl")}
            ${l}
          `,tabIndex:-1},m),{children:n}))})]});return typeof window!="undefined"?ke.createPortal(P,document.body):P}H.__docgenInfo={description:"",methods:[],displayName:"DialogContent",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"},{name:"literal",value:"'fullscreen'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},closeOnOverlayClick:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},closeOnEscape:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};function A(a){var l=a,{children:n,className:t=""}=l,o=v(l,["children","className"]);return e.jsx("div",c(s({className:`flex flex-col space-y-1.5 p-6 pb-4 ${t}`},o),{children:n}))}A.__docgenInfo={description:"",methods:[],displayName:"DialogHeader",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};function Ce(m){var h=m,{as:n="h2",children:t,className:o="",id:a}=h,l=v(h,["as","children","className","id"]);const D=j(),u=r.useId(),p=a||D.titleId||u;return e.jsx(n,c(s({id:p,className:`${fe("h3")} font-semibold leading-none tracking-tight ${o}`},l),{children:t}))}Ce.__docgenInfo={description:"",methods:[],displayName:"DialogTitle",props:{as:{required:!1,tsType:{name:"union",raw:"'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",elements:[{name:"literal",value:"'h1'"},{name:"literal",value:"'h2'"},{name:"literal",value:"'h3'"},{name:"literal",value:"'h4'"},{name:"literal",value:"'h5'"},{name:"literal",value:"'h6'"}]},description:"",defaultValue:{value:"'h2'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};function ve(l){var m=l,{children:n,className:t="",id:o}=m,a=v(m,["children","className","id"]);const h=j(),D=r.useId(),u=o||h.descriptionId||D;return e.jsx("p",c(s({id:u,className:`${fe("bodySmall")} text-gray-500 ${t}`},a),{children:n}))}ve.__docgenInfo={description:"",methods:[],displayName:"DialogDescription",props:{className:{defaultValue:{value:"''",computed:!1},required:!1}}};function B(a){var l=a,{children:n,className:t=""}=l,o=v(l,["children","className"]);return e.jsx("div",c(s({className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 ${t}`},o),{children:n}))}B.__docgenInfo={description:"",methods:[],displayName:"DialogFooter",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};function ye({"aria-label":n="Close dialog",className:t="",asChild:o=!1,children:a}){const{onClose:l}=j();return o&&r.isValidElement(a)?r.cloneElement(a,{onClick:m=>{l(),a.props.onClick&&a.props.onClick(m)}}):e.jsx(d,{variant:"iconOnly",size:"sm",onClick:l,className:`absolute right-4 top-4 ${t}`,"aria-label":n,children:e.jsx(qe,{className:"h-4 w-4"})})}ye.__docgenInfo={description:"",methods:[],displayName:"DialogClose",props:{"aria-label":{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Close dialog'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactElement"},description:""}}};function i({children:n,open:t,defaultOpen:o,onOpenChange:a}){const l=r.useId(),m=r.useId();return e.jsx(he,{open:t,defaultOpen:o,onOpenChange:a,titleId:l,descriptionId:m,children:n})}i.Trigger=xe;i.Content=H;i.Header=A;i.Title=Ce;i.Description=ve;i.Footer=B;i.Close=ye;i.__docgenInfo={description:`Dialog Component

A flexible dialog component using compound components pattern.
Supports both controlled and uncontrolled modes.
Includes portal rendering, focus trap, and full accessibility.

@example
\`\`\`tsx
// Uncontrolled
<Dialog>
  <Dialog.Trigger>Open Dialog</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>Dialog description</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button onClick={handleClose}>Close</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>

// Controlled
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
    </Dialog.Header>
  </Dialog.Content>
</Dialog>
\`\`\``,methods:[{name:"Trigger",docblock:null,modifiers:["static"],params:[{name:"{ children, asChild = false }: DialogTriggerProps",optional:!1,type:{name:"DialogTriggerProps",alias:"DialogTriggerProps"}}],returns:null},{name:"Content",docblock:null,modifiers:["static"],params:[{name:`{
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  ...props
}: DialogContentProps`,optional:!1,type:{name:"DialogContentProps",alias:"DialogContentProps"}}],returns:null},{name:"Header",docblock:null,modifiers:["static"],params:[{name:"{ children, className = '', ...props }: DialogHeaderProps",optional:!1,type:{name:"DialogHeaderProps",alias:"DialogHeaderProps"}}],returns:null},{name:"Title",docblock:null,modifiers:["static"],params:[{name:`{
  as: Component = 'h2',
  children,
  className = '',
  id,
  ...props
}: DialogTitleProps`,optional:!1,type:{name:"DialogTitleProps",alias:"DialogTitleProps"}}],returns:null},{name:"Description",docblock:null,modifiers:["static"],params:[{name:`{
  children,
  className = '',
  id,
  ...props
}: DialogDescriptionProps`,optional:!1,type:{name:"HTMLAttributes",elements:[{name:"HTMLParagraphElement"}],raw:"HTMLAttributes<HTMLParagraphElement>",alias:"DialogDescriptionProps"}}],returns:null},{name:"Footer",docblock:null,modifiers:["static"],params:[{name:"{ children, className = '', ...props }: DialogFooterProps",optional:!1,type:{name:"DialogFooterProps",alias:"DialogFooterProps"}}],returns:null},{name:"Close",docblock:null,modifiers:["static"],params:[{name:`{
  'aria-label': ariaLabel = 'Close dialog',
  className = '',
  asChild = false,
  children,
}: DialogCloseProps`,optional:!1,type:{name:"DialogCloseProps",alias:"DialogCloseProps"}}],returns:null}],displayName:"Dialog",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},open:{required:!1,tsType:{name:"boolean"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:""},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""}}};function z({open:n,defaultOpen:t,onOpenChange:o,title:a,description:l,confirmLabel:m="Confirm",cancelLabel:h="Cancel",variant:D="default",onConfirm:u,onCancel:p,children:C}){const y=()=>{u==null||u(),o==null||o(!1)},g=()=>{p==null||p(),o==null||o(!1)};return e.jsx(i,{open:n,defaultOpen:t,onOpenChange:o,children:e.jsx(H,{size:"sm",closeOnOverlayClick:!1,children:C||e.jsxs(e.Fragment,{children:[e.jsxs(A,{children:[e.jsx(i.Title,{children:a}),l&&e.jsx(i.Description,{children:l})]}),e.jsxs(B,{children:[e.jsx(d,{variant:"outline",onClick:g,children:h}),e.jsx(d,{variant:D==="destructive"?"error":"primary",onClick:y,children:m})]})]})})})}z.__docgenInfo={description:`AlertDialog Component

A specialized dialog for confirmations and alerts.
Built on top of Dialog with pre-configured layout.

@example
\`\`\`tsx
<AlertDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete Item"
  description="Are you sure? This action cannot be undone."
  variant="destructive"
  onConfirm={handleDelete}
/>
\`\`\``,methods:[],displayName:"AlertDialog",props:{open:{required:!1,tsType:{name:"boolean"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:""},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},title:{required:!0,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""},confirmLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Confirm'",computed:!1}},cancelLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Cancel'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'destructive'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'destructive'"}]},description:"",defaultValue:{value:"'default'",computed:!1}},onConfirm:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const Dn={title:"Organisms/Dialog",component:i,parameters:{docs:{description:{component:"A flexible dialog component using compound components pattern. Supports both controlled and uncontrolled modes. Includes portal rendering, focus trap, and full accessibility."}}}},I={render:()=>{const[n,t]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(d,{onClick:()=>t(!0),children:"Open Dialog"}),e.jsx(i,{open:n,onOpenChange:t,children:e.jsxs(i.Content,{children:[e.jsxs(i.Header,{children:[e.jsx(i.Title,{children:"Dialog Title"}),e.jsx(i.Description,{children:"This is a dialog description. It provides additional context about the dialog."})]}),e.jsx("div",{className:"p-6 pt-0",children:e.jsx("p",{children:"Dialog content goes here."})}),e.jsxs(i.Footer,{children:[e.jsx(d,{variant:"outline",onClick:()=>t(!1),children:"Cancel"}),e.jsx(d,{onClick:()=>t(!1),children:"Confirm"})]})]})})]})}},k={render:()=>e.jsxs(i,{children:[e.jsx(i.Trigger,{asChild:!0,children:e.jsx(d,{children:"Open Dialog"})}),e.jsxs(i.Content,{children:[e.jsx(i.Close,{}),e.jsxs(i.Header,{children:[e.jsx(i.Title,{children:"Uncontrolled Dialog"}),e.jsx(i.Description,{children:"This dialog uses uncontrolled mode with Dialog.Trigger."})]}),e.jsx("div",{className:"p-6 pt-0",children:e.jsx("p",{children:"Click outside or press Escape to close."})})]})]})},N={render:()=>{const[n,t]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(d,{onClick:()=>t(!0),children:"Open Form Dialog"}),e.jsx(i,{open:n,onOpenChange:t,children:e.jsxs(i.Content,{size:"lg",children:[e.jsxs(i.Header,{children:[e.jsx(i.Title,{children:"Create New Item"}),e.jsx(i.Description,{children:"Fill in the form below to create a new item."})]}),e.jsxs("div",{className:"p-6 pt-0 space-y-4",children:[e.jsxs("div",{children:[e.jsx(Y,{htmlFor:"name",children:"Name"}),e.jsx(W,{id:"name",placeholder:"Enter name"})]}),e.jsxs("div",{children:[e.jsx(Y,{htmlFor:"email",children:"Email"}),e.jsx(W,{id:"email",type:"email",placeholder:"Enter email"})]})]}),e.jsxs(i.Footer,{children:[e.jsx(d,{variant:"outline",onClick:()=>t(!1),children:"Cancel"}),e.jsx(d,{onClick:()=>t(!1),children:"Create"})]})]})})]})}},w={render:()=>{const[n,t]=r.useState("md"),[o,a]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"space-x-2 mb-4",children:["sm","md","lg","xl","fullscreen"].map(l=>e.jsx(d,{variant:n===l?"primary":"outline",onClick:()=>{t(l),a(!0)},children:l},l))}),e.jsx(i,{open:o,onOpenChange:a,children:e.jsxs(i.Content,{size:n,children:[e.jsxs(i.Header,{children:[e.jsxs(i.Title,{children:["Dialog Size: ",n]}),e.jsxs(i.Description,{children:["This dialog demonstrates the ",n," size variant."]})]}),e.jsx("div",{className:"p-6 pt-0",children:e.jsxs("p",{children:["Content area for ",n," dialog."]})}),e.jsx(i.Footer,{children:e.jsx(d,{variant:"outline",onClick:()=>a(!1),children:"Close"})})]})})]})}},q={render:()=>{const[n,t]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(d,{onClick:()=>t(!0),children:"Open Dialog"}),e.jsx(i,{open:n,onOpenChange:t,children:e.jsxs(i.Content,{closeOnOverlayClick:!1,children:[e.jsxs(i.Header,{children:[e.jsx(i.Title,{children:"Important Dialog"}),e.jsx(i.Description,{children:"This dialog cannot be closed by clicking the overlay. You must use the close button or Escape key."})]}),e.jsx("div",{className:"p-6 pt-0",children:e.jsx("p",{children:"Click outside won't close this dialog."})}),e.jsx(i.Footer,{children:e.jsx(d,{onClick:()=>t(!1),children:"Close"})})]})})]})}},E={render:()=>{const[n,t]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(d,{onClick:()=>t(!0),children:"Open Alert"}),e.jsx(z,{open:n,onOpenChange:t,title:"Confirm Action",description:"Are you sure you want to proceed with this action?",onConfirm:()=>alert("Confirmed!")})]})}},F={render:()=>{const[n,t]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(d,{variant:"error",onClick:()=>t(!0),children:"Delete Item"}),e.jsx(z,{open:n,onOpenChange:t,title:"Delete Item",description:"Are you sure? This action cannot be undone.",variant:"destructive",confirmLabel:"Delete",cancelLabel:"Cancel",onConfirm:()=>alert("Deleted!")})]})}};var K,X,G;I.parameters=c(s({},I.parameters),{docs:c(s({},(K=I.parameters)==null?void 0:K.docs),{source:s({originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
              <Dialog.Description>
                This is a dialog description. It provides additional context about the dialog.
              </Dialog.Description>
            </Dialog.Header>
            <div className="p-6 pt-0">
              <p>Dialog content goes here.</p>
            </div>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Confirm</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>;
  }
}`},(G=(X=I.parameters)==null?void 0:X.docs)==null?void 0:G.source)})});var J,Q,Z;k.parameters=c(s({},k.parameters),{docs:c(s({},(J=k.parameters)==null?void 0:J.docs),{source:s({originalSource:`{
  render: () => <Dialog>
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Uncontrolled Dialog</Dialog.Title>
          <Dialog.Description>
            This dialog uses uncontrolled mode with Dialog.Trigger.
          </Dialog.Description>
        </Dialog.Header>
        <div className="p-6 pt-0">
          <p>Click outside or press Escape to close.</p>
        </div>
      </Dialog.Content>
    </Dialog>
}`},(Z=(Q=k.parameters)==null?void 0:Q.docs)==null?void 0:Z.source)})});var ee,ne,te;N.parameters=c(s({},N.parameters),{docs:c(s({},(ee=N.parameters)==null?void 0:ee.docs),{source:s({originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Form Dialog</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content size="lg">
            <Dialog.Header>
              <Dialog.Title>Create New Item</Dialog.Title>
              <Dialog.Description>
                Fill in the form below to create a new item.
              </Dialog.Description>
            </Dialog.Header>
            <div className="p-6 pt-0 space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
            </div>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Create</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>;
  }
}`},(te=(ne=N.parameters)==null?void 0:ne.docs)==null?void 0:te.source)})});var oe,ie,ae;w.parameters=c(s({},w.parameters),{docs:c(s({},(oe=w.parameters)==null?void 0:oe.docs),{source:s({originalSource:`{
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'>('md');
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <div className="space-x-2 mb-4">
          {(['sm', 'md', 'lg', 'xl', 'fullscreen'] as const).map(s => <Button key={s} variant={size === s ? 'primary' : 'outline'} onClick={() => {
          setSize(s);
          setIsOpen(true);
        }}>
              {s}
            </Button>)}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content size={size}>
            <Dialog.Header>
              <Dialog.Title>Dialog Size: {size}</Dialog.Title>
              <Dialog.Description>
                This dialog demonstrates the {size} size variant.
              </Dialog.Description>
            </Dialog.Header>
            <div className="p-6 pt-0">
              <p>Content area for {size} dialog.</p>
            </div>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>;
  }
}`},(ae=(ie=w.parameters)==null?void 0:ie.docs)==null?void 0:ae.source)})});var se,le,re;q.parameters=c(s({},q.parameters),{docs:c(s({},(se=q.parameters)==null?void 0:se.docs),{source:s({originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content closeOnOverlayClick={false}>
            <Dialog.Header>
              <Dialog.Title>Important Dialog</Dialog.Title>
              <Dialog.Description>
                This dialog cannot be closed by clicking the overlay. You must use the close button or Escape key.
              </Dialog.Description>
            </Dialog.Header>
            <div className="p-6 pt-0">
              <p>Click outside won't close this dialog.</p>
            </div>
            <Dialog.Footer>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>;
  }
}`},(re=(le=q.parameters)==null?void 0:le.docs)==null?void 0:re.source)})});var ce,de,pe;E.parameters=c(s({},E.parameters),{docs:c(s({},(ce=E.parameters)==null?void 0:ce.docs),{source:s({originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Alert</Button>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen} title="Confirm Action" description="Are you sure you want to proceed with this action?" onConfirm={() => alert('Confirmed!')} />
      </>;
  }
}`},(pe=(de=E.parameters)==null?void 0:de.docs)==null?void 0:pe.source)})});var ue,me,ge;F.parameters=c(s({},F.parameters),{docs:c(s({},(ue=F.parameters)==null?void 0:ue.docs),{source:s({originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button variant="error" onClick={() => setIsOpen(true)}>Delete Item</Button>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen} title="Delete Item" description="Are you sure? This action cannot be undone." variant="destructive" confirmLabel="Delete" cancelLabel="Cancel" onConfirm={() => alert('Deleted!')} />
      </>;
  }
}`},(ge=(me=F.parameters)==null?void 0:me.docs)==null?void 0:ge.source)})});const hn=["Default","Uncontrolled","WithForm","Sizes","WithoutOverlayClose","AlertDialogDefault","AlertDialogDestructive"];export{E as AlertDialogDefault,F as AlertDialogDestructive,I as Default,w as Sizes,k as Uncontrolled,N as WithForm,q as WithoutOverlayClose,hn as __namedExportsOrder,Dn as default};
