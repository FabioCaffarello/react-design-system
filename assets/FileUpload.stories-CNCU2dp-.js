var T=Object.defineProperty,q=Object.defineProperties;var A=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var H=Object.prototype.hasOwnProperty,K=Object.prototype.propertyIsEnumerable;var w=(r,s,l)=>s in r?T(r,s,{enumerable:!0,configurable:!0,writable:!0,value:l}):r[s]=l,e=(r,s)=>{for(var l in s||(s={}))H.call(s,l)&&w(r,l,s[l]);if(v)for(var l of v(s))K.call(s,l)&&w(r,l,s[l]);return r},a=(r,s)=>q(r,A(s));import{j as i}from"./jsx-runtime-D_zvdyIk.js";import{r as o}from"./iframe-38FCFUQv.js";import{F as t}from"./FileUpload-C63QAnuJ.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./animations-BabstCnB.js";import"./Button-CioV4BCG.js";import"./Spinner-zwBmS9q3.js";import"./Progress-CiRLFMCA.js";import"./typography-BGNr2Ph4.js";import"./gradients-t2MqRZ02.js";import"./z-index-DQdti7D9.js";import"./createLucideIcon-DQdFte_Y.js";import"./circle-alert-C1QBYRrG.js";import"./circle-check-DcBi3U0v.js";import"./x-g6OncSvk.js";const fe={title:"Molecules/FileUpload",component:t,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{multiple:{control:"boolean"},showPreview:{control:"boolean"},showProgress:{control:"boolean"}}},n={render:r=>{const[s,l]=o.useState([]);return i.jsxs("div",{className:"w-full max-w-md",children:[i.jsx(t,a(e({},r),{onFilesChange:l})),s.length>0&&i.jsxs("div",{className:"mt-4 text-sm text-gray-600",children:[s.length," file(s) selected"]})]})}},d={render:r=>{const[s,l]=o.useState([]);return i.jsx("div",{className:"w-full max-w-md",children:i.jsx(t,a(e({},r),{onFilesChange:l,label:"Upload Documents",description:"Upload PDF, DOC, or DOCX files"}))})},args:{accept:".pdf,.doc,.docx"}},c={render:r=>{const[s,l]=o.useState([]);return i.jsx("div",{className:"w-full max-w-md",children:i.jsx(t,a(e({},r),{onFilesChange:l,label:"Upload Images",description:"Upload JPG, PNG, or GIF files",accept:"image/*",maxSize:5*1024*1024,showPreview:!0}))})}},m={render:r=>{const[s,l]=o.useState([]);return i.jsxs("div",{className:"w-full max-w-md",children:[i.jsx(t,a(e({},r),{onFilesChange:l,label:"Upload Multiple Files",multiple:!0,maxFiles:5})),s.length>0&&i.jsxs("div",{className:"mt-4 text-sm text-gray-600",children:[s.length," of 5 files selected"]})]})}},p={render:r=>{const[s,l]=o.useState([]),V=x=>{l(x),x.forEach(h=>{if(!h.progress)return;let f=0;const X=setInterval(()=>{f+=10,l(R=>R.map(g=>g.id===h.id?a(e({},g),{progress:f}):g)),f>=100&&clearInterval(X)},200)})};return i.jsx("div",{className:"w-full max-w-md",children:i.jsx(t,a(e({},r),{onFilesChange:V,showProgress:!0}))})}},u={render:()=>{const[r,s]=o.useState([]);return i.jsxs("div",{className:"w-full max-w-md",children:[i.jsx(t,{onFilesChange:s,label:"Upload File",description:"Maximum file size: 2MB",maxSize:2*1024*1024,accept:".pdf,.doc,.docx"}),r.some(l=>l.error)&&i.jsx("div",{className:"mt-4 p-3 bg-red-50 border border-red-200 rounded-md",children:i.jsx("p",{className:"text-sm text-red-800",children:"Some files failed validation. Please check the errors above."})})]})}},F={render:()=>i.jsx("div",{className:"w-full max-w-md",children:i.jsx(t,{label:"Upload Disabled",disabled:!0})})};var U,b,S;n.parameters=a(e({},n.parameters),{docs:a(e({},(U=n.parameters)==null?void 0:U.docs),{source:e({originalSource:`{
  render: args => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    return <div className="w-full max-w-md">
        <FileUpload {...args} onFilesChange={setFiles} />
        {files.length > 0 && <div className="mt-4 text-sm text-gray-600">
            {files.length} file(s) selected
          </div>}
      </div>;
  }
}`},(S=(b=n.parameters)==null?void 0:b.docs)==null?void 0:S.source)})});var N,j,C;d.parameters=a(e({},d.parameters),{docs:a(e({},(N=d.parameters)==null?void 0:N.docs),{source:e({originalSource:`{
  render: args => {
    const [_files, setFiles] = useState<FileUploadFile[]>([]);
    return <div className="w-full max-w-md">
        <FileUpload {...args} onFilesChange={setFiles} label="Upload Documents" description="Upload PDF, DOC, or DOCX files" />
      </div>;
  },
  args: {
    accept: '.pdf,.doc,.docx'
  }
}`},(C=(j=d.parameters)==null?void 0:j.docs)==null?void 0:C.source)})});var P,D,M;c.parameters=a(e({},c.parameters),{docs:a(e({},(P=c.parameters)==null?void 0:P.docs),{source:e({originalSource:`{
  render: args => {
    const [_files, setFiles] = useState<FileUploadFile[]>([]);
    return <div className="w-full max-w-md">
        <FileUpload {...args} onFilesChange={setFiles} label="Upload Images" description="Upload JPG, PNG, or GIF files" accept="image/*" maxSize={5 * 1024 * 1024} // 5MB
      showPreview />
      </div>;
  }
}`},(M=(D=c.parameters)==null?void 0:D.docs)==null?void 0:M.source)})});var I,_,y;m.parameters=a(e({},m.parameters),{docs:a(e({},(I=m.parameters)==null?void 0:I.docs),{source:e({originalSource:`{
  render: args => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    return <div className="w-full max-w-md">
        <FileUpload {...args} onFilesChange={setFiles} label="Upload Multiple Files" multiple maxFiles={5} />
        {files.length > 0 && <div className="mt-4 text-sm text-gray-600">
            {files.length} of 5 files selected
          </div>}
      </div>;
  }
}`},(y=(_=m.parameters)==null?void 0:_.docs)==null?void 0:y.source)})});var z,G,W;p.parameters=a(e({},p.parameters),{docs:a(e({},(z=p.parameters)==null?void 0:z.docs),{source:e({originalSource:`{
  render: args => {
    const [_files, setFiles] = useState<FileUploadFile[]>([]);
    const handleFilesChange = (newFiles: FileUploadFile[]) => {
      setFiles(newFiles);
      // Simulate progress
      newFiles.forEach(file => {
        if (!file.progress) return;
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setFiles(prev => prev.map(f => f.id === file.id ? {
            ...f,
            progress
          } : f));
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 200);
      });
    };
    return <div className="w-full max-w-md">
        <FileUpload {...args} onFilesChange={handleFilesChange} showProgress />
      </div>;
  }
}`},(W=(G=p.parameters)==null?void 0:G.docs)==null?void 0:W.source)})});var E,O,B;u.parameters=a(e({},u.parameters),{docs:a(e({},(E=u.parameters)==null?void 0:E.docs),{source:e({originalSource:`{
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    return <div className="w-full max-w-md">
        <FileUpload onFilesChange={setFiles} label="Upload File" description="Maximum file size: 2MB" maxSize={2 * 1024 * 1024} // 2MB
      accept=".pdf,.doc,.docx" />
        {files.some(f => f.error) && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Some files failed validation. Please check the errors above.
            </p>
          </div>}
      </div>;
  }
}`},(B=(O=u.parameters)==null?void 0:O.docs)==null?void 0:B.source)})});var k,J,L;F.parameters=a(e({},F.parameters),{docs:a(e({},(k=F.parameters)==null?void 0:k.docs),{source:e({originalSource:`{
  render: () => <div className="w-full max-w-md">
      <FileUpload label="Upload Disabled" disabled />
    </div>
}`},(L=(J=F.parameters)==null?void 0:J.docs)==null?void 0:L.source)})});const ge=["Default","WithLabel","ImageUpload","MultipleFiles","WithProgress","WithValidation","Disabled"];export{n as Default,F as Disabled,c as ImageUpload,m as MultipleFiles,d as WithLabel,p as WithProgress,u as WithValidation,ge as __namedExportsOrder,fe as default};
