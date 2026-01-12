var E=Object.defineProperty,k=Object.defineProperties;var I=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var N=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var C=(e,a,r)=>a in e?E(e,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[a]=r,y=(e,a)=>{for(var r in a||(a={}))N.call(a,r)&&C(e,r,a[r]);if(f)for(var r of f(a))$.call(a,r)&&C(e,r,a[r]);return e},A=(e,a)=>k(e,I(a));var w=(e,a)=>{var r={};for(var t in e)N.call(e,t)&&a.indexOf(t)<0&&(r[t]=e[t]);if(e!=null&&f)for(var t of f(e))a.indexOf(t)<0&&$.call(e,t)&&(r[t]=e[t]);return r};import{j as i}from"./jsx-runtime-D_zvdyIk.js";import{r as d}from"./iframe-38FCFUQv.js";import{g as T}from"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./typography-BGNr2Ph4.js";import{g as b}from"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";function j(x){var p=x,{src:e,alt:a,fallback:r,size:t="md",variant:o="circle","aria-label":v,className:g=""}=p,q=w(p,["src","alt","fallback","size","variant","aria-label","className"]);const[l,h]=d.useState(!1),[m,s]=d.useState(!1),c={xs:"h-6 w-6 text-xs",sm:"h-8 w-8 text-sm",md:"h-10 w-10 text-base",lg:"h-12 w-12 text-lg",xl:"h-16 w-16 text-xl"},n={circle:b("full"),square:b("none"),rounded:b("md")},u=!e||l,z=typeof r=="string"?r.toUpperCase().slice(0,2):r,V=v||a||"User avatar";return i.jsxs("div",A(y({className:`
        relative
        inline-flex
        items-center
        justify-center
        flex-shrink-0
        ${c[t]}
        ${n[o]}
        ${T("neutral","light","bg")}
        ${T("neutral","dark","text")}
        font-medium
        overflow-hidden
        ${g}
      `,role:"img","aria-label":V},q),{children:[!u&&e&&i.jsx("img",{src:e,alt:a||"",className:`
            w-full
            h-full
            object-cover
            ${n[o]}
            ${m?"opacity-100":"opacity-0"}
            transition-opacity
            duration-200
          `,onLoad:()=>s(!0),onError:()=>{h(!0),s(!1)},"aria-hidden":"true"}),u&&i.jsx("span",{className:`
            flex
            items-center
            justify-center
            w-full
            h-full
            ${n[o]}
          `,"aria-hidden":"true",children:z||"?"})]}))}j.__docgenInfo={description:`Avatar Component

A versatile avatar component for displaying user profile images or initials.
Supports fallback display when image fails to load or is not provided.
Fully accessible with ARIA attributes.

@example
\`\`\`tsx
// With image
<Avatar src="/user.jpg" alt="John Doe" />

// With fallback initials
<Avatar fallback="JD" alt="John Doe" />

// Custom size
<Avatar src="/user.jpg" size="lg" />
\`\`\``,methods:[],displayName:"Avatar",props:{src:{required:!1,tsType:{name:"string"},description:""},alt:{required:!1,tsType:{name:"string"},description:""},fallback:{required:!1,tsType:{name:"union",raw:"string | ReactNode",elements:[{name:"string"},{name:"ReactNode"}]},description:""},size:{required:!1,tsType:{name:"union",raw:"'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'circle' | 'square' | 'rounded'",elements:[{name:"literal",value:"'circle'"},{name:"literal",value:"'square'"},{name:"literal",value:"'rounded'"}]},description:"",defaultValue:{value:"'circle'",computed:!1}},"aria-label":{required:!1,tsType:{name:"string"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};function R(q){var x=q,{children:e,max:a=3,size:r="md",variant:t="circle",spacing:o="md",className:v=""}=x,g=w(x,["children","max","size","variant","spacing","className"]);const p={none:"",sm:"-space-x-1",md:"-space-x-2",lg:"-space-x-3"},l=d.Children.toArray(e).filter(Boolean),h=l.slice(0,a),m=l.length-a;return i.jsxs("div",A(y({className:`
        flex
        items-center
        ${p[o]}
        ${v}
      `,role:"group","aria-label":`${l.length} avatars`},g),{children:[h.map((s,c)=>{let n=s;if(d.isValidElement(s)&&s.type===j){const u=s.props;n=d.cloneElement(s,{size:u.size||r,variant:u.variant||t})}return i.jsx("div",{className:"ring-2 ring-white",style:{zIndex:l.length-c},children:n},c)}),m>0&&i.jsx(j,{size:r,variant:t,fallback:`+${m}`,"aria-label":`${m} more avatars`,className:"ring-2 ring-white",style:{zIndex:0}})]}))}R.__docgenInfo={description:`AvatarGroup Component

Container for displaying multiple avatars in a group.
Supports collapsing when there are too many avatars.

@example
\`\`\`tsx
<AvatarGroup max={3}>
  <Avatar src="/user1.jpg" alt="User 1" />
  <Avatar src="/user2.jpg" alt="User 2" />
  <Avatar src="/user3.jpg" alt="User 3" />
  <Avatar src="/user4.jpg" alt="User 4" />
</AvatarGroup>
\`\`\``,methods:[],displayName:"AvatarGroup",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},max:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"3",computed:!1}},size:{required:!1,tsType:{name:"AvatarProps['size']",raw:"AvatarProps['size']"},description:"",defaultValue:{value:"'md'",computed:!1}},variant:{required:!1,tsType:{name:"AvatarProps['variant']",raw:"AvatarProps['variant']"},description:"",defaultValue:{value:"'circle'",computed:!1}},spacing:{required:!1,tsType:{name:"union",raw:"'none' | 'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'none'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};export{j as A,R as a};
