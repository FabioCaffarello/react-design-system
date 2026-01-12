var nt=Object.defineProperty,rt=Object.defineProperties;var st=Object.getOwnPropertyDescriptors;var _=Object.getOwnPropertySymbols;var lt=Object.prototype.hasOwnProperty,ot=Object.prototype.propertyIsEnumerable;var K=(n,s,t)=>s in n?nt(n,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[s]=t,e=(n,s)=>{for(var t in s||(s={}))lt.call(s,t)&&K(n,t,s[t]);if(_)for(var t of _(s))ot.call(s,t)&&K(n,t,s[t]);return n},r=(n,s)=>rt(n,st(s));import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./iframe-38FCFUQv.js";import{T as c}from"./Table-CaOrFHhy.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import{B as q}from"./Button-CioV4BCG.js";import"./BoxWrapper-CQWnzTQD.js";import{B as k}from"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import"./InputWithLabel-ITaeXPOD.js";import{C}from"./Card-Dt4JI1Iu.js";import"./Form-DGsGsnAi.js";import"./Breadcrumb-Ca77HakG.js";import"./Pagination-b1td3i4q.js";import"./EmptyState-B42kcNnT.js";import"./Dropdown-3XcqUhyy.js";import"./NavbarGroup-Cskdgt3R.js";import"./DatePicker-DEb8iPmI.js";import"./Tabs-DSv1xSbq.js";import"./SearchInput-D9asIXu8.js";import"./Rating-DsUkPGQu.js";import"./FileUpload-C63QAnuJ.js";import"./TimePicker-ECKtr9SN.js";import"./ColorPicker-B847UTu1.js";import"./preload-helper-BDBacUwf.js";import"./TableActions-B_csfOtW.js";import"./createLucideIcon-DQdFte_Y.js";import"./TableFilters-CwF3toF5.js";import"./x-g6OncSvk.js";import"./TablePagination-BfBF-ZBz.js";import"./chevron-left-CSWgm5TS.js";import"./chevron-right-B-aA5A0W.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";import"./search-BToDFYnP.js";import"./circle-alert-C1QBYRrG.js";import"./circle-check-DcBi3U0v.js";const y=[{id:"1",name:"Epic 1",status:"ACTIVE",priority:"HIGH",createdAt:"2024-01-01"},{id:"2",name:"Epic 2",status:"DRAFT",priority:"MEDIUM",createdAt:"2024-01-02"},{id:"3",name:"Epic 3",status:"COMPLETED",priority:"LOW",createdAt:"2024-01-03"}],ya={title:"Organisms/Table",component:c,parameters:{docs:{description:{component:"A table component with sorting, loading states, and responsive design. Supports custom cell rendering."}}},argTypes:{loading:{control:"boolean",description:"Whether the table is in a loading state"}}},E={args:{columns:[{key:"name",label:"Name"},{key:"status",label:"Status"},{key:"priority",label:"Priority"},{key:"createdAt",label:"Created At"}],data:y}},x={render:()=>{const[n,s]=i.useState(""),[t,o]=i.useState("asc"),[d,u]=i.useState(y),b=(p,S)=>{s(p),o(S);const l=[...d].sort((U,$)=>{const h=U[p],G=$[p],D=h.localeCompare(G);return S==="asc"?D:-D});u(l)};return a.jsx(c,{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"priority",label:"Priority",sortable:!0},{key:"createdAt",label:"Created At",sortable:!0}],data:d,onSort:b,sortColumn:n,sortDirection:t})}},A={args:{columns:[{key:"name",label:"Name"},{key:"status",label:"Status",render:n=>a.jsx(k,{variant:n==="ACTIVE"?"success":n==="COMPLETED"?"info":"neutral",children:n})},{key:"priority",label:"Priority",render:n=>a.jsx(k,{variant:n==="HIGH"?"error":n==="MEDIUM"?"warning":"info",children:n})},{key:"createdAt",label:"Created At"}],data:y}},v={args:{columns:[{key:"name",label:"Name"},{key:"status",label:"Status"}],data:[],loading:!0}},I={args:{columns:[{key:"name",label:"Name"},{key:"status",label:"Status"}],data:[],emptyMessage:"No epics found. Create your first epic to get started."}},P={render:()=>{const[n,s]=i.useState(1),[t,o]=i.useState(10),d=Array.from({length:100},(S,l)=>({id:(l+1).toString(),name:`Item ${l+1}`,status:l%3===0?"ACTIVE":l%3===1?"DRAFT":"COMPLETED",priority:l%4===0?"HIGH":l%4===1?"MEDIUM":"LOW",createdAt:`2024-01-${String(l%28+1).padStart(2,"0")}`})),u=(n-1)*t,b=u+t,p=d.slice(u,b);return a.jsx(c,{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"priority",label:"Priority"},{key:"createdAt",label:"Created At"}],data:p,pagination:{page:n,pageSize:t,total:d.length,onPageChange:s,onPageSizeChange:o}})}},T={render:()=>{const[n,s]=i.useState({}),[t]=i.useState(y),o=d=>{s(d)};return a.jsx(c,{columns:[{key:"name",label:"Name"},{key:"status",label:"Status"},{key:"priority",label:"Priority"},{key:"createdAt",label:"Created At"}],data:t,filters:{config:[{key:"status",label:"Status",type:"select",options:[{value:"ACTIVE",label:"Active"},{value:"DRAFT",label:"Draft"},{value:"COMPLETED",label:"Completed"}]},{key:"priority",label:"Priority",type:"select",options:[{value:"HIGH",label:"High"},{value:"MEDIUM",label:"Medium"},{value:"LOW",label:"Low"}]},{key:"search",label:"Search",type:"text",placeholder:"Search by name..."}],onFilter:o}})}},w={render:()=>{const[n,s]=i.useState([]);return a.jsx(c,{columns:[{key:"name",label:"Name"},{key:"status",label:"Status"},{key:"priority",label:"Priority"}],data:y,selectable:!0,selectedRows:n,onSelectionChange:s,rowId:t=>t.id})}},f={render:()=>{const n=o=>{console.log("View:",o)},s=o=>{console.log("Edit:",o)},t=o=>{console.log("Delete:",o)};return a.jsx(c,{columns:[{key:"name",label:"Name"},{key:"status",label:"Status"},{key:"priority",label:"Priority"}],data:y,actions:o=>[{label:"View",onClick:()=>n(o)},{label:"Edit",onClick:()=>s(o)},{label:"Delete",onClick:()=>t(o),variant:"danger"}],rowId:o=>o.id})}},M={render:()=>{const[n,s]=i.useState(1),[t,o]=i.useState(10),[d,u]=i.useState(""),[b,p]=i.useState("asc"),[S,l]=i.useState({}),[U,$]=i.useState([]),h=Array.from({length:50},(m,g)=>({id:(g+1).toString(),name:`Epic ${g+1}`,status:g%3===0?"ACTIVE":g%3===1?"DRAFT":"COMPLETED",priority:g%4===0?"HIGH":g%4===1?"MEDIUM":"LOW",createdAt:`2024-01-${String(g%28+1).padStart(2,"0")}`})),G=(m,g)=>{u(m),p(g)},D=m=>{l(m)},B=(n-1)*t,tt=B+t,at=h.slice(B,tt);return a.jsx(c,{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0,render:m=>a.jsx(k,{variant:m==="ACTIVE"?"success":m==="COMPLETED"?"info":"neutral",children:m})},{key:"priority",label:"Priority",render:m=>a.jsx(k,{variant:m==="HIGH"?"error":m==="MEDIUM"?"warning":"info",children:m})},{key:"createdAt",label:"Created At",sortable:!0}],data:at,onSort:G,sortColumn:d,sortDirection:b,pagination:{page:n,pageSize:t,total:h.length,onPageChange:s,onPageSizeChange:o},filters:{config:[{key:"status",label:"Status",type:"select",options:[{value:"ACTIVE",label:"Active"},{value:"DRAFT",label:"Draft"},{value:"COMPLETED",label:"Completed"}]},{key:"priority",label:"Priority",type:"select",options:[{value:"HIGH",label:"High"},{value:"MEDIUM",label:"Medium"},{value:"LOW",label:"Low"}]}],onFilter:D},selectable:!0,selectedRows:U,onSelectionChange:$,rowId:m=>m.id,actions:m=>[{label:"View",onClick:()=>{}},{label:"Edit",onClick:()=>{}},{label:"Delete",onClick:()=>{},variant:"danger"}]})}},N={render:()=>{const n=Array.from({length:100},(s,t)=>({id:(t+1).toString(),name:`Item ${t+1}`,status:t%3===0?"ACTIVE":t%3===1?"DRAFT":"COMPLETED",priority:t%4===0?"HIGH":t%4===1?"MEDIUM":"LOW",createdAt:`2024-01-${String(t%28+1).padStart(2,"0")}`}));return a.jsx(c,{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"priority",label:"Priority"},{key:"createdAt",label:"Created At"}],data:n,paginationMode:"client",defaultPageSize:10})}},H={render:()=>{const[n,s]=i.useState(1),[t,o]=i.useState(10),d=Array.from({length:100},(S,l)=>({id:(l+1).toString(),name:`Item ${l+1}`,status:l%3===0?"ACTIVE":l%3===1?"DRAFT":"COMPLETED",priority:l%4===0?"HIGH":l%4===1?"MEDIUM":"LOW",createdAt:`2024-01-${String(l%28+1).padStart(2,"0")}`})),u=(n-1)*t,b=u+t,p=d.slice(u,b);return a.jsx(c,{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"priority",label:"Priority"},{key:"createdAt",label:"Created At"}],data:p,paginationMode:"server",page:n,pageSize:t,total:d.length,onPageChange:s,onPageSizeChange:o})}},L={render:()=>{const[n,s]=i.useState(1),[t,o]=i.useState(10),d=Array.from({length:100},(S,l)=>({id:(l+1).toString(),name:`Item ${l+1}`,status:l%3===0?"ACTIVE":l%3===1?"DRAFT":"COMPLETED",priority:l%4===0?"HIGH":l%4===1?"MEDIUM":"LOW",createdAt:`2024-01-${String(l%28+1).padStart(2,"0")}`})),u=(n-1)*t,b=u+t,p=d.slice(u,b);return a.jsx(c,{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"priority",label:"Priority"},{key:"createdAt",label:"Created At"}],data:p,total:d.length,onPageChange:s,onPageSizeChange:o})}},j={render:()=>{const n=Array.from({length:50},(s,t)=>({id:(t+1).toString(),name:`Epic ${t+1}`,status:t%3===0?"ACTIVE":t%3===1?"DRAFT":"COMPLETED",priority:t%4===0?"HIGH":t%4===1?"MEDIUM":"LOW",createdAt:`2024-01-${String(t%28+1).padStart(2,"0")}`}));return a.jsxs(c,{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0,render:s=>a.jsx(k,{variant:s==="ACTIVE"?"success":s==="COMPLETED"?"info":"neutral",children:s})},{key:"priority",label:"Priority",render:s=>a.jsx(k,{variant:s==="HIGH"?"error":s==="MEDIUM"?"warning":"info",children:s})},{key:"createdAt",label:"Created At",sortable:!0}],data:n,paginationMode:"client",defaultPageSize:10,filters:[{key:"status",label:"Status",type:"select",options:[{value:"ACTIVE",label:"Active"},{value:"DRAFT",label:"Draft"},{value:"COMPLETED",label:"Completed"}]},{key:"priority",label:"Priority",type:"select",options:[{value:"HIGH",label:"High"},{value:"MEDIUM",label:"Medium"},{value:"LOW",label:"Low"}]}],selectable:!0,actions:s=>[{label:"View",onClick:()=>{}},{label:"Edit",onClick:()=>{}},{label:"Delete",onClick:()=>{},variant:"danger"}],children:[a.jsx(c.Filters,{}),a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[a.jsx(c.Header,{}),a.jsx(c.Body,{})]})}),a.jsx(c.Pagination,{})]})}},O={args:{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"priority",label:"Priority"}],data:y,"aria-label":"User management table"},parameters:{docs:{description:{story:"Table with accessibility features: aria-label, aria-sort on sortable columns, keyboard navigation support."}}}},F={args:{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"priority",label:"Priority"}],data:y},render:n=>a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{className:"p-4 bg-blue-50 rounded-md",children:[a.jsx("p",{className:"text-sm text-blue-800 font-medium mb-2",children:"Keyboard Navigation:"}),a.jsxs("ul",{className:"text-sm text-blue-700 space-y-1 list-disc list-inside",children:[a.jsx("li",{children:"Tab to navigate to sortable column headers"}),a.jsx("li",{children:"Enter or Space to sort columns"}),a.jsx("li",{children:"Arrow keys to navigate cells (when implemented)"}),a.jsx("li",{children:"Home/End to navigate to first/last column"})]})]}),a.jsx(c,e({},n))]}),parameters:{docs:{description:{story:"Demonstrates keyboard navigation in tables. Use Tab to focus sortable headers and Enter/Space to sort."}}}},R={render:()=>a.jsxs("div",{className:"space-y-6 p-6",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("h2",{className:"text-2xl font-bold",children:"Dashboard"}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx(q,{variant:"primary",children:"New Item"}),a.jsx(q,{variant:"outline",children:"Export"})]})]}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[a.jsx(C,{children:a.jsxs("div",{className:"p-4",children:[a.jsx("p",{className:"text-sm text-gray-600",children:"Total Items"}),a.jsx("p",{className:"text-2xl font-bold",children:"42"})]})}),a.jsx(C,{children:a.jsxs("div",{className:"p-4",children:[a.jsx("p",{className:"text-sm text-gray-600",children:"Active"}),a.jsx("p",{className:"text-2xl font-bold text-green-600",children:"28"})]})}),a.jsx(C,{children:a.jsxs("div",{className:"p-4",children:[a.jsx("p",{className:"text-sm text-gray-600",children:"Completed"}),a.jsx("p",{className:"text-2xl font-bold text-blue-600",children:"14"})]})})]}),a.jsx(C,{children:a.jsxs("div",{className:"p-6",children:[a.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Recent Items"}),a.jsx(c,{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"priority",label:"Priority"},{key:"createdAt",label:"Created",sortable:!0}],data:y,"aria-label":"Recent items table"})]})})]}),parameters:{docs:{description:{story:"Example dashboard showing Table component working together with Cards, Buttons, and other components."}}}},z={args:{columns:[{key:"name",label:"Name"},{key:"status",label:"Status"},{key:"priority",label:"Priority"}],data:[],emptyMessage:"No items found"},parameters:{docs:{description:{story:"Table with empty state when no data is available."}}}},V={args:{columns:[{key:"name",label:"Name"},{key:"status",label:"Status"},{key:"priority",label:"Priority"}],data:[],loading:!0},parameters:{docs:{description:{story:"Table in loading state showing skeleton loaders."}}}},W={render:()=>{const n=Array.from({length:100},(s,t)=>({id:String(t+1),name:`Item ${t+1}`,status:["ACTIVE","DRAFT","COMPLETED"][t%3],priority:["HIGH","MEDIUM","LOW"][t%3],createdAt:`2024-01-${String(t%28+1).padStart(2,"0")}`}));return a.jsx(c,{columns:[{key:"name",label:"Name",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"priority",label:"Priority"},{key:"createdAt",label:"Created",sortable:!0}],data:n,paginationMode:"client",defaultPageSize:10,"aria-label":"Large dataset table"})},parameters:{docs:{description:{story:"Table handling large datasets with pagination. Demonstrates performance with 100+ rows."}}}};var J,Q,X;E.parameters=r(e({},E.parameters),{docs:r(e({},(J=E.parameters)==null?void 0:J.docs),{source:e({originalSource:`{
  args: {
    columns: [{
      key: 'name',
      label: 'Name'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'priority',
      label: 'Priority'
    }, {
      key: 'createdAt',
      label: 'Created At'
    }],
    data: sampleData
  }
}`},(X=(Q=E.parameters)==null?void 0:Q.docs)==null?void 0:X.source)})});var Y,Z,ee;x.parameters=r(e({},x.parameters),{docs:r(e({},(Y=x.parameters)==null?void 0:Y.docs),{source:e({originalSource:`{
  render: () => {
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [data, setData] = useState(sampleData);
    const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
      setSortColumn(columnKey);
      setSortDirection(direction);
      const sorted = [...data].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[columnKey] as string;
        const bVal = (b as Record<string, unknown>)[columnKey] as string;
        const comparison = aVal.localeCompare(bVal);
        return direction === 'asc' ? comparison : -comparison;
      });
      setData(sorted);
    };
    return <Table columns={[{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true
    }, {
      key: 'priority',
      label: 'Priority',
      sortable: true
    }, {
      key: 'createdAt',
      label: 'Created At',
      sortable: true
    }]} data={data} onSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />;
  }
}`},(ee=(Z=x.parameters)==null?void 0:Z.docs)==null?void 0:ee.source)})});var te,ae,ne;A.parameters=r(e({},A.parameters),{docs:r(e({},(te=A.parameters)==null?void 0:te.docs),{source:e({originalSource:`{
  args: {
    columns: [{
      key: 'name',
      label: 'Name'
    }, {
      key: 'status',
      label: 'Status',
      render: value => <Badge variant={value === 'ACTIVE' ? 'success' : value === 'COMPLETED' ? 'info' : 'neutral'}>
            {value}
          </Badge>
    }, {
      key: 'priority',
      label: 'Priority',
      render: value => <Badge variant={value === 'HIGH' ? 'error' : value === 'MEDIUM' ? 'warning' : 'info'}>
            {value}
          </Badge>
    }, {
      key: 'createdAt',
      label: 'Created At'
    }],
    data: sampleData
  }
}`},(ne=(ae=A.parameters)==null?void 0:ae.docs)==null?void 0:ne.source)})});var re,se,le;v.parameters=r(e({},v.parameters),{docs:r(e({},(re=v.parameters)==null?void 0:re.docs),{source:e({originalSource:`{
  args: {
    columns: [{
      key: 'name',
      label: 'Name'
    }, {
      key: 'status',
      label: 'Status'
    }],
    data: [],
    loading: true
  }
}`},(le=(se=v.parameters)==null?void 0:se.docs)==null?void 0:le.source)})});var oe,ie,ce;I.parameters=r(e({},I.parameters),{docs:r(e({},(oe=I.parameters)==null?void 0:oe.docs),{source:e({originalSource:`{
  args: {
    columns: [{
      key: 'name',
      label: 'Name'
    }, {
      key: 'status',
      label: 'Status'
    }],
    data: [],
    emptyMessage: "No epics found. Create your first epic to get started."
  }
}`},(ce=(ie=I.parameters)==null?void 0:ie.docs)==null?void 0:ce.source)})});var de,me,ue;P.parameters=r(e({},P.parameters),{docs:r(e({},(de=P.parameters)==null?void 0:de.docs),{source:e({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const allData = Array.from({
      length: 100
    }, (_, i) => ({
      id: (i + 1).toString(),
      name: \`Item \${i + 1}\`,
      status: i % 3 === 0 ? 'ACTIVE' : i % 3 === 1 ? 'DRAFT' : 'COMPLETED',
      priority: i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : 'LOW',
      createdAt: \`2024-01-\${String(i % 28 + 1).padStart(2, '0')}\`
    }));
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allData.slice(startIndex, endIndex);
    return <Table columns={[{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true
    }, {
      key: 'priority',
      label: 'Priority'
    }, {
      key: 'createdAt',
      label: 'Created At'
    }]} data={paginatedData} pagination={{
      page,
      pageSize,
      total: allData.length,
      onPageChange: setPage,
      onPageSizeChange: setPageSize
    }} />;
  }
}`},(ue=(me=P.parameters)==null?void 0:me.docs)==null?void 0:ue.source)})});var pe,be,ge;T.parameters=r(e({},T.parameters),{docs:r(e({},(pe=T.parameters)==null?void 0:pe.docs),{source:e({originalSource:`{
  render: () => {
    const [_filters, setFilters] = useState<Record<string, unknown>>({});
    const [data] = useState(sampleData);
    const handleFilter = (newFilters: Record<string, string>) => {
      setFilters(newFilters);
      // In a real app, this would trigger a server-side filter
    };
    return <Table columns={[{
      key: 'name',
      label: 'Name'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'priority',
      label: 'Priority'
    }, {
      key: 'createdAt',
      label: 'Created At'
    }]} data={data} filters={{
      config: [{
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [{
          value: 'ACTIVE',
          label: 'Active'
        }, {
          value: 'DRAFT',
          label: 'Draft'
        }, {
          value: 'COMPLETED',
          label: 'Completed'
        }]
      }, {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        options: [{
          value: 'HIGH',
          label: 'High'
        }, {
          value: 'MEDIUM',
          label: 'Medium'
        }, {
          value: 'LOW',
          label: 'Low'
        }]
      }, {
        key: 'search',
        label: 'Search',
        type: 'text',
        placeholder: 'Search by name...'
      }],
      onFilter: handleFilter
    }} />;
  }
}`},(ge=(be=T.parameters)==null?void 0:be.docs)==null?void 0:ge.source)})});var ye,Se,ke;w.parameters=r(e({},w.parameters),{docs:r(e({},(ye=w.parameters)==null?void 0:ye.docs),{source:e({originalSource:`{
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    return <Table columns={[{
      key: 'name',
      label: 'Name'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'priority',
      label: 'Priority'
    }]} data={sampleData} selectable selectedRows={selectedRows} onSelectionChange={setSelectedRows} rowId={row => row.id} />;
  }
}`},(ke=(Se=w.parameters)==null?void 0:Se.docs)==null?void 0:ke.source)})});var he,De,Ce;f.parameters=r(e({},f.parameters),{docs:r(e({},(he=f.parameters)==null?void 0:he.docs),{source:e({originalSource:`{
  render: () => {
    const handleView = (row: SampleData) => {
      console.log('View:', row);
    };
    const handleEdit = (row: SampleData) => {
      console.log('Edit:', row);
    };
    const handleDelete = (row: SampleData) => {
      console.log('Delete:', row);
    };
    return <Table columns={[{
      key: 'name',
      label: 'Name'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'priority',
      label: 'Priority'
    }]} data={sampleData} actions={row => [{
      label: 'View',
      onClick: () => handleView(row)
    }, {
      label: 'Edit',
      onClick: () => handleEdit(row)
    }, {
      label: 'Delete',
      onClick: () => handleDelete(row),
      variant: 'danger'
    }]} rowId={row => row.id} />;
  }
}`},(Ce=(De=f.parameters)==null?void 0:De.docs)==null?void 0:Ce.source)})});var Ee,xe,Ae;M.parameters=r(e({},M.parameters),{docs:r(e({},(Ee=M.parameters)==null?void 0:Ee.docs),{source:e({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [_filters, setFilters] = useState<Record<string, unknown>>({});
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const allData = Array.from({
      length: 50
    }, (_, i) => ({
      id: (i + 1).toString(),
      name: \`Epic \${i + 1}\`,
      status: i % 3 === 0 ? 'ACTIVE' : i % 3 === 1 ? 'DRAFT' : 'COMPLETED',
      priority: i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : 'LOW',
      createdAt: \`2024-01-\${String(i % 28 + 1).padStart(2, '0')}\`
    }));
    const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
      setSortColumn(columnKey);
      setSortDirection(direction);
    };
    const handleFilter = (newFilters: Record<string, string>) => {
      setFilters(newFilters);
    };
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allData.slice(startIndex, endIndex);
    return <Table columns={[{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: value => <Badge variant={value === 'ACTIVE' ? 'success' : value === 'COMPLETED' ? 'info' : 'neutral'}>
                {value}
              </Badge>
    }, {
      key: 'priority',
      label: 'Priority',
      render: value => <Badge variant={value === 'HIGH' ? 'error' : value === 'MEDIUM' ? 'warning' : 'info'}>
                {value}
              </Badge>
    }, {
      key: 'createdAt',
      label: 'Created At',
      sortable: true
    }]} data={paginatedData} onSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} pagination={{
      page,
      pageSize,
      total: allData.length,
      onPageChange: setPage,
      onPageSizeChange: setPageSize
    }} filters={{
      config: [{
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [{
          value: 'ACTIVE',
          label: 'Active'
        }, {
          value: 'DRAFT',
          label: 'Draft'
        }, {
          value: 'COMPLETED',
          label: 'Completed'
        }]
      }, {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        options: [{
          value: 'HIGH',
          label: 'High'
        }, {
          value: 'MEDIUM',
          label: 'Medium'
        }, {
          value: 'LOW',
          label: 'Low'
        }]
      }],
      onFilter: handleFilter
    }} selectable selectedRows={selectedRows} onSelectionChange={setSelectedRows} rowId={row => row.id} actions={_row => [{
      label: 'View',
      onClick: () => {}
    }, {
      label: 'Edit',
      onClick: () => {}
    }, {
      label: 'Delete',
      onClick: () => {},
      variant: 'danger'
    }]} />;
  }
}`},(Ae=(xe=M.parameters)==null?void 0:xe.docs)==null?void 0:Ae.source)})});var ve,Ie,Pe;N.parameters=r(e({},N.parameters),{docs:r(e({},(ve=N.parameters)==null?void 0:ve.docs),{source:e({originalSource:`{
  render: () => {
    const allData = Array.from({
      length: 100
    }, (_, i) => ({
      id: (i + 1).toString(),
      name: \`Item \${i + 1}\`,
      status: i % 3 === 0 ? 'ACTIVE' : i % 3 === 1 ? 'DRAFT' : 'COMPLETED',
      priority: i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : 'LOW',
      createdAt: \`2024-01-\${String(i % 28 + 1).padStart(2, '0')}\`
    }));
    return <Table columns={[{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true
    }, {
      key: 'priority',
      label: 'Priority'
    }, {
      key: 'createdAt',
      label: 'Created At'
    }]} data={allData} paginationMode="client" defaultPageSize={10} />;
  }
}`},(Pe=(Ie=N.parameters)==null?void 0:Ie.docs)==null?void 0:Pe.source)})});var Te,we,fe;H.parameters=r(e({},H.parameters),{docs:r(e({},(Te=H.parameters)==null?void 0:Te.docs),{source:e({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const allData = Array.from({
      length: 100
    }, (_, i) => ({
      id: (i + 1).toString(),
      name: \`Item \${i + 1}\`,
      status: i % 3 === 0 ? 'ACTIVE' : i % 3 === 1 ? 'DRAFT' : 'COMPLETED',
      priority: i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : 'LOW',
      createdAt: \`2024-01-\${String(i % 28 + 1).padStart(2, '0')}\`
    }));
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allData.slice(startIndex, endIndex);
    return <Table columns={[{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true
    }, {
      key: 'priority',
      label: 'Priority'
    }, {
      key: 'createdAt',
      label: 'Created At'
    }]} data={paginatedData} paginationMode="server" page={page} pageSize={pageSize} total={allData.length} onPageChange={setPage} onPageSizeChange={setPageSize} />;
  }
}`},(fe=(we=H.parameters)==null?void 0:we.docs)==null?void 0:fe.source)})});var Me,Ne,He;L.parameters=r(e({},L.parameters),{docs:r(e({},(Me=L.parameters)==null?void 0:Me.docs),{source:e({originalSource:`{
  render: () => {
    // Example 1: Auto-detects as server-side (has total and onPageChange)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const allData = Array.from({
      length: 100
    }, (_, i) => ({
      id: (i + 1).toString(),
      name: \`Item \${i + 1}\`,
      status: i % 3 === 0 ? 'ACTIVE' : i % 3 === 1 ? 'DRAFT' : 'COMPLETED',
      priority: i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : 'LOW',
      createdAt: \`2024-01-\${String(i % 28 + 1).padStart(2, '0')}\`
    }));
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allData.slice(startIndex, endIndex);
    return <Table columns={[{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true
    }, {
      key: 'priority',
      label: 'Priority'
    }, {
      key: 'createdAt',
      label: 'Created At'
    }]} data={paginatedData} total={allData.length} onPageChange={setPage} onPageSizeChange={setPageSize}
    // paginationMode="auto" is default, so we don't need to specify it
    />;
  }
}`},(He=(Ne=L.parameters)==null?void 0:Ne.docs)==null?void 0:He.source)})});var Le,je,Oe;j.parameters=r(e({},j.parameters),{docs:r(e({},(Le=j.parameters)==null?void 0:Le.docs),{source:e({originalSource:`{
  render: () => {
    const allData = Array.from({
      length: 50
    }, (_, i) => ({
      id: (i + 1).toString(),
      name: \`Epic \${i + 1}\`,
      status: i % 3 === 0 ? 'ACTIVE' : i % 3 === 1 ? 'DRAFT' : 'COMPLETED',
      priority: i % 4 === 0 ? 'HIGH' : i % 4 === 1 ? 'MEDIUM' : 'LOW',
      createdAt: \`2024-01-\${String(i % 28 + 1).padStart(2, '0')}\`
    }));
    return <Table columns={[{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: value => <Badge variant={value === 'ACTIVE' ? 'success' : value === 'COMPLETED' ? 'info' : 'neutral'}>
                {value}
              </Badge>
    }, {
      key: 'priority',
      label: 'Priority',
      render: value => <Badge variant={value === 'HIGH' ? 'error' : value === 'MEDIUM' ? 'warning' : 'info'}>
                {value}
              </Badge>
    }, {
      key: 'createdAt',
      label: 'Created At',
      sortable: true
    }]} data={allData} paginationMode="client" defaultPageSize={10} filters={[{
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [{
        value: 'ACTIVE',
        label: 'Active'
      }, {
        value: 'DRAFT',
        label: 'Draft'
      }, {
        value: 'COMPLETED',
        label: 'Completed'
      }]
    }, {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [{
        value: 'HIGH',
        label: 'High'
      }, {
        value: 'MEDIUM',
        label: 'Medium'
      }, {
        value: 'LOW',
        label: 'Low'
      }]
    }]} selectable actions={_row => [{
      label: 'View',
      onClick: () => {}
    }, {
      label: 'Edit',
      onClick: () => {}
    }, {
      label: 'Delete',
      onClick: () => {},
      variant: 'danger'
    }]}>
        <Table.Filters />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <Table.Header />
            <Table.Body />
          </table>
        </div>
        <Table.Pagination />
      </Table>;
  }
}`},(Oe=(je=j.parameters)==null?void 0:je.docs)==null?void 0:Oe.source)})});var Fe,Re,ze;O.parameters=r(e({},O.parameters),{docs:r(e({},(Fe=O.parameters)==null?void 0:Fe.docs),{source:e({originalSource:`{
  args: {
    columns: [{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true
    }, {
      key: 'priority',
      label: 'Priority'
    }],
    data: sampleData,
    'aria-label': 'User management table'
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with accessibility features: aria-label, aria-sort on sortable columns, keyboard navigation support.'
      }
    }
  }
}`},(ze=(Re=O.parameters)==null?void 0:Re.docs)==null?void 0:ze.source)})});var Ve,We,Ue;F.parameters=r(e({},F.parameters),{docs:r(e({},(Ve=F.parameters)==null?void 0:Ve.docs),{source:e({originalSource:`{
  args: {
    columns: [{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true
    }, {
      key: 'priority',
      label: 'Priority'
    }],
    data: sampleData
  },
  render: args => <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800 font-medium mb-2">Keyboard Navigation:</p>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Tab to navigate to sortable column headers</li>
          <li>Enter or Space to sort columns</li>
          <li>Arrow keys to navigate cells (when implemented)</li>
          <li>Home/End to navigate to first/last column</li>
        </ul>
      </div>
      <Table {...args} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation in tables. Use Tab to focus sortable headers and Enter/Space to sort.'
      }
    }
  }
}`},(Ue=(We=F.parameters)==null?void 0:We.docs)==null?void 0:Ue.source)})});var $e,Ge,Be;R.parameters=r(e({},R.parameters),{docs:r(e({},($e=R.parameters)==null?void 0:$e.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="primary">New Item</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold">42</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">28</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-blue-600">14</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Items</h3>
          <Table columns={[{
          key: 'name',
          label: 'Name',
          sortable: true
        }, {
          key: 'status',
          label: 'Status',
          sortable: true
        }, {
          key: 'priority',
          label: 'Priority'
        }, {
          key: 'createdAt',
          label: 'Created',
          sortable: true
        }]} data={sampleData} aria-label="Recent items table" />
        </div>
      </Card>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example dashboard showing Table component working together with Cards, Buttons, and other components.'
      }
    }
  }
}`},(Be=(Ge=R.parameters)==null?void 0:Ge.docs)==null?void 0:Be.source)})});var _e,Ke,qe;z.parameters=r(e({},z.parameters),{docs:r(e({},(_e=z.parameters)==null?void 0:_e.docs),{source:e({originalSource:`{
  args: {
    columns: [{
      key: 'name',
      label: 'Name'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'priority',
      label: 'Priority'
    }],
    data: [],
    emptyMessage: 'No items found'
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with empty state when no data is available.'
      }
    }
  }
}`},(qe=(Ke=z.parameters)==null?void 0:Ke.docs)==null?void 0:qe.source)})});var Je,Qe,Xe;V.parameters=r(e({},V.parameters),{docs:r(e({},(Je=V.parameters)==null?void 0:Je.docs),{source:e({originalSource:`{
  args: {
    columns: [{
      key: 'name',
      label: 'Name'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'priority',
      label: 'Priority'
    }],
    data: [],
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Table in loading state showing skeleton loaders.'
      }
    }
  }
}`},(Xe=(Qe=V.parameters)==null?void 0:Qe.docs)==null?void 0:Xe.source)})});var Ye,Ze,et;W.parameters=r(e({},W.parameters),{docs:r(e({},(Ye=W.parameters)==null?void 0:Ye.docs),{source:e({originalSource:`{
  render: () => {
    const largeData = Array.from({
      length: 100
    }, (_, i) => ({
      id: String(i + 1),
      name: \`Item \${i + 1}\`,
      status: ['ACTIVE', 'DRAFT', 'COMPLETED'][i % 3],
      priority: ['HIGH', 'MEDIUM', 'LOW'][i % 3],
      createdAt: \`2024-01-\${String(i % 28 + 1).padStart(2, '0')}\`
    }));
    return <Table columns={[{
      key: 'name',
      label: 'Name',
      sortable: true
    }, {
      key: 'status',
      label: 'Status',
      sortable: true
    }, {
      key: 'priority',
      label: 'Priority'
    }, {
      key: 'createdAt',
      label: 'Created',
      sortable: true
    }]} data={largeData} paginationMode="client" defaultPageSize={10} aria-label="Large dataset table" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Table handling large datasets with pagination. Demonstrates performance with 100+ rows.'
      }
    }
  }
}`},(et=(Ze=W.parameters)==null?void 0:Ze.docs)==null?void 0:et.source)})});const Sa=["Default","WithSorting","WithCustomRendering","Loading","Empty","WithPagination","WithFilters","WithSelection","WithActions","FullFeatured","ClientSidePagination","ServerSidePagination","AutoDetectPagination","DeclarativeAPI","Accessibility","KeyboardNavigation","DashboardComposition","EmptyState","LoadingState","LargeDataset"];export{O as Accessibility,L as AutoDetectPagination,N as ClientSidePagination,R as DashboardComposition,j as DeclarativeAPI,E as Default,I as Empty,z as EmptyState,M as FullFeatured,F as KeyboardNavigation,W as LargeDataset,v as Loading,V as LoadingState,H as ServerSidePagination,f as WithActions,A as WithCustomRendering,T as WithFilters,P as WithPagination,w as WithSelection,x as WithSorting,Sa as __namedExportsOrder,ya as default};
