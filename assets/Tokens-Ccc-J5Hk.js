var u=Object.defineProperty,f=Object.defineProperties;var y=Object.getOwnPropertyDescriptors;var o=Object.getOwnPropertySymbols;var C=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var a=(i,s,n)=>s in i?u(i,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[s]=n,l=(i,s)=>{for(var n in s||(s={}))C.call(s,n)&&a(i,n,s[n]);if(o)for(var n of o(s))b.call(s,n)&&a(i,n,s[n]);return i},t=(i,s)=>f(i,y(s));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as x}from"./index-4L7o7Sqz.js";import{M as w}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import{C as k}from"./colors-BnDqA8Th.js";import{S as T}from"./spacing-Bf5iY5pu.js";import"./typography-BGNr2Ph4.js";import{S as v}from"./shadows-B52VkgOA.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function j(){const i=["primary","secondary","success","warning","error","info","neutral"];return e.jsx("div",{className:"space-y-6",children:i.map(s=>{const n=k[s];return e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-700 capitalize",children:s}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(r,{label:"light",color:n.light.hex,textColor:n.light.contrast||"#000"}),e.jsx(r,{label:"DEFAULT",color:n.DEFAULT.hex,textColor:n.DEFAULT.contrast||"#fff"}),e.jsx(r,{label:"dark",color:n.dark.hex,textColor:n.dark.contrast||"#fff"}),e.jsx(r,{label:"contrast",color:n.contrast.hex,textColor:n.DEFAULT.hex})]}),e.jsxs("div",{className:"text-xs text-gray-500 space-y-1",children:[e.jsxs("div",{children:["Light: ",n.light.hex," (",n.light.tailwind,")"]}),e.jsxs("div",{children:["Default: ",n.DEFAULT.hex," (",n.DEFAULT.tailwind,")"]}),e.jsxs("div",{children:["Dark: ",n.dark.hex," (",n.dark.tailwind,")"]})]})]},s)})})}function r({label:i,color:s,textColor:n}){return e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("div",{className:"w-20 h-20 rounded-md border border-gray-200 flex items-center justify-center text-xs font-medium",style:{backgroundColor:s,color:n},children:i}),e.jsx("span",{className:"text-xs text-gray-600",children:i})]})}function g(){const i=Object.entries(T);return e.jsx("div",{className:"space-y-4",children:i.map(([s,n])=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-32 text-sm font-medium text-gray-700",children:s}),e.jsxs("div",{className:"flex-1 flex items-center gap-2",children:[e.jsx("div",{className:"bg-indigo-500 h-4",style:{width:n.px}}),e.jsxs("span",{className:"text-xs text-gray-600",children:[n.px," (",n.rem,")"]})]}),e.jsx("div",{className:"w-24 text-xs text-gray-500 font-mono",children:n.tailwind})]},s))})}function p(){const i=[{name:"h1",size:"4xl",weight:"bold",lineHeight:"tight"},{name:"h2",size:"3xl",weight:"bold",lineHeight:"tight"},{name:"h3",size:"2xl",weight:"semibold",lineHeight:"snug"},{name:"body",size:"base",weight:"normal",lineHeight:"relaxed"},{name:"label",size:"sm",weight:"medium",lineHeight:"normal"},{name:"caption",size:"xs",weight:"normal",lineHeight:"normal"}];return e.jsx("div",{className:"space-y-4",children:i.map(({name:s,size:n,weight:d,lineHeight:c})=>e.jsxs("div",{className:"border-b border-gray-200 pb-4",children:[e.jsxs("div",{className:"flex items-baseline gap-4",children:[e.jsx("div",{className:"w-24 text-sm font-medium text-gray-700",children:s}),e.jsx("div",{className:`text-${n} font-${d} leading-${c}`,children:"The quick brown fox jumps over the lazy dog"})]}),e.jsxs("div",{className:"mt-2 text-xs text-gray-500",children:["Size: ",n," | Weight: ",d," | Line Height: ",c]})]},s))})}function m(){const i=Object.entries(v);return e.jsx("div",{className:"grid grid-cols-2 gap-4",children:i.map(([s,n])=>e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"text-sm font-medium text-gray-700",children:s}),e.jsx("div",{className:"w-full h-20 bg-white rounded-md flex items-center justify-center",style:{boxShadow:n.value},children:e.jsx("span",{className:"text-xs text-gray-600",children:n.description})}),e.jsx("div",{className:"text-xs text-gray-500 font-mono",children:n.tailwind})]},s))})}j.__docgenInfo={description:"Color Palette Visualization",methods:[],displayName:"ColorPalette"};g.__docgenInfo={description:"Spacing Reference Visualization",methods:[],displayName:"SpacingReference"};p.__docgenInfo={description:"Typography Reference Visualization",methods:[],displayName:"TypographyReference"};m.__docgenInfo={description:"Shadow Reference Visualization",methods:[],displayName:"ShadowReference"};function h(i){const s=l(l({code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},x()),i.components);return e.jsxs(e.Fragment,{children:[e.jsx(w,{title:"Design System/Tokens"}),`
`,e.jsx(s.h1,{id:"design-tokens",children:"Design Tokens"}),`
`,e.jsx(s.p,{children:"Design tokens are the foundational visual design atoms of the design system. They represent design decisions about colors, spacing, typography, shadows, and more. Using tokens ensures consistency across all components and makes it easy to maintain and update the design system."}),`
`,e.jsx(s.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(s.p,{children:["The design token system uses a ",e.jsx(s.strong,{children:"Factory Pattern"})," to create type-safe tokens consistently. All tokens follow a standardized structure and can be accessed through helper functions."]}),`
`,e.jsx(s.h2,{id:"color-tokens",children:"Color Tokens"}),`
`,e.jsx(s.p,{children:"Color tokens provide semantic color values with support for light and dark themes."}),`
`,e.jsx(s.h3,{id:"color-roles",children:"Color Roles"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"primary"})," - Primary brand color"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"secondary"})," - Secondary brand color"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"success"})," - Success states and positive actions"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"warning"})," - Warning states and caution"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"error"})," - Error states and destructive actions"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"info"})," - Informational content"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"neutral"})," - Neutral grays for text and backgrounds"]}),`
`]}),`
`,e.jsx(s.h3,{id:"color-shades",children:"Color Shades"}),`
`,e.jsx(s.p,{children:"Each color role has four shades:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"light"})," - Lightest variant"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"DEFAULT"})," - Default/main color"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"dark"})," - Darkest variant"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"contrast"})," - Contrast color for text on colored backgrounds"]}),`
`]}),`
`,e.jsx(s.h3,{id:"usage",children:"Usage"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { getColorClass } from '@fabio.caffarello/react-design-system';

// Background color
const bgClass = getColorClass('primary', 'DEFAULT', 'bg'); // 'bg-indigo-500'

// Text color
const textClass = getColorClass('error', 'dark', 'text'); // 'text-red-600'

// Border color
const borderClass = getColorClass('neutral', 'DEFAULT', 'border'); // 'border-gray-300'
`})}),`
`,e.jsx(s.h3,{id:"color-palette",children:"Color Palette"}),`
`,e.jsx(j,{}),`
`,e.jsx(s.h2,{id:"spacing-tokens",children:"Spacing Tokens"}),`
`,e.jsx(s.p,{children:"Spacing tokens are based on a 4px base unit, providing consistent spacing throughout the design system."}),`
`,e.jsx(s.h3,{id:"spacing-scale",children:"Spacing Scale"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"xs"})," - 4px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"sm"})," - 8px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"md"})," - 12px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"base"})," - 16px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"lg"})," - 24px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"xl"})," - 32px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"2xl"})," - 40px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"3xl"})," - 48px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"4xl"})," - 64px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"5xl"})," - 80px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"6xl"})," - 96px"]}),`
`]}),`
`,e.jsx(s.h3,{id:"usage-1",children:"Usage"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { getSpacingClass } from '@fabio.caffarello/react-design-system';

// Padding
const paddingClass = getSpacingClass('md', 'p'); // 'p-3'

// Margin
const marginClass = getSpacingClass('lg', 'mx'); // 'mx-6'

// Gap
const gapClass = getSpacingClass('base', 'gap'); // 'gap-4'
`})}),`
`,e.jsx(s.h3,{id:"spacing-reference",children:"Spacing Reference"}),`
`,e.jsx(g,{}),`
`,e.jsx(s.h2,{id:"typography-tokens",children:"Typography Tokens"}),`
`,e.jsx(s.p,{children:"Typography tokens define font sizes, weights, and line heights for consistent text styling."}),`
`,e.jsx(s.h3,{id:"font-sizes",children:"Font Sizes"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"xs"})," - 12px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"sm"})," - 14px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"base"})," - 16px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"lg"})," - 18px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"xl"})," - 20px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"2xl"})," - 24px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"3xl"})," - 30px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"4xl"})," - 36px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"5xl"})," - 48px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"6xl"})," - 60px"]}),`
`]}),`
`,e.jsx(s.h3,{id:"font-weights",children:"Font Weights"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"light"})," - 300"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"normal"})," - 400"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"medium"})," - 500"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"semibold"})," - 600"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"bold"})," - 700"]}),`
`]}),`
`,e.jsx(s.h3,{id:"usage-2",children:"Usage"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { getTypographyClasses } from '@fabio.caffarello/react-design-system';

// Heading styles
const h1Classes = getTypographyClasses('h1'); // 'text-4xl leading-tight font-bold'
const h2Classes = getTypographyClasses('h2'); // 'text-3xl leading-tight font-bold'
const bodyClasses = getTypographyClasses('body'); // 'text-base leading-relaxed font-normal'
`})}),`
`,e.jsx(s.h3,{id:"typography-reference",children:"Typography Reference"}),`
`,e.jsx(p,{}),`
`,e.jsx(s.h2,{id:"shadow-tokens",children:"Shadow Tokens"}),`
`,e.jsx(s.p,{children:"Shadow tokens provide consistent elevation and depth."}),`
`,e.jsx(s.h3,{id:"shadow-sizes",children:"Shadow Sizes"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"none"})," - No shadow"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"sm"})," - Small shadow for subtle elevation"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"md"})," - Medium shadow for cards"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"lg"})," - Large shadow for modals"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"xl"})," - Extra large shadow"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"2xl"})," - 2X large shadow"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"inner"})," - Inner shadow"]}),`
`]}),`
`,e.jsx(s.h3,{id:"usage-3",children:"Usage"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { getShadowClass } from '@fabio.caffarello/react-design-system';

const shadowClass = getShadowClass('lg'); // 'shadow-lg'
`})}),`
`,e.jsx(s.h3,{id:"shadow-reference",children:"Shadow Reference"}),`
`,e.jsx(m,{}),`
`,e.jsx(s.h2,{id:"radius-tokens",children:"Radius Tokens"}),`
`,e.jsx(s.p,{children:"Radius tokens define border radius values for rounded corners."}),`
`,e.jsx(s.h3,{id:"radius-sizes",children:"Radius Sizes"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"none"})," - 0px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"sm"})," - 2px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"md"})," - 6px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"lg"})," - 8px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"xl"})," - 12px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"2xl"})," - 16px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"3xl"})," - 24px"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"full"})," - 9999px (fully rounded)"]}),`
`]}),`
`,e.jsx(s.h3,{id:"usage-4",children:"Usage"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { getRadiusClass } from '@fabio.caffarello/react-design-system';

const radiusClass = getRadiusClass('lg'); // 'rounded-lg'
`})}),`
`,e.jsx(s.h2,{id:"animation-tokens",children:"Animation Tokens"}),`
`,e.jsx(s.p,{children:"Animation tokens define consistent timing and easing for transitions and animations."}),`
`,e.jsx(s.h3,{id:"animation-durations",children:"Animation Durations"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"fast"})," - 150ms"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"base"})," - 200ms"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"slow"})," - 300ms"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"slower"})," - 500ms"]}),`
`]}),`
`,e.jsx(s.h3,{id:"easing-functions",children:"Easing Functions"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"ease-in"})," - Slow start, fast end"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"ease-out"})," - Fast start, slow end"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"ease-in-out"})," - Slow start and end, fast middle"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"spring"})," - Spring-like bounce effect"]}),`
`]}),`
`,e.jsx(s.h3,{id:"usage-5",children:"Usage"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { getAnimationClass, getTransitionClass } from '@fabio.caffarello/react-design-system';

// Animation classes
const animClass = getAnimationClass('base', 'ease-in-out'); // 'duration-200 ease-in-out'

// Transition classes
const transitionClass = getTransitionClass(['color', 'background-color'], 'base'); // 'duration-200 ease-in-out'
`})}),`
`,e.jsx(s.h2,{id:"z-index-tokens",children:"Z-Index Tokens"}),`
`,e.jsx(s.p,{children:"Z-index tokens provide consistent layering for overlapping elements."}),`
`,e.jsx(s.h3,{id:"z-index-layers",children:"Z-Index Layers"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"base"})," - 0 (normal content)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"dropdown"})," - 1000 (dropdown menus)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"sticky"})," - 1020 (sticky headers)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"fixed"})," - 1030 (fixed elements)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"modal-backdrop"})," - 1040 (modal overlays)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"modal"})," - 1050 (modal dialogs)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"popover"})," - 1060 (popovers)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"tooltip"})," - 1070 (tooltips)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"toast"})," - 1080 (toast notifications)"]}),`
`]}),`
`,e.jsx(s.h3,{id:"usage-6",children:"Usage"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { getZIndexClass } from '@fabio.caffarello/react-design-system';

const zIndexClass = getZIndexClass('modal'); // 'z-[1050]'
`})}),`
`,e.jsx(s.h2,{id:"opacity-tokens",children:"Opacity Tokens"}),`
`,e.jsx(s.p,{children:"Opacity tokens define consistent transparency values."}),`
`,e.jsx(s.h3,{id:"opacity-values",children:"Opacity Values"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"0"})," - Fully transparent"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"5"})," - Very light overlay"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"10"})," - Light overlay"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"25"})," - Quarter opacity"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"50"})," - Half opacity"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"75"})," - Three-quarter opacity"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"90"})," - Very high opacity"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"100"})," - Fully opaque"]}),`
`]}),`
`,e.jsx(s.h3,{id:"usage-7",children:"Usage"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { getOpacityClass } from '@fabio.caffarello/react-design-system';

const opacityClass = getOpacityClass(50); // 'opacity-50'
`})}),`
`,e.jsx(s.h2,{id:"gradient-tokens",children:"Gradient Tokens"}),`
`,e.jsx(s.p,{children:"Gradient tokens provide semantic color gradients."}),`
`,e.jsx(s.h3,{id:"gradient-roles",children:"Gradient Roles"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"primary"})," - Primary color gradient"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"secondary"})," - Secondary color gradient"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"success"})," - Success color gradient"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"error"})," - Error color gradient"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"info"})," - Info color gradient"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"warning"})," - Warning color gradient"]}),`
`]}),`
`,e.jsx(s.h3,{id:"gradient-directions",children:"Gradient Directions"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"to-r"})," - To right"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"to-l"})," - To left"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"to-t"})," - To top"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"to-b"})," - To bottom"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"to-tr"})," - To top right"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"to-tl"})," - To top left"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"to-br"})," - To bottom right"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"to-bl"})," - To bottom left"]}),`
`]}),`
`,e.jsx(s.h3,{id:"usage-8",children:"Usage"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { getGradientClass } from '@fabio.caffarello/react-design-system';

const gradientClass = getGradientClass('primary', 'to-r'); // 'bg-gradient-to-r from-[...] via-[...] to-[...]'
`})}),`
`,e.jsx(s.h2,{id:"best-practices",children:"Best Practices"}),`
`,e.jsx(s.h3,{id:"-do-use-tokens",children:"✅ Do Use Tokens"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`// ✅ Good - Using tokens
import { getColorClass, getSpacingClass, getRadiusClass } from '@fabio.caffarello/react-design-system';

const className = \`
  \${getColorClass('primary', 'DEFAULT', 'bg')}
  \${getSpacingClass('md', 'p')}
  \${getRadiusClass('lg')}
\`;
`})}),`
`,e.jsx(s.h3,{id:"-dont-use-hardcoded-classes",children:"❌ Don't Use Hardcoded Classes"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`// ❌ Bad - Hardcoded classes
const className = 'bg-indigo-500 p-3 rounded-lg';
`})}),`
`,e.jsx(s.h2,{id:"token-factory",children:"Token Factory"}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"TokensFactory"})," provides a unified interface for creating all types of tokens:"]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-tsx",children:`import { TokensFactory } from '@fabio.caffarello/react-design-system';

