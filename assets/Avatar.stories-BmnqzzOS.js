var W=Object.defineProperty,X=Object.defineProperties;var V=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var _=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var g=(c,e,l)=>e in c?W(c,e,{enumerable:!0,configurable:!0,writable:!0,value:l}):c[e]=l,s=(c,e)=>{for(var l in e||(e={}))_.call(e,l)&&g(c,l,e[l]);if(b)for(var l of b(e))O.call(e,l)&&g(c,l,e[l]);return c},t=(c,e)=>X(c,V(e));import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{A as r,a as i}from"./AvatarGroup-QeYvIKtG.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./typography-BGNr2Ph4.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";const la={title:"Atoms/Avatar",component:r,parameters:{docs:{description:{component:"A versatile avatar component for displaying user profile images or initials. Supports fallback display when image fails to load or is not provided. Fully accessible with ARIA attributes."}}},tags:["autodocs"],argTypes:{src:{control:"text",description:"Image source URL"},alt:{control:"text",description:"Alt text for the image"},fallback:{control:"text",description:"Fallback text or element when image is not available"},size:{control:"select",options:["xs","sm","md","lg","xl"],description:"Size of the avatar"},variant:{control:"select",options:["circle","square","rounded"],description:"Shape variant of the avatar"}}},o={args:{fallback:"JD",alt:"John Doe",size:"md"}},m={args:{src:"https://i.pravatar.cc/150?img=1",alt:"User avatar",fallback:"JD",size:"md"}},p={render:()=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(r,{fallback:"XS",size:"xs",alt:"Extra small"}),a.jsx(r,{fallback:"SM",size:"sm",alt:"Small"}),a.jsx(r,{fallback:"MD",size:"md",alt:"Medium"}),a.jsx(r,{fallback:"LG",size:"lg",alt:"Large"}),a.jsx(r,{fallback:"XL",size:"xl",alt:"Extra large"})]}),parameters:{docs:{description:{story:"All available sizes of the avatar component."}}}},n={render:()=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(r,{fallback:"C",variant:"circle",alt:"Circle"}),a.jsx(r,{fallback:"R",variant:"rounded",alt:"Rounded"}),a.jsx(r,{fallback:"S",variant:"square",alt:"Square"})]}),parameters:{docs:{description:{story:"Different shape variants: circle, rounded, and square."}}}},d={render:()=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(r,{fallback:"JD",alt:"John Doe"}),a.jsx(r,{fallback:"AB",alt:"Alice Brown"}),a.jsx(r,{fallback:"CD",alt:"Charlie Davis"}),a.jsx(r,{fallback:"EF",alt:"Emma Foster"})]}),parameters:{docs:{description:{story:"Avatars with fallback initials when no image is provided."}}}},v={render:()=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(r,{src:"https://invalid-url.com/image.jpg",fallback:"JD",alt:"John Doe"}),a.jsx(r,{src:"",fallback:"AB",alt:"Alice Brown"})]}),parameters:{docs:{description:{story:"Avatars automatically fall back to initials when image fails to load or is not provided."}}}},x={render:()=>a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Small group (3 avatars)"}),a.jsxs(i,{max:3,size:"md",children:[a.jsx(r,{src:"https://i.pravatar.cc/150?img=1",alt:"User 1",fallback:"U1"}),a.jsx(r,{src:"https://i.pravatar.cc/150?img=2",alt:"User 2",fallback:"U2"}),a.jsx(r,{src:"https://i.pravatar.cc/150?img=3",alt:"User 3",fallback:"U3"})]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Large group with overflow (max 3)"}),a.jsxs(i,{max:3,size:"md",children:[a.jsx(r,{src:"https://i.pravatar.cc/150?img=1",alt:"User 1",fallback:"U1"}),a.jsx(r,{src:"https://i.pravatar.cc/150?img=2",alt:"User 2",fallback:"U2"}),a.jsx(r,{src:"https://i.pravatar.cc/150?img=3",alt:"User 3",fallback:"U3"}),a.jsx(r,{src:"https://i.pravatar.cc/150?img=4",alt:"User 4",fallback:"U4"}),a.jsx(r,{src:"https://i.pravatar.cc/150?img=5",alt:"User 5",fallback:"U5"})]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Group with fallbacks only"}),a.jsxs(i,{max:4,size:"md",children:[a.jsx(r,{fallback:"JD",alt:"John Doe"}),a.jsx(r,{fallback:"AB",alt:"Alice Brown"}),a.jsx(r,{fallback:"CD",alt:"Charlie Davis"}),a.jsx(r,{fallback:"EF",alt:"Emma Foster"}),a.jsx(r,{fallback:"GH",alt:"George Hill"})]})]})]}),parameters:{docs:{description:{story:'AvatarGroup displays multiple avatars with automatic overflow handling. Shows a "+N" avatar when there are more than the max number.'}}}},f={render:()=>a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"No spacing"}),a.jsxs(i,{max:5,spacing:"none",children:[a.jsx(r,{fallback:"1"}),a.jsx(r,{fallback:"2"}),a.jsx(r,{fallback:"3"})]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Small spacing"}),a.jsxs(i,{max:5,spacing:"sm",children:[a.jsx(r,{fallback:"1"}),a.jsx(r,{fallback:"2"}),a.jsx(r,{fallback:"3"})]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Medium spacing (default)"}),a.jsxs(i,{max:5,spacing:"md",children:[a.jsx(r,{fallback:"1"}),a.jsx(r,{fallback:"2"}),a.jsx(r,{fallback:"3"})]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Large spacing"}),a.jsxs(i,{max:5,spacing:"lg",children:[a.jsx(r,{fallback:"1"}),a.jsx(r,{fallback:"2"}),a.jsx(r,{fallback:"3"})]})]})]}),parameters:{docs:{description:{story:"Different spacing options for AvatarGroup."}}}};var h,k,u;o.parameters=t(s({},o.parameters),{docs:t(s({},(h=o.parameters)==null?void 0:h.docs),{source:s({originalSource:`{
  args: {
    fallback: 'JD',
    alt: 'John Doe',
    size: 'md'
  }
}`},(u=(k=o.parameters)==null?void 0:k.docs)==null?void 0:u.source)})});var A,j,y;m.parameters=t(s({},m.parameters),{docs:t(s({},(A=m.parameters)==null?void 0:A.docs),{source:s({originalSource:`{
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'User avatar',
    fallback: 'JD',
    size: 'md'
  }
}`},(y=(j=m.parameters)==null?void 0:j.docs)==null?void 0:y.source)})});var U,D,G;p.parameters=t(s({},p.parameters),{docs:t(s({},(U=p.parameters)==null?void 0:U.docs),{source:s({originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Avatar fallback="XS" size="xs" alt="Extra small" />
      <Avatar fallback="SM" size="sm" alt="Small" />
      <Avatar fallback="MD" size="md" alt="Medium" />
      <Avatar fallback="LG" size="lg" alt="Large" />
      <Avatar fallback="XL" size="xl" alt="Extra large" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available sizes of the avatar component.'
      }
    }
  }
}`},(G=(D=p.parameters)==null?void 0:D.docs)==null?void 0:G.source)})});var S,N,w;n.parameters=t(s({},n.parameters),{docs:t(s({},(S=n.parameters)==null?void 0:S.docs),{source:s({originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Avatar fallback="C" variant="circle" alt="Circle" />
      <Avatar fallback="R" variant="rounded" alt="Rounded" />
      <Avatar fallback="S" variant="square" alt="Square" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Different shape variants: circle, rounded, and square.'
      }
    }
  }
}`},(w=(N=n.parameters)==null?void 0:N.docs)==null?void 0:w.source)})});var z,J,E;d.parameters=t(s({},d.parameters),{docs:t(s({},(z=d.parameters)==null?void 0:z.docs),{source:s({originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Avatar fallback="JD" alt="John Doe" />
      <Avatar fallback="AB" alt="Alice Brown" />
      <Avatar fallback="CD" alt="Charlie Davis" />
      <Avatar fallback="EF" alt="Emma Foster" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Avatars with fallback initials when no image is provided.'
      }
    }
  }
}`},(E=(J=d.parameters)==null?void 0:J.docs)==null?void 0:E.source)})});var B,C,F;v.parameters=t(s({},v.parameters),{docs:t(s({},(B=v.parameters)==null?void 0:B.docs),{source:s({originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Avatar src="https://invalid-url.com/image.jpg" fallback="JD" alt="John Doe" />
      <Avatar src="" fallback="AB" alt="Alice Brown" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Avatars automatically fall back to initials when image fails to load or is not provided.'
      }
    }
  }
}`},(F=(C=v.parameters)==null?void 0:C.docs)==null?void 0:F.source)})});var L,M,q;x.parameters=t(s({},x.parameters),{docs:t(s({},(L=x.parameters)==null?void 0:L.docs),{source:s({originalSource:`{
  render: () => <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Small group (3 avatars)</p>
        <AvatarGroup max={3} size="md">
          <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" fallback="U1" />
          <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" fallback="U2" />
          <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" fallback="U3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Large group with overflow (max 3)</p>
        <AvatarGroup max={3} size="md">
          <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" fallback="U1" />
          <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" fallback="U2" />
          <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" fallback="U3" />
          <Avatar src="https://i.pravatar.cc/150?img=4" alt="User 4" fallback="U4" />
          <Avatar src="https://i.pravatar.cc/150?img=5" alt="User 5" fallback="U5" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Group with fallbacks only</p>
        <AvatarGroup max={4} size="md">
          <Avatar fallback="JD" alt="John Doe" />
          <Avatar fallback="AB" alt="Alice Brown" />
          <Avatar fallback="CD" alt="Charlie Davis" />
          <Avatar fallback="EF" alt="Emma Foster" />
          <Avatar fallback="GH" alt="George Hill" />
        </AvatarGroup>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'AvatarGroup displays multiple avatars with automatic overflow handling. Shows a "+N" avatar when there are more than the max number.'
      }
    }
  }
}`},(q=(M=x.parameters)==null?void 0:M.docs)==null?void 0:q.source)})});var R,I,H;f.parameters=t(s({},f.parameters),{docs:t(s({},(R=f.parameters)==null?void 0:R.docs),{source:s({originalSource:`{
  render: () => <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">No spacing</p>
        <AvatarGroup max={5} spacing="none">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Small spacing</p>
        <AvatarGroup max={5} spacing="sm">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Medium spacing (default)</p>
        <AvatarGroup max={5} spacing="md">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Large spacing</p>
        <AvatarGroup max={5} spacing="lg">
          <Avatar fallback="1" />
          <Avatar fallback="2" />
          <Avatar fallback="3" />
        </AvatarGroup>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Different spacing options for AvatarGroup.'
      }
    }
  }
}`},(H=(I=f.parameters)==null?void 0:I.docs)==null?void 0:H.source)})});const ca=["Default","WithImage","Sizes","Variants","WithFallback","ImageError","Group","GroupSpacing"];export{o as Default,x as Group,f as GroupSpacing,v as ImageError,p as Sizes,n as Variants,d as WithFallback,m as WithImage,ca as __namedExportsOrder,la as default};
