var _=Object.defineProperty,$=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable;var x=(s,e,a)=>e in s?_(s,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[e]=a,r=(s,e)=>{for(var a in e||(e={}))T.call(e,a)&&x(s,a,e[a]);if(v)for(var a of v(e))P.call(e,a)&&x(s,a,e[a]);return s},o=(s,e)=>$(s,M(e));import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as c}from"./iframe-38FCFUQv.js";import{S as u}from"./SearchInput-D9asIXu8.js";import"./preload-helper-BDBacUwf.js";import"./Input-DlIdFoDR.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./Button-CioV4BCG.js";import"./Spinner-zwBmS9q3.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./search-BToDFYnP.js";const Z={title:"Molecules/SearchInput",component:u,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{loading:{control:"boolean"},showClearButton:{control:"boolean"}}},d={render:s=>{const[e,a]=c.useState("");return t.jsxs("div",{className:"w-64",children:[t.jsx(u,o(r({},s),{value:e,onChange:l=>a(l.target.value),onSearch:l=>console.log("Search:",l)})),t.jsxs("p",{className:"mt-2 text-sm text-gray-600",children:["Value: ",e]})]})},args:{placeholder:"Search..."}},h={render:s=>{const[e,a]=c.useState(!1),[l,p]=c.useState(""),S=n=>{a(!0),setTimeout(()=>a(!1),2e3)};return t.jsx("div",{className:"w-64",children:t.jsx(u,o(r({},s),{value:l,onChange:n=>p(n.target.value),onSearch:S,loading:e}))})},args:{placeholder:"Search with loading..."}},i={render:s=>{const[e,a]=c.useState("test");return t.jsx("div",{className:"w-64",children:t.jsx(u,o(r({},s),{value:e,onChange:l=>a(l.target.value),showClearButton:!1}))})},args:{placeholder:"Search without clear..."}},m={render:s=>{const[e,a]=c.useState(""),[l,p]=c.useState([]),S=n=>{p([`Result 1 for "${n}"`,`Result 2 for "${n}"`])};return t.jsxs("div",{className:"w-64 space-y-4",children:[t.jsx(u,o(r({},s),{value:e,onChange:n=>a(n.target.value),onSearch:S,debounceMs:500})),l.length>0&&t.jsxs("div",{className:"border border-gray-200 rounded-md p-2",children:[t.jsx("p",{className:"text-sm font-medium mb-2",children:"Results:"}),t.jsx("ul",{className:"text-sm space-y-1",children:l.map((n,F)=>t.jsx("li",{children:n},F))})]})]})},args:{placeholder:"Search with 500ms debounce..."}},g={render:()=>{const[s,e]=c.useState("");return t.jsxs("div",{className:"w-96 space-y-4 p-4 border border-gray-200 rounded-lg",children:[t.jsx("h3",{className:"text-lg font-semibold",children:"Search Form"}),t.jsx(u,{placeholder:"Search products...",value:s,onChange:a=>e(a.target.value),onSearch:a=>console.log("Searching for:",a)}),t.jsx("p",{className:"text-sm text-gray-600",children:"Press Enter or wait for debounce to trigger search"})]})}};var f,b,N;d.parameters=o(r({},d.parameters),{docs:o(r({},(f=d.parameters)==null?void 0:f.docs),{source:r({originalSource:`{
  render: args => {
    const [value, setValue] = useState('');
    return <div className="w-64">
        <SearchInput {...args} value={value} onChange={e => setValue(e.target.value)} onSearch={val => console.log('Search:', val)} />
        <p className="mt-2 text-sm text-gray-600">Value: {value}</p>
      </div>;
  },
  args: {
    placeholder: 'Search...'
  }
}`},(N=(b=d.parameters)==null?void 0:b.docs)==null?void 0:N.source)})});var w,V,j;h.parameters=o(r({},h.parameters),{docs:o(r({},(w=h.parameters)==null?void 0:w.docs),{source:r({originalSource:`{
  render: args => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const handleSearch = (_val: string) => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };
    return <div className="w-64">
        <SearchInput {...args} value={value} onChange={e => setValue(e.target.value)} onSearch={handleSearch} loading={loading} />
      </div>;
  },
  args: {
    placeholder: 'Search with loading...'
  }
}`},(j=(V=h.parameters)==null?void 0:V.docs)==null?void 0:j.source)})});var y,C,R;i.parameters=o(r({},i.parameters),{docs:o(r({},(y=i.parameters)==null?void 0:y.docs),{source:r({originalSource:`{
  render: args => {
    const [value, setValue] = useState('test');
    return <div className="w-64">
        <SearchInput {...args} value={value} onChange={e => setValue(e.target.value)} showClearButton={false} />
      </div>;
  },
  args: {
    placeholder: 'Search without clear...'
  }
}`},(R=(C=i.parameters)==null?void 0:C.docs)==null?void 0:R.source)})});var I,L,W;m.parameters=o(r({},m.parameters),{docs:o(r({},(I=m.parameters)==null?void 0:I.docs),{source:r({originalSource:`{
  render: args => {
    const [value, setValue] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const handleSearch = (val: string) => {
      setSearchResults([\`Result 1 for "\${val}"\`, \`Result 2 for "\${val}"\`]);
    };
    return <div className="w-64 space-y-4">
        <SearchInput {...args} value={value} onChange={e => setValue(e.target.value)} onSearch={handleSearch} debounceMs={500} />
        {searchResults.length > 0 && <div className="border border-gray-200 rounded-md p-2">
            <p className="text-sm font-medium mb-2">Results:</p>
            <ul className="text-sm space-y-1">
              {searchResults.map((result, i) => <li key={i}>{result}</li>)}
            </ul>
          </div>}
      </div>;
  },
  args: {
    placeholder: 'Search with 500ms debounce...'
  }
}`},(W=(L=m.parameters)==null?void 0:L.docs)==null?void 0:W.source)})});var B,E,D;g.parameters=o(r({},g.parameters),{docs:o(r({},(B=g.parameters)==null?void 0:B.docs),{source:r({originalSource:`{
  render: () => {
    const [searchValue, setSearchValue] = useState('');
    return <div className="w-96 space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold">Search Form</h3>
        <SearchInput placeholder="Search products..." value={searchValue} onChange={e => setSearchValue(e.target.value)} onSearch={val => console.log('Searching for:', val)} />
        <p className="text-sm text-gray-600">
          Press Enter or wait for debounce to trigger search
        </p>
      </div>;
  }
}`},(D=(E=g.parameters)==null?void 0:E.docs)==null?void 0:D.source)})});const ee=["Default","WithLoading","WithoutClearButton","WithDebounce","InForm"];export{d as Default,g as InForm,m as WithDebounce,h as WithLoading,i as WithoutClearButton,ee as __namedExportsOrder,Z as default};
