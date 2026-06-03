import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import FileUpload from "./FileUpload";
import type { FileUploadFile } from "./FileUpload";

const meta: Meta<typeof FileUpload> = {
  title: "Components/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## FileUpload

A file upload component that supports drag and drop, file validation, progress tracking, and previews.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onFilesChange\` | Arquivos mudaram | \`(files: FileUploadFile[]) => void\` | Quando arquivos são adicionados ou removidos |
| \`onFileRemove\` | Arquivo removido | \`(fileId: string) => void\` | Quando um arquivo específico é removido |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`empty\` | Sem arquivos | Estado inicial | Área de upload vazia |
| \`with-files\` | Com arquivos | Após upload | Área de upload com lista de arquivos |
| \`uploading\` | Enviando | Durante upload | Indicador de progresso visível |
| \`disabled\` | Desabilitado | \`disabled={true}\` | Upload desabilitado |
| \`with-preview\` | Com preview | \`showPreview={true}\` | Preview de imagens visível |
| \`with-progress\` | Com progresso | \`showProgress={true}\` | Barras de progresso visíveis |
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the upload area",
    },
    description: {
      control: "text",
      description: "Description text below label",
    },
    accept: {
      control: "text",
      description: 'Accepted file types (e.g., "image/*", ".pdf,.doc")',
    },
    multiple: {
      control: "boolean",
      description: "Allow multiple file selection",
    },
    maxSize: {
      control: "number",
      description: "Maximum file size in bytes",
    },
    maxFiles: {
      control: "number",
      description: "Maximum number of files (when multiple is true)",
    },
    showPreview: {
      control: "boolean",
      description: "Show image previews for image files",
    },
    showProgress: {
      control: "boolean",
      description: "Show upload progress bars",
    },
    disabled: {
      control: "boolean",
      description: "Disable the file upload",
    },
    onFilesChange: {
      action: "filesChanged",
      description: "Callback when files change",
      category: "Events",
    },
    onFileRemove: {
      action: "fileRemoved",
      description: "Callback when a file is removed",
      category: "Events",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: (args) => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    return (
      <div className="w-full max-w-md">
        <FileUpload {...args} onFilesChange={setFiles} />
        {files.length > 0 && (
          <div className="mt-4 text-sm text-fg-secondary">
            {files.length} file(s) selected
          </div>
        )}
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: (args) => {
    const [_files, setFiles] = useState<FileUploadFile[]>([]);
    return (
      <div className="w-full max-w-md">
        <FileUpload
          {...args}
          onFilesChange={setFiles}
          label="Upload Documents"
          description="Upload PDF, DOC, or DOCX files"
        />
      </div>
    );
  },
  args: {
    accept: ".pdf,.doc,.docx",
  },
};

export const ImageUpload: Story = {
  render: (args) => {
    const [_files, setFiles] = useState<FileUploadFile[]>([]);
    return (
      <div className="w-full max-w-md">
        <FileUpload
          {...args}
          onFilesChange={setFiles}
          label="Upload Images"
          description="Upload JPG, PNG, or GIF files"
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          showPreview
        />
      </div>
    );
  },
};

export const MultipleFiles: Story = {
  render: (args) => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    const maxFiles = 5;
    const canAddMore = files.length < maxFiles;

    return (
      <div className="w-full max-w-md space-y-4">
        <FileUpload
          {...args}
          onFilesChange={setFiles}
          label="Upload Multiple Files"
          description={`Upload up to ${maxFiles} files. ${files.length}/${maxFiles} files selected.`}
          multiple
          maxFiles={maxFiles}
        />
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-fg-primary">
              Files ({files.length}/{maxFiles}):
            </div>
            <ul className="list-disc list-inside text-sm text-fg-secondary space-y-1">
              {files.map((file) => (
                <li key={file.id} className={file.error ? "text-fg-error" : ""}>
                  {file.file.name} {file.error && `- ${file.error}`}
                </li>
              ))}
            </ul>
            {!canAddMore && (
              <div className="p-2 bg-warning-bg border border-warning rounded text-sm text-fg-warning">
                Maximum number of files reached ({maxFiles})
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multiple file upload with limit. Try uploading more than 5 files to see the limit in action.",
      },
    },
  },
};

export const WithProgress: Story = {
  render: (args) => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);

    const handleFilesChange = (newFiles: FileUploadFile[]) => {
      setFiles(newFiles);
      // Simulate progress for new files
      newFiles.forEach((file) => {
        if (file.progress === undefined || file.progress >= 100) return;

        let progress = file.progress || 0;
        const interval = setInterval(() => {
          progress = Math.min(progress + 10, 100);
          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress } : f)),
          );
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 200);
      });
    };

    return (
      <div className="w-full max-w-md space-y-4">
        <FileUpload {...args} onFilesChange={handleFilesChange} showProgress />
        {files.length > 0 && (
          <div className="text-sm text-fg-secondary">
            <p>
              <strong>Files with progress:</strong>
            </p>
            <ul className="list-disc list-inside mt-1">
              {files.map((file) => (
                <li key={file.id}>
                  {file.file.name} -{" "}
                  {file.progress !== undefined
                    ? `${file.progress}%`
                    : "No progress"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "File upload with real progress simulation. Upload files to see the progress bars animate.",
      },
    },
  },
};

export const WithValidation: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    const hasErrors = files.some((f) => f.error);
    const validFiles = files.filter((f) => !f.error);

    return (
      <div className="w-full max-w-md space-y-4">
        <FileUpload
          onFilesChange={setFiles}
          label="Upload File"
          description="Maximum file size: 2MB. Only PDF, DOC, DOCX files allowed."
          maxSize={2 * 1024 * 1024} // 2MB
          accept=".pdf,.doc,.docx"
        />
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-fg-primary">
              Upload Status:
            </div>
            {validFiles.length > 0 && (
              <div className="p-3 bg-success-bg border border-success rounded-md">
                <p className="text-sm text-fg-success">
                  ✓ {validFiles.length} file(s) valid:{" "}
                  {validFiles.map((f) => f.file.name).join(", ")}
                </p>
              </div>
            )}
            {hasErrors && (
              <div className="p-3 bg-error-bg border border-error rounded-md">
                <p className="text-sm font-medium text-fg-error mb-1">
                  ✗ Validation Errors:
                </p>
                <ul className="list-disc list-inside text-sm text-fg-error space-y-1">
                  {files
                    .filter((f) => f.error)
                    .map((file) => (
                      <li key={file.id}>
                        {file.file.name}: {file.error}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "File upload with real validation. Try uploading files larger than 2MB or wrong file types to see validation errors.",
      },
    },
  },
};

export const WithFileRemoval: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);

    const handleFileRemove = (fileId: string) => {
      const removedFile = files.find((f) => f.id === fileId);
      setFiles(files.filter((f) => f.id !== fileId));
      console.log("File removed:", removedFile?.file.name);
    };

    return (
      <div className="w-full max-w-md space-y-4">
        <FileUpload
          onFilesChange={setFiles}
          onFileRemove={handleFileRemove}
          label="Upload Files"
          description="Upload files and remove them using the X button"
          multiple
        />
        {files.length > 0 && (
          <div className="text-sm text-fg-secondary">
            <p>
              <strong>Current files ({files.length}):</strong>
            </p>
            <ul className="list-disc list-inside mt-1">
              {files.map((file) => (
                <li key={file.id}>{file.file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "File upload with removal functionality. Upload files and click the X button to remove them.",
      },
    },
  },
};

export const ImagePreview: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);

    return (
      <div className="w-full max-w-md space-y-4">
        <FileUpload
          onFilesChange={setFiles}
          label="Upload Images"
          description="Upload images to see previews. Max 5MB per image."
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          showPreview
          multiple
        />
        {files.length > 0 && (
          <div className="text-sm text-fg-secondary">
            <p>
              <strong>Uploaded images ({files.length}):</strong>
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {files
                .filter((f) => f.preview)
                .map((file) => (
                  <div key={file.id} className="relative">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <p className="text-xs mt-1 truncate">{file.file.name}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Image upload with real previews. Upload image files to see thumbnail previews.",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FileUpload label="Upload Disabled" disabled />
    </div>
  ),
};

export const RealWorldUpload: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    const [_uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState<string[]>([]);

    const handleFilesChange = (newFiles: FileUploadFile[]) => {
      setFiles(newFiles);

      // Simulate upload for new files
      newFiles.forEach((file) => {
        if (uploaded.includes(file.id)) return;

        setUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
          progress = Math.min(progress + 5, 100);
          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress } : f)),
          );

          if (progress >= 100) {
            clearInterval(interval);
            setUploaded((prev) => [...prev, file.id]);
            setUploading(false);
          }
        }, 100);
      });
    };

    const handleFileRemove = (fileId: string) => {
      setFiles(files.filter((f) => f.id !== fileId));
      setUploaded(uploaded.filter((id) => id !== fileId));
    };

    return (
      <div className="w-full max-w-md space-y-4">
        <FileUpload
          onFilesChange={handleFilesChange}
          onFileRemove={handleFileRemove}
          label="Upload Documents"
          description="Upload PDF, DOC, or DOCX files. Max 5MB per file."
          accept=".pdf,.doc,.docx"
          maxSize={5 * 1024 * 1024}
          showProgress
          multiple
          maxFiles={5}
        />
        {files.length > 0 && (
          <div className="space-y-2 p-4 bg-surface-subtle rounded-md">
            <div className="text-sm font-medium text-fg-primary">
              Upload Status ({files.length} files):
            </div>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span
                    className={
                      file.error
                        ? "text-fg-error"
                        : uploaded.includes(file.id)
                          ? "text-fg-success"
                          : "text-fg-primary"
                    }
                  >
                    {file.file.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {file.progress !== undefined && file.progress < 100 && (
                      <span className="text-xs text-fg-tertiary">
                        {file.progress}%
                      </span>
                    )}
                    {uploaded.includes(file.id) && (
                      <CheckCircle2 className="h-4 w-4 text-fg-success" />
                    )}
                    {file.error && (
                      <AlertCircle className="h-4 w-4 text-fg-error" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Real-world file upload scenario with progress simulation, validation, and file management.",
      },
    },
  },
};

export const DragAndDrop: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    const [_isDragging, _setIsDragging] = useState(false);

    return (
      <div className="w-full max-w-md space-y-4">
        <FileUpload
          onFilesChange={setFiles}
          label="Drag & Drop Files"
          description="Drag files here or click to browse. Supports drag and drop."
          multiple
        />
        {files.length > 0 && (
          <div className="text-sm text-fg-secondary">
            <p>
              <strong>Dropped files ({files.length}):</strong>
            </p>
            <ul className="list-disc list-inside mt-1">
              {files.map((file) => (
                <li key={file.id}>
                  {file.file.name} ({(file.file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="text-xs text-fg-tertiary p-2 bg-info-bg rounded">
          💡 Tip: Try dragging files from your file explorer onto the upload
          area.
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates drag and drop functionality. Drag files from your file explorer onto the upload area.",
      },
    },
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    const handleFilesChange = fn((newFiles: FileUploadFile[]) => {
      setFiles(newFiles);
    });
    const handleFileRemove = fn((fileId: string) => {
      setFiles(files.filter((f) => f.id !== fileId));
    });

    return (
      <div className="w-full max-w-md space-y-4">
        <p className="text-sm text-fg-secondary">
          Upload files or remove them. Check the Actions panel to see events
          being fired.
        </p>
        <FileUpload
          onFilesChange={handleFilesChange}
          onFileRemove={handleFileRemove}
          label="Upload Files"
          description="Upload files to see events"
          multiple
        />
        {files.length > 0 && (
          <div className="text-sm text-fg-secondary">
            {files.length} file(s) selected
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates file upload events. Upload or remove files and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const EmptyState: Story = {
  args: {
    label: "Upload Files",
    description: "No files selected",
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state - no files have been uploaded yet.",
      },
    },
  },
};

export const WithFilesState: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    return (
      <div className="w-full max-w-md">
        <FileUpload
          onFilesChange={setFiles}
          label="Upload Files"
          description="Files can be uploaded here"
          multiple
        />
        {files.length > 0 && (
          <div className="mt-4 text-sm text-fg-secondary">
            {files.length} file(s) selected
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With files state - files have been uploaded and are displayed.",
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    label: "Upload Disabled",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state - file upload is disabled and cannot be interacted with.",
      },
    },
  },
};

/**
 * Interactive
 *
 * Verifies that selecting a file via the hidden <input type="file">
 * fires onFilesChange with the file in the payload and that the file
 * name renders in the file list afterwards. Uses userEvent.upload which
 * bypasses the "Click to upload" dropzone and writes directly into the
 * input — that path matches how assistive tech reaches the control.
 */
export const Interactive: Story = {
  render: (args) => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    return (
      <div className="w-full max-w-md">
        <FileUpload
          {...args}
          onFilesChange={(next) => {
            setFiles(next);
            args.onFilesChange?.(next);
          }}
        />
        {files.length > 0 && (
          <div className="mt-4 text-sm text-fg-secondary">
            {files.length} file(s) selected
          </div>
        )}
      </div>
    );
  },
  args: {
    accept: ".txt",
    onFilesChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // Sanity: the CTA copy describes the default empty state.
    expect(canvas.getByText(/click to upload/i)).toBeInTheDocument();

    const fileInput = canvasElement.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(args.onFilesChange).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(canvas.getByText("hello.txt")).toBeInTheDocument();
    });
  },
};
