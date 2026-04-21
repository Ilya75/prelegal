import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DownloadButton from '@/components/DownloadButton';

jest.mock('html2pdf.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

function getHtml2pdfMock() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return jest.requireMock('html2pdf.js').default as jest.Mock;
}

function buildChain(saveFn = jest.fn().mockResolvedValue(undefined)) {
  const chain = {
    set: jest.fn(),
    from: jest.fn(),
    save: saveFn,
  };
  chain.set.mockReturnValue(chain);
  chain.from.mockReturnValue(chain);
  return chain;
}

describe('DownloadButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default rendering', () => {
    it('renders a button', () => {
      render(<DownloadButton />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows "Download PDF" text by default', () => {
      render(<DownloadButton />);
      expect(screen.getByText('Download PDF')).toBeInTheDocument();
    });

    it('is not disabled by default', () => {
      render(<DownloadButton />);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('No #nda-document element', () => {
    it('does nothing when the target element does not exist', async () => {
      const mock = getHtml2pdfMock();
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(mock).not.toHaveBeenCalled();
    });

    it('button remains enabled when there is no target element', async () => {
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('With #nda-document element present', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
      div = document.createElement('div');
      div.id = 'nda-document';
      document.body.appendChild(div);
    });

    afterEach(() => {
      if (div.parentNode) {
        document.body.removeChild(div);
      }
    });

    it('calls html2pdf when button is clicked', async () => {
      const mock = getHtml2pdfMock();
      mock.mockReturnValue(buildChain());
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(mock).toHaveBeenCalled();
    });

    it('calls .set() with correct filename', async () => {
      const chain = buildChain();
      getHtml2pdfMock().mockReturnValue(chain);
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(chain.set).toHaveBeenCalledWith(
        expect.objectContaining({ filename: 'mutual-nda.pdf' })
      );
    });

    it('calls .set() with correct margins', async () => {
      const chain = buildChain();
      getHtml2pdfMock().mockReturnValue(chain);
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(chain.set).toHaveBeenCalledWith(
        expect.objectContaining({ margin: [15, 15, 15, 15] })
      );
    });

    it('calls .set() with html2canvas scale=2 and useCORS=true', async () => {
      const chain = buildChain();
      getHtml2pdfMock().mockReturnValue(chain);
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(chain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          html2canvas: { scale: 2, useCORS: true },
        })
      );
    });

    it('calls .set() with jsPDF A4 portrait', async () => {
      const chain = buildChain();
      getHtml2pdfMock().mockReturnValue(chain);
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(chain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
      );
    });

    it('calls .from() with the #nda-document DOM element', async () => {
      const chain = buildChain();
      getHtml2pdfMock().mockReturnValue(chain);
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(chain.from).toHaveBeenCalledWith(div);
    });

    it('calls .save()', async () => {
      const saveFn = jest.fn().mockResolvedValue(undefined);
      getHtml2pdfMock().mockReturnValue(buildChain(saveFn));
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(saveFn).toHaveBeenCalled();
    });

    it('shows "Generating…" while save is pending', async () => {
      let resolve!: () => void;
      const saveFn = jest.fn(() => new Promise<void>((r) => { resolve = r; }));
      getHtml2pdfMock().mockReturnValue(buildChain(saveFn));
      render(<DownloadButton />);

      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(screen.getByText('Generating…')).toBeInTheDocument());

      // Clean up — resolve the pending promise inside act
      await act(async () => { resolve(); });
    });

    it('disables the button while loading', async () => {
      let resolve!: () => void;
      const saveFn = jest.fn(() => new Promise<void>((r) => { resolve = r; }));
      getHtml2pdfMock().mockReturnValue(buildChain(saveFn));
      render(<DownloadButton />);

      fireEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(screen.getByRole('button')).toBeDisabled());

      await act(async () => { resolve(); });
    });

    it('re-enables button and shows "Download PDF" after completion', async () => {
      getHtml2pdfMock().mockReturnValue(buildChain());
      render(<DownloadButton />);
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(screen.getByRole('button')).not.toBeDisabled();
      expect(screen.getByText('Download PDF')).toBeInTheDocument();
    });
  });
});
