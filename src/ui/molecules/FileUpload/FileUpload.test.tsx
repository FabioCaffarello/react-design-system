import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from './FileUpload';

// Mock FileReader
global.FileReader = class FileReader {
  result: string | null = null;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  
  readAsDataURL(_file: Blob) {
    setTimeout(() => {
      this.result = 'data:image/png;base64,mock';
      if (this.onload) {
        this.onload({} as ProgressEvent<FileReader>);
      }
    }, 0);
  }
} as unknown as typeof FileReader;

describe('FileUpload', () => {
  it('renders correctly', () => {
    render(<FileUpload />);
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    const handleFilesChange = vi.fn();
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    const { container } = render(<FileUpload onFilesChange={handleFilesChange} />);
    
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    
    // Create a FileList-like object
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    Object.defineProperty(input, 'files', {
      value: dataTransfer.files,
      writable: false,
      configurable: true,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(handleFilesChange).toHaveBeenCalled();
      const callArgs = handleFilesChange.mock.calls[0];
      expect(callArgs).toBeDefined();
      expect(callArgs[0]).toBeDefined();
    }, { timeout: 2000 });
  });

  it('validates file size', async () => {
    const handleFilesChange = vi.fn();
    const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.txt', {
      type: 'text/plain',
    });
    
    render(<FileUpload maxSize={5 * 1024 * 1024} onFilesChange={handleFilesChange} />);
    
    const input = document.querySelector('input[type="file"]');
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [largeFile],
        writable: false,
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(handleFilesChange).toHaveBeenCalled();
        const files = handleFilesChange.mock.calls[0][0];
        expect(files[0].error).toBeTruthy();
      });
    }
  });

  it('handles drag and drop', () => {
    const handleFilesChange = vi.fn();
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    render(<FileUpload onFilesChange={handleFilesChange} />);
    
    const dropZone = screen.getByText(/Click to upload/i).closest('div');
    
    if (dropZone) {
      fireEvent.dragOver(dropZone);
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });
      
      expect(handleFilesChange).toHaveBeenCalled();
    }
  });

  it('displays label and description', () => {
    render(
      <FileUpload
        label="Upload Files"
        description="Select files to upload"
      />
    );
    expect(screen.getByText('Upload Files')).toBeInTheDocument();
    expect(screen.getByText('Select files to upload')).toBeInTheDocument();
  });
});