const factory = new TokensFactory('light');
const tokenSet = factory.createTokenSet();

// Access all tokens
const spacing = tokenSet.spacing;
const colors = tokenSet.colors;
const shadows = tokenSet.shadows;
`})}),`
`,e.jsx(s.h2,{id:"migration-guide",children:"Migration Guide"}),`
`,e.jsx(s.p,{children:"When refactoring components, replace hardcoded classes with tokens:"}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Colors"}),": ",e.jsx(s.code,{children:"bg-gray-500"})," → ",e.jsx(s.code,{children:"getColorClass('neutral', 'DEFAULT', 'bg')"})]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Spacing"}),": ",e.jsx(s.code,{children:"p-4"})," → ",e.jsx(s.code,{children:"getSpacingClass('base', 'p')"})]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Shadows"}),": ",e.jsx(s.code,{children:"shadow-lg"})," → ",e.jsx(s.code,{children:"getShadowClass('lg')"})]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Radius"}),": ",e.jsx(s.code,{children:"rounded-md"})," → ",e.jsx(s.code,{children:"getRadiusClass('md')"})]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Borders"}),": ",e.jsx(s.code,{children:"border-2"})," → ",e.jsx(s.code,{children:"getBorderWidthClass('medium')"})]}),`
`]}),`
`,e.jsxs(s.p,{children:["Run ",e.jsx(s.code,{children:"npm run audit:tokens"})," to find hardcoded classes in your components."]})]})}function M(i={}){const{wrapper:s}=l(l({},x()),i.components);return s?e.jsx(s,t(l({},i),{children:e.jsx(h,l({},i))})):h(i)}export{M as default};
