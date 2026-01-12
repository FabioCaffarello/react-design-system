import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FileUpload from './FileUpload';
import type { FileUploadFile } from './FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'Molecules/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    multiple: {
      control: 'boolean',
    },
    showPreview: {
      control: 'boolean',
    },
    showProgress: {
      control: 'boolean',
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
        <FileUpload
          {...args}
          onFilesChange={setFiles}
        />
        {files.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
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
    accept: '.pdf,.doc,.docx',
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
    return (
      <div className="w-full max-w-md">
        <FileUpload
          {...args}
          onFilesChange={setFiles}
          label="Upload Multiple Files"
          multiple
          maxFiles={5}
        />
        {files.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            {files.length} of 5 files selected
          </div>
        )}
      </div>
    );
  },
};

export const WithProgress: Story = {
  render: (args) => {
    const [_files, setFiles] = useState<FileUploadFile[]>([]);
    
    const handleFilesChange = (newFiles: FileUploadFile[]) => {
      setFiles(newFiles);
      // Simulate progress
      newFiles.forEach((file) => {
        if (!file.progress) return;
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress } : f
            )
          );
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 200);
      });
    };
    
    return (
      <div className="w-full max-w-md">
        <FileUpload
          {...args}
          onFilesChange={handleFilesChange}
          showProgress
        />
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    return (
      <div className="w-full max-w-md">
        <FileUpload
          onFilesChange={setFiles}
          label="Upload File"
          description="Maximum file size: 2MB"
          maxSize={2 * 1024 * 1024} // 2MB
          accept=".pdf,.doc,.docx"
        />
        {files.some((f) => f.error) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Some files failed validation. Please check the errors above.
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FileUpload
        label="Upload Disabled"
        disabled
      />
    </div>
  ),
};
