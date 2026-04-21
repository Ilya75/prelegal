import { defaultFormData, NdaFormData } from '@/lib/types';

describe('NdaFormData / defaultFormData', () => {
  describe('Required fields present', () => {
    const requiredFields: (keyof NdaFormData)[] = [
      'purpose',
      'effectiveDate',
      'mndaTermType',
      'mndaTermYears',
      'confidentialityType',
      'confidentialityYears',
      'governingLaw',
      'jurisdiction',
      'party1Company',
      'party1Name',
      'party1Title',
      'party1Address',
      'party2Company',
      'party2Name',
      'party2Title',
      'party2Address',
      'modifications',
    ];

    requiredFields.forEach((field) => {
      it(`has field: ${field}`, () => {
        expect(defaultFormData).toHaveProperty(field);
      });
    });

    it('has exactly the expected number of fields', () => {
      expect(Object.keys(defaultFormData)).toHaveLength(requiredFields.length);
    });
  });

  describe('Default values', () => {
    it('has a non-empty default purpose', () => {
      expect(defaultFormData.purpose).toBeTruthy();
      expect(typeof defaultFormData.purpose).toBe('string');
    });

    it('purpose mentions business relationship evaluation', () => {
      expect(defaultFormData.purpose.toLowerCase()).toContain('business relationship');
    });

    it('effectiveDate is empty string', () => {
      expect(defaultFormData.effectiveDate).toBe('');
    });

    it('mndaTermType defaults to expires', () => {
      expect(defaultFormData.mndaTermType).toBe('expires');
    });

    it('mndaTermYears defaults to 1', () => {
      expect(defaultFormData.mndaTermYears).toBe('1');
    });

    it('confidentialityType defaults to years', () => {
      expect(defaultFormData.confidentialityType).toBe('years');
    });

    it('confidentialityYears defaults to 1', () => {
      expect(defaultFormData.confidentialityYears).toBe('1');
    });

    it('governingLaw is empty string', () => {
      expect(defaultFormData.governingLaw).toBe('');
    });

    it('jurisdiction is empty string', () => {
      expect(defaultFormData.jurisdiction).toBe('');
    });

    it('modifications is empty string', () => {
      expect(defaultFormData.modifications).toBe('');
    });
  });

  describe('Party fields are empty by default', () => {
    const partyFields: (keyof NdaFormData)[] = [
      'party1Company',
      'party1Name',
      'party1Title',
      'party1Address',
      'party2Company',
      'party2Name',
      'party2Title',
      'party2Address',
    ];

    partyFields.forEach((field) => {
      it(`${field} is empty string`, () => {
        expect(defaultFormData[field]).toBe('');
      });
    });
  });

  describe('Type constraints', () => {
    it('mndaTermType is a valid union value', () => {
      expect(['expires', 'until_terminated']).toContain(defaultFormData.mndaTermType);
    });

    it('confidentialityType is a valid union value', () => {
      expect(['years', 'perpetuity']).toContain(defaultFormData.confidentialityType);
    });

    it('all string fields are strings', () => {
      for (const [, value] of Object.entries(defaultFormData)) {
        expect(typeof value).toBe('string');
      }
    });
  });

  describe('Immutability — spreading does not mutate original', () => {
    it('spread creates a new object', () => {
      const copy = { ...defaultFormData };
      expect(copy).not.toBe(defaultFormData);
    });

    it('mutating a spread copy does not affect defaultFormData', () => {
      const copy = { ...defaultFormData, purpose: 'changed' };
      expect(defaultFormData.purpose).not.toBe('changed');
      expect(copy.purpose).toBe('changed');
    });
  });
});
