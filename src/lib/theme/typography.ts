const primaryFont = '"Open Sans", sans-serif';
const secondaryFont = '"Manrope", sans-serif';

export const typography = {
  fontFamily: primaryFont,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    lineHeight: 80 / 64,
    fontSize: '2.5rem',
    fontFamily: secondaryFont,
  },
  h2: {
    fontWeight: 700,
    lineHeight: 64 / 48,
    fontSize: '2rem',
    fontFamily: secondaryFont,
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: '1.75rem',
    fontFamily: secondaryFont,
  },
  h4: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: '1.5rem',
    fontFamily: secondaryFont,
  },
  h5: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: '1.25rem',
    fontFamily: secondaryFont,
  },
  h6: {
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: '1rem',
    fontFamily: secondaryFont,
  },
  subtitle1: {
    fontFamily: primaryFont,
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: '1rem',
  },
  subtitle2: {
    fontFamily: primaryFont,
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: '0.875rem',
  },
  body1: {
    fontFamily: primaryFont,
    lineHeight: 1.5,
    fontSize: '1rem',
  },
  body2: {
    fontFamily: primaryFont,
    lineHeight: 22 / 14,
    fontSize: '0.875rem',
  },
  caption: {
    fontFamily: primaryFont,
    lineHeight: 1.5,
    fontSize: '0.75rem',
  },
  button: {
    fontFamily: primaryFont,
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: '0.875rem',
    textTransform: 'capitalize',
  },
} as const;
