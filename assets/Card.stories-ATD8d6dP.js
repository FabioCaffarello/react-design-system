var G=Object.defineProperty,J=Object.defineProperties;var K=Object.getOwnPropertyDescriptors;var u=Object.getOwnPropertySymbols;var Q=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable;var b=(i,t,n)=>t in i?G(i,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[t]=n,a=(i,t)=>{for(var n in t||(t={}))Q.call(t,n)&&b(i,n,t[n]);if(u)for(var n of u(t))U.call(t,n)&&b(i,n,t[n]);return i},r=(i,t)=>J(i,K(t));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as X}from"./Card-Dt4JI1Iu.js";import"./Info-Cv2nzaKC.js";import{T as s}from"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import{B as T}from"./Button-CioV4BCG.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";const $e={title:"Molecules/Card",component:X,parameters:{docs:{description:{component:"A versatile card component for displaying content in containers. Supports multiple variants and padding options."}}},argTypes:{variant:{control:"select",options:["default","hover","selected"],description:"Visual variant of the card"},padding:{control:"select",options:["none","small","medium","large"],description:"Padding size"},onClick:{control:!1,description:"Click handler. When provided, card becomes interactive with keyboard support."},"aria-label":{control:"text",description:"Accessible label for interactive cards"},"aria-labelledby":{control:"text",description:"ID of element that labels the card"}}},o={args:{children:e.jsxs(e.Fragment,{children:[e.jsx(s,{as:"h3",className:"text-lg font-semibold mb-2",children:"Card Title"}),e.jsx(s,{as:"p",className:"text-gray-600",children:"This is a default card with medium padding."})]})}},c={args:{variant:"hover",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{as:"h3",className:"text-lg font-semibold mb-2",children:"Hover Card"}),e.jsx(s,{as:"p",className:"text-gray-600",children:"This card has hover effects. Hover over it!"})]})}},d={args:{variant:"selected",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{as:"h3",className:"text-lg font-semibold mb-2",children:"Selected Card"}),e.jsx(s,{as:"p",className:"text-gray-600",children:"This card appears selected with a blue border."})]})}},l={args:{padding:"small",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{as:"h3",className:"text-lg font-semibold mb-2",children:"Small Padding"}),e.jsx(s,{as:"p",className:"text-gray-600",children:"This card has small padding."})]})}},m={args:{padding:"large",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{as:"h3",className:"text-lg font-semibold mb-2",children:"Large Padding"}),e.jsx(s,{as:"p",className:"text-gray-600",children:"This card has large padding for more spacious content."})]})}},p={args:{variant:"hover",padding:"large",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{as:"h3",className:"text-lg font-semibold mb-2",children:"Card with Actions"}),e.jsx(s,{as:"p",className:"text-gray-600 mb-4",children:"This card includes action buttons."}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(T,{variant:"regular",children:"Primary Action"}),e.jsx(T,{variant:"secondary",children:"Secondary"})]})]})}},h={args:{padding:"none",children:e.jsxs("div",{className:"p-4",children:[e.jsx(s,{as:"h3",className:"text-lg font-semibold mb-2",children:"No Padding Card"}),e.jsx(s,{as:"p",className:"text-gray-600",children:"This card has no default padding. Content controls its own spacing."})]})}},g={args:{variant:"hover",onClick:()=>alert("Card clicked!"),"aria-label":"Clickable card example",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{as:"h3",className:"text-lg font-semibold mb-2",children:"Interactive Card"}),e.jsx(s,{as:"p",className:"text-gray-600",children:"This card is clickable. Press Enter or Space when focused to activate."})]})},parameters:{docs:{description:{story:"Interactive cards support keyboard navigation. Tab to focus, then press Enter or Space to activate."}}}},x={args:{variant:"hover",onClick:()=>alert("Card clicked!"),"aria-label":"Product card: Premium Plan - $99/month",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{as:"h3",className:"text-lg font-semibold mb-2",children:"Premium Plan"}),e.jsx(s,{as:"p",className:"text-gray-600 mb-2",children:"$99/month"}),e.jsx(s,{as:"p",className:"text-sm text-gray-500",children:"Includes all features"})]})}};var v,f,N;o.parameters=r(a({},o.parameters),{docs:r(a({},(v=o.parameters)==null?void 0:v.docs),{source:a({originalSource:`{
  args: {
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Card Title</Text>
        <Text as="p" className="text-gray-600">This is a default card with medium padding.</Text>
      </>
  }
}`},(N=(f=o.parameters)==null?void 0:f.docs)==null?void 0:N.source)})});var y,j,C;c.parameters=r(a({},c.parameters),{docs:r(a({},(y=c.parameters)==null?void 0:y.docs),{source:a({originalSource:`{
  args: {
    variant: "hover",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Hover Card</Text>
        <Text as="p" className="text-gray-600">This card has hover effects. Hover over it!</Text>
      </>
  }
}`},(C=(j=c.parameters)==null?void 0:j.docs)==null?void 0:C.source)})});var P,S,k;d.parameters=r(a({},d.parameters),{docs:r(a({},(P=d.parameters)==null?void 0:P.docs),{source:a({originalSource:`{
  args: {
    variant: "selected",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Selected Card</Text>
        <Text as="p" className="text-gray-600">This card appears selected with a blue border.</Text>
      </>
  }
}`},(k=(S=d.parameters)==null?void 0:S.docs)==null?void 0:k.source)})});var w,A,I;l.parameters=r(a({},l.parameters),{docs:r(a({},(w=l.parameters)==null?void 0:w.docs),{source:a({originalSource:`{
  args: {
    padding: "small",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Small Padding</Text>
        <Text as="p" className="text-gray-600">This card has small padding.</Text>
      </>
  }
}`},(I=(A=l.parameters)==null?void 0:A.docs)==null?void 0:I.source)})});var W,F,B;m.parameters=r(a({},m.parameters),{docs:r(a({},(W=m.parameters)==null?void 0:W.docs),{source:a({originalSource:`{
  args: {
    padding: "large",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Large Padding</Text>
        <Text as="p" className="text-gray-600">This card has large padding for more spacious content.</Text>
      </>
  }
}`},(B=(F=m.parameters)==null?void 0:F.docs)==null?void 0:B.source)})});var E,H,L;p.parameters=r(a({},p.parameters),{docs:r(a({},(E=p.parameters)==null?void 0:E.docs),{source:a({originalSource:`{
  args: {
    variant: "hover",
    padding: "large",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Card with Actions</Text>
        <Text as="p" className="text-gray-600 mb-4">This card includes action buttons.</Text>
        <div className="flex gap-2">
          <Button variant="regular">Primary Action</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </>
  }
}`},(L=(H=p.parameters)==null?void 0:H.docs)==null?void 0:L.source)})});var $,D,_;h.parameters=r(a({},h.parameters),{docs:r(a({},($=h.parameters)==null?void 0:$.docs),{source:a({originalSource:`{
  args: {
    padding: "none",
    children: <div className="p-4">
        <Text as="h3" className="text-lg font-semibold mb-2">No Padding Card</Text>
        <Text as="p" className="text-gray-600">This card has no default padding. Content controls its own spacing.</Text>
      </div>
  }
}`},(_=(D=h.parameters)==null?void 0:D.docs)==null?void 0:_.source)})});var z,M,O;g.parameters=r(a({},g.parameters),{docs:r(a({},(z=g.parameters)==null?void 0:z.docs),{source:a({originalSource:`{
  args: {
    variant: "hover",
    onClick: () => alert("Card clicked!"),
    'aria-label': "Clickable card example",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Interactive Card</Text>
        <Text as="p" className="text-gray-600">This card is clickable. Press Enter or Space when focused to activate.</Text>
      </>
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive cards support keyboard navigation. Tab to focus, then press Enter or Space to activate."
      }
    }
  }
}`},(O=(M=g.parameters)==null?void 0:M.docs)==null?void 0:O.source)})});var R,V,q;x.parameters=r(a({},x.parameters),{docs:r(a({},(R=x.parameters)==null?void 0:R.docs),{source:a({originalSource:`{
  args: {
    variant: "hover",
    onClick: () => alert("Card clicked!"),
    'aria-label': "Product card: Premium Plan - $99/month",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Premium Plan</Text>
        <Text as="p" className="text-gray-600 mb-2">$99/month</Text>
        <Text as="p" className="text-sm text-gray-500">Includes all features</Text>
      </>
  }
}`},(q=(V=x.parameters)==null?void 0:V.docs)==null?void 0:q.source)})});const De=["Default","Hover","Selected","WithPaddingSmall","WithPaddingLarge","WithActions","NoPadding","Interactive","WithAriaLabel"];export{o as Default,c as Hover,g as Interactive,h as NoPadding,d as Selected,p as WithActions,x as WithAriaLabel,m as WithPaddingLarge,l as WithPaddingSmall,De as __namedExportsOrder,$e as default};
