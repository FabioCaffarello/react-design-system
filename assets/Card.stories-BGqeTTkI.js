import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{C as l}from"./Card-MDeOd8FB.js";import"./Info-U_k6auVY.js";import{T as e}from"./Text-DnccNZVU.js";import"./Input-Jvd9VoKL.js";import{B as c}from"./Button-DNuH21C6.js";import"./BoxWrapper-9zxAwNht.js";import"./Badge-B3jnsIqK.js";import"./Select-C5fpSU2z.js";import"./Textarea-lHY0thNE.js";const v={title:"UI/Molecules/Card",component:l,parameters:{docs:{description:{component:"A versatile card component for displaying content in containers. Supports multiple variants and padding options."}}},argTypes:{variant:{control:"select",options:["default","hover","selected"],description:"Visual variant of the card"},padding:{control:"select",options:["none","small","medium","large"],description:"Padding size"}}},s={args:{children:a.jsxs(a.Fragment,{children:[a.jsx(e,{as:"h3",className:"text-lg font-semibold mb-2",children:"Card Title"}),a.jsx(e,{as:"p",className:"text-gray-600",children:"This is a default card with medium padding."})]})}},r={args:{variant:"hover",children:a.jsxs(a.Fragment,{children:[a.jsx(e,{as:"h3",className:"text-lg font-semibold mb-2",children:"Hover Card"}),a.jsx(e,{as:"p",className:"text-gray-600",children:"This card has hover effects. Hover over it!"})]})}},t={args:{variant:"selected",children:a.jsxs(a.Fragment,{children:[a.jsx(e,{as:"h3",className:"text-lg font-semibold mb-2",children:"Selected Card"}),a.jsx(e,{as:"p",className:"text-gray-600",children:"This card appears selected with a blue border."})]})}},n={args:{padding:"small",children:a.jsxs(a.Fragment,{children:[a.jsx(e,{as:"h3",className:"text-lg font-semibold mb-2",children:"Small Padding"}),a.jsx(e,{as:"p",className:"text-gray-600",children:"This card has small padding."})]})}},d={args:{padding:"large",children:a.jsxs(a.Fragment,{children:[a.jsx(e,{as:"h3",className:"text-lg font-semibold mb-2",children:"Large Padding"}),a.jsx(e,{as:"p",className:"text-gray-600",children:"This card has large padding for more spacious content."})]})}},i={args:{variant:"hover",padding:"large",children:a.jsxs(a.Fragment,{children:[a.jsx(e,{as:"h3",className:"text-lg font-semibold mb-2",children:"Card with Actions"}),a.jsx(e,{as:"p",className:"text-gray-600 mb-4",children:"This card includes action buttons."}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx(c,{variant:"regular",children:"Primary Action"}),a.jsx(c,{variant:"secondary",children:"Secondary"})]})]})}},o={args:{padding:"none",children:a.jsxs("div",{className:"p-4",children:[a.jsx(e,{as:"h3",className:"text-lg font-semibold mb-2",children:"No Padding Card"}),a.jsx(e,{as:"p",className:"text-gray-600",children:"This card has no default padding. Content controls its own spacing."})]})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Card Title</Text>
        <Text as="p" className="text-gray-600">This is a default card with medium padding.</Text>
      </>
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "hover",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Hover Card</Text>
        <Text as="p" className="text-gray-600">This card has hover effects. Hover over it!</Text>
      </>
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "selected",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Selected Card</Text>
        <Text as="p" className="text-gray-600">This card appears selected with a blue border.</Text>
      </>
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    padding: "small",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Small Padding</Text>
        <Text as="p" className="text-gray-600">This card has small padding.</Text>
      </>
  }
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    padding: "large",
    children: <>
        <Text as="h3" className="text-lg font-semibold mb-2">Large Padding</Text>
        <Text as="p" className="text-gray-600">This card has large padding for more spacious content.</Text>
      </>
  }
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    padding: "none",
    children: <div className="p-4">
        <Text as="h3" className="text-lg font-semibold mb-2">No Padding Card</Text>
        <Text as="p" className="text-gray-600">This card has no default padding. Content controls its own spacing.</Text>
      </div>
  }
}`,...o.parameters?.docs?.source}}};const j=["Default","Hover","Selected","WithPaddingSmall","WithPaddingLarge","WithActions","NoPadding"];export{s as Default,r as Hover,o as NoPadding,t as Selected,i as WithActions,d as WithPaddingLarge,n as WithPaddingSmall,j as __namedExportsOrder,v as default};
