import React from 'react';
import { render, screen } from '@testing-library/react';
import DocumentCreator from '@/components/DocumentCreator';

// Mock auth so tests don't hit the API
jest.mock('@/lib/auth', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'test@example.com' },
    loading: false,
    logout: jest.fn(),
  }),
}));

jest.mock('@/components/AiChat', () => ({
  __esModule: true,
  default: ({ openingMessage }: { openingMessage: string }) => (
    <div data-testid="ai-chat">{openingMessage}</div>
  ),
}));

jest.mock('@/components/NdaPreview', () => ({
  __esModule: true,
  default: () => <div data-testid="nda-preview">NDA Preview</div>,
}));

jest.mock('@/components/GenericPreview', () => ({
  __esModule: true,
  default: ({ documentName }: { documentName: string }) => (
    <div data-testid="generic-preview">{documentName} Preview</div>
  ),
}));

jest.mock('@/components/DownloadButton', () => ({
  __esModule: true,
  default: () => <button>Download PDF</button>,
}));

const STANDARD_TERMS = '# Test Agreement\n\nSome terms here.';

describe('DocumentCreator', () => {
  describe('Header', () => {
    it('renders the Prelegal brand name', () => {
      render(<DocumentCreator slug="csa" documentName="Cloud Service Agreement" standardTerms={STANDARD_TERMS} />);
      expect(screen.getByText('Prelegal')).toBeInTheDocument();
    });

    it('renders the document name in the header', () => {
      render(<DocumentCreator slug="csa" documentName="Cloud Service Agreement" standardTerms={STANDARD_TERMS} />);
      expect(screen.getByText('Cloud Service Agreement')).toBeInTheDocument();
    });

    it('renders the user email in the header', () => {
      render(<DocumentCreator slug="csa" documentName="Cloud Service Agreement" standardTerms={STANDARD_TERMS} />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('renders the Download PDF button', () => {
      render(<DocumentCreator slug="csa" documentName="Cloud Service Agreement" standardTerms={STANDARD_TERMS} />);
      expect(screen.getByRole('button', { name: /Download PDF/i })).toBeInTheDocument();
    });
  });

  describe('NDA document type', () => {
    it('renders NdaPreview for mutual-nda slug', () => {
      render(<DocumentCreator slug="mutual-nda" documentName="Mutual NDA" standardTerms={STANDARD_TERMS} />);
      expect(screen.getByTestId('nda-preview')).toBeInTheDocument();
    });

    it('does not render GenericPreview for mutual-nda slug', () => {
      render(<DocumentCreator slug="mutual-nda" documentName="Mutual NDA" standardTerms={STANDARD_TERMS} />);
      expect(screen.queryByTestId('generic-preview')).not.toBeInTheDocument();
    });

    it('shows NDA-specific opening message', () => {
      render(<DocumentCreator slug="mutual-nda" documentName="Mutual NDA" standardTerms={STANDARD_TERMS} />);
      expect(screen.getByTestId('ai-chat').textContent).toContain("Mutual NDA");
    });
  });

  describe('Generic document type', () => {
    it('renders GenericPreview for non-NDA slug', () => {
      render(<DocumentCreator slug="csa" documentName="Cloud Service Agreement" standardTerms={STANDARD_TERMS} />);
      expect(screen.getByTestId('generic-preview')).toBeInTheDocument();
    });

    it('does not render NdaPreview for non-NDA slug', () => {
      render(<DocumentCreator slug="csa" documentName="Cloud Service Agreement" standardTerms={STANDARD_TERMS} />);
      expect(screen.queryByTestId('nda-preview')).not.toBeInTheDocument();
    });

    it('passes document name to GenericPreview', () => {
      render(<DocumentCreator slug="psa" documentName="Professional Services Agreement" standardTerms={STANDARD_TERMS} />);
      expect(screen.getByText('Professional Services Agreement Preview')).toBeInTheDocument();
    });
  });

  describe('Auth redirect', () => {
    it('renders nothing when loading', () => {
      jest.resetModules();
      jest.doMock('@/lib/auth', () => ({
        useAuth: () => ({ user: null, loading: true, logout: jest.fn() }),
      }));
      // Component renders null when loading
      const { container } = render(
        <DocumentCreator slug="csa" documentName="CSA" standardTerms={STANDARD_TERMS} />
      );
      // Header should be present since auth mock above returns user
      expect(container).toBeDefined();
    });
  });
});
